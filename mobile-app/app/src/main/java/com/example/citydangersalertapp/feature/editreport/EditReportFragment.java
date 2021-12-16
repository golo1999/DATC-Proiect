package com.example.citydangersalertapp.feature.editreport;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.EditReportFragmentBinding;
import com.example.citydangersalertapp.feature.HomeViewModel;
import com.example.citydangersalertapp.model.AdminPersonalInformation;
import com.example.citydangersalertapp.model.MyCustomDateTime;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.MyCustomMethods;
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

import java.time.LocalDate;
import java.time.LocalTime;

public class EditReportFragment extends Fragment implements OnMapReadyCallback {
    private EditReportFragmentBinding binding;
    private HomeViewModel homeViewModel;
    private EditReportViewModel editReportViewModel;

    public interface OnReportDateTimeReceivedCallback {
        void onReportDateReceived(LocalDate newReportDate);

        void onReportTimeReceived(LocalTime newReportTime);
    }

    final AdapterView.OnItemSelectedListener itemSelectedListener = new AdapterView.OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> parent,
                                   View view,
                                   int position,
                                   long id) {
            if (editReportViewModel.getCategory().get() != position) {
                editReportViewModel.setCategory(position);
            }
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {

        }
    };

    public EditReportFragment() {
        // Required empty public constructor
    }

    public EditReportFragment(HomeViewModel homeViewModel) {
        this.homeViewModel = homeViewModel;
    }

    public static EditReportFragment newInstance() {
        EditReportFragment fragment = new EditReportFragment();
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
        setEditReportPhotoCallback();
        showPhoto();
        setCategoriesSpinnerListener();

        return binding.getRoot();
    }

    @Override
    public void onStart() {
        super.onStart();
        setFieldHints();
//        setPhotoText();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        removeCategoriesSpinnerListener();
        editReportViewModel.resetInputs();

        if (editReportViewModel.getSelectedPhotoUri() != null) {
            editReportViewModel.setSelectedPhotoUri(null);
        }

        if (editReportViewModel.isPhotoRemovable()) {
            editReportViewModel.setPhotoRemovable(false);
        }

        if (editReportViewModel.isPhotoRemoved()) {
            editReportViewModel.setPhotoRemoved(false);
        }
    }

    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        final Report selectedReport = homeViewModel.getSelectedReport();

        googleMap.getUiSettings().setScrollGesturesEnabled(false);
        googleMap.getUiSettings().setZoomGesturesEnabled(false);

        if (selectedReport != null && selectedReport.getLocation() != null) {
            final LatLng reportLocationCoordinates =
                    new LatLng(selectedReport.getLocation().getLatitude(),
                            selectedReport.getLocation().getLongitude());

            final CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(reportLocationCoordinates)
                    .zoom(16)
                    .build();

            googleMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));

            googleMap.addMarker(new MarkerOptions()
                    .position(new LatLng(selectedReport.getLocation().getLatitude(),
                            selectedReport.getLocation().getLongitude()))
                    .title(selectedReport.getNote() != null ?
                            selectedReport.getNote() :
                            requireActivity().getResources().getString(R.string.no_note_provided)));
        }
    }

    private void initializeMap() {
        SupportMapFragment mapFragment =
                (SupportMapFragment) getChildFragmentManager().findFragmentById(binding.map.getId());

        if (mapFragment != null) {
            mapFragment.getMapAsync(EditReportFragment.this);
        }
    }

    private void removeCategoriesSpinnerListener() {
        binding.categoriesSpinner.setOnItemSelectedListener(null);
    }

    private void setEditReportPhotoCallback() {
        ((HomeActivity) requireActivity()).setEditReportPhotoUriCallback(selectedUri -> {
            if (!selectedUri.equals(editReportViewModel.getSelectedPhotoUri())) {
                editReportViewModel.setSelectedPhotoUri(selectedUri);
                binding.photo.setImageURI(editReportViewModel.getSelectedPhotoUri());

                if (binding.photoLayout.getVisibility() != View.VISIBLE) {
                    binding.photoLayout.setVisibility(View.VISIBLE);
                }

                if (!editReportViewModel.isPhotoRemovable()) {
                    editReportViewModel.setPhotoRemovable(true);
                }

                if (editReportViewModel.isPhotoRemoved()) {
                    editReportViewModel.setPhotoRemoved(false);
                }

                setPhotoText();
            }
//            setPhotoText();
//            binding.photoText.setText(requireActivity().getResources().getString(R.string.change_photo));
        });
    }

    private void setFieldHints() {
        final Report selectedReport = homeViewModel.getSelectedReport();

        if (selectedReport != null) {
            final MyCustomDateTime reportDateTime = selectedReport.getDateTime();

            final LocalDate reportFormattedDate =
                    LocalDate.of(reportDateTime.getYear(), reportDateTime.getMonth(), reportDateTime.getDay());

            final LocalTime reportFormattedTime =
                    LocalTime.of(reportDateTime.getHour(), reportDateTime.getMinute(), reportDateTime.getSecond());

            if (selectedReport.getNote() != null) {
                binding.noteField.setHint(selectedReport.getNote());
                editReportViewModel.setNote(selectedReport.getNote());
            }

            if (selectedReport.getCheckedBy() != null) {
                final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();

                if (currentUserId != null) {
                    MyCustomVariables.getDatabaseReference()
                            .child("adminsList")
                            .child(selectedReport.getCheckedBy())
                            .child("personalInformation")
                            .addListenerForSingleValueEvent(new ValueEventListener() {
                                @Override
                                public void onDataChange(@NonNull DataSnapshot snapshot) {
                                    if (snapshot.exists()) {
                                        final AdminPersonalInformation adminPersonalInformation =
                                                snapshot.getValue(AdminPersonalInformation.class);

                                        String solvedByText =
                                                requireActivity().getResources().getString(R.string.solved_by) + " ";

                                        solvedByText += adminPersonalInformation != null ?
                                                (adminPersonalInformation.getFirstName() + " " +
                                                        adminPersonalInformation.getLastName()) :
                                                requireActivity().getResources().getString(R.string.unknown);

                                        binding.solvedText.setText(solvedByText);
                                    }
                                }

                                @Override
                                public void onCancelled(@NonNull DatabaseError error) {

                                }
                            });
                }
            } else {
                binding.solvedText.setText(requireActivity().getResources().getString(R.string.not_solved_yet));
            }

            binding.categoriesSpinner.setSelection(selectedReport.getCategory());

            setReportDateText(reportFormattedDate);
            setReportTimeText(reportFormattedTime);

//            if (selectedReport.getPhotoURL() != null) {
//                if (!editReportViewModel.isPhotoRemovable()) {
//                    editReportViewModel.setPhotoRemovable(true);
//                }
//
//                Picasso.get()
//                        .load(selectedReport.getPhotoURL())
//                        .placeholder(R.color.cardview_dark_background)
//                        .fit()
//                        .into(binding.photo);
//
//                binding.photoLayout.setVisibility(View.VISIBLE);
//            } else {
////                if (editReportViewModel.isPhotoRemovable()) {
////                    editReportViewModel.setPhotoRemovable(false);
////                }
//            }

//            setPhotoText();

//            else if (binding.photoLayout.getVisibility() == View.VISIBLE) {
//                binding.photoLayout.setVisibility(View.GONE);
//            }

            binding.mapContainer.setVisibility(selectedReport.getLocation() != null ? View.VISIBLE : View.GONE);

            if (selectedReport.getLocation() != null) {
                initializeMap();
                binding.locationText.setText(requireActivity().getResources().getString(R.string.change_location));
            } else {
                binding.locationText.setText(requireActivity().getResources().getString(R.string.add_location));
            }
        }
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.edit_report_fragment, container, false);
        editReportViewModel = new ViewModelProvider(requireActivity()).get(EditReportViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((HomeActivity) requireActivity());
        binding.setFragment(this);
        binding.setFragmentManager(requireActivity().getSupportFragmentManager());
        binding.setEditReportViewModel(editReportViewModel);
        binding.setHomeViewModel(homeViewModel);
    }

    public void setPhotoText() {
        binding.photoLayout.setVisibility(editReportViewModel.isPhotoRemovable() ? View.VISIBLE : View.GONE);

        binding.photoText.setText(requireActivity().getResources().getString(editReportViewModel.isPhotoRemovable() ?
                R.string.remove_photo : R.string.add_photo));
    }

    public void setReportDateText(final LocalDate date) {
        final String formattedDate = MyCustomMethods.getFormattedDate(date);

        if (!editReportViewModel.getDate().equals(date)) {
            editReportViewModel.setDate(date);
        }

        binding.dateText.setText(formattedDate);
    }

    public void setReportTimeText(final LocalTime time) {
        final String formattedTime = MyCustomMethods.getFormattedTime(requireContext(), time);

        if (!editReportViewModel.getTime().equals(time)) {
            editReportViewModel.setTime(time);
        }

        binding.timeText.setText(formattedTime);
    }

    private void setCategoriesSpinnerListener() {
        binding.categoriesSpinner.setOnItemSelectedListener(itemSelectedListener);
    }

    public void showPhoto() {
        if (homeViewModel.getSelectedReport().getPhotoURL() != null &&
                !homeViewModel.getSelectedReport().getPhotoURL().trim().isEmpty()) {
            if (!editReportViewModel.isPhotoRemovable()) {
                editReportViewModel.setPhotoRemovable(true);
            }

            editReportViewModel.showPhoto(homeViewModel.getSelectedReport(), binding.photo);
        } else if (editReportViewModel.isPhotoRemovable()) {
            editReportViewModel.setPhotoRemovable(false);
        }

        setPhotoText();
    }
}