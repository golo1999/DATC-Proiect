package com.example.citydangersalertapp.feature.nearbydangersmap;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.NearbyDangersMapFragmentBinding;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.model.UserLocation;
import com.example.citydangersalertapp.utility.JsonPlaceHolderAPI;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class NearbyDangersMapFragment extends Fragment implements OnMapReadyCallback {
    private NearbyDangersMapFragmentBinding binding;
    private JsonPlaceHolderAPI api;
    private final ArrayList<MarkerOptions> reportsLocationList = new ArrayList<>();

    public NearbyDangersMapFragment() {
        // Required empty public constructor
    }

    public static NearbyDangersMapFragment newInstance() {
        NearbyDangersMapFragment fragment = new NearbyDangersMapFragment();
        Bundle args = new Bundle();

        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        setFragmentVariables(inflater, container);
        setLayoutVariables();
        initializeMap();

        return binding.getRoot();
    }

    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();

        if (currentUserId != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            final Call<UserLocation> userLocationCall = api.getUserLocation();

                            userLocationCall.enqueue(new Callback<UserLocation>() {
                                @Override
                                public void onResponse(@NonNull Call<UserLocation> call,
                                                       @NonNull Response<UserLocation> response) {
                                    UserLocation fetchedUserLocation = response.isSuccessful() ?
                                            response.body() : new UserLocation(51.509865, -0.118092);

                                    if (fetchedUserLocation != null) {
                                        final LatLng currentLocationCoordinates =
                                                new LatLng(fetchedUserLocation.getLatitude(),
                                                        fetchedUserLocation.getLongitude());

                                        final CameraPosition cameraPosition = new CameraPosition.Builder()
                                                .target(currentLocationCoordinates)
                                                .zoom(16)
                                                .build();

                                        googleMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));

                                        if (snapshot.exists()) {
                                            if (!reportsLocationList.isEmpty()) {
                                                reportsLocationList.clear();
                                            }

                                            for (final DataSnapshot userSnapshot : snapshot.getChildren()) {
                                                if (userSnapshot.hasChild("personalReports")) {
                                                    for (final DataSnapshot reportSnapshot :
                                                            userSnapshot.child("personalReports").getChildren()) {
                                                        final Report report = reportSnapshot.getValue(Report.class);

                                                        if (report != null && report.getLocation() != null) {
                                                            reportsLocationList.add(new MarkerOptions()
                                                                    .position(new LatLng(report.getLocation().getLatitude(),
                                                                            report.getLocation().getLongitude()))
                                                                    .title(report.getNote() != null ?
                                                                            report.getNote() : "No note provided"));
                                                        }
                                                    }
                                                }
                                            }

                                            if (!reportsLocationList.isEmpty()) {
                                                reportsLocationList.forEach(googleMap::addMarker);
                                            }
                                        }
                                    }
                                }

                                @Override
                                public void onFailure(@NonNull Call<UserLocation> call,
                                                      @NonNull Throwable t) {

                                }
                            });
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {

                        }
                    });
        }
    }

    private void initializeMap() {
        SupportMapFragment mapFragment =
                (SupportMapFragment) getChildFragmentManager().findFragmentById(binding.mapContainer.getId());

        if (mapFragment != null) {
            mapFragment.getMapAsync(NearbyDangersMapFragment.this);
        }
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        Retrofit retrofit;

        binding = DataBindingUtil.inflate(inflater, R.layout.nearby_dangers_map_fragment, container, false);
        retrofit = new Retrofit.Builder()
                .baseUrl(MyCustomVariables.getLocationApiBaseUrl())
                .addConverterFactory(GsonConverterFactory.create()).build();
        api = retrofit.create(JsonPlaceHolderAPI.class);
    }

    private void setLayoutVariables() {

    }
}