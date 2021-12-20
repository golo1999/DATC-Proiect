package com.example.citydangersalertapp.feature.splashscreen;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.model.UserLocation;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.JsonPlaceHolderAPI;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class SplashScreenActivity extends AppCompatActivity {
    private JsonPlaceHolderAPI api;
    private final LogoLauncher launcher = new LogoLauncher();

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView();
        setActivityVariables();
        startSplashScreen();
    }

    private void setActivityVariables() {
        Retrofit retrofit;

        retrofit = new Retrofit.Builder()
                .baseUrl(MyCustomVariables.getLocationApiBaseUrl())
                .addConverterFactory(GsonConverterFactory.create()).build();
        api = retrofit.create(JsonPlaceHolderAPI.class);
    }

    private void setContentView() {
        DataBindingUtil.setContentView(this, R.layout.splash_screen_activity);
    }

    private void startSplashScreen() {
        launcher.start();
    }

    public class LogoLauncher extends Thread {
        public void run() {
            final String currentUserID = MyCustomVariables.getFirebaseAuth().getUid();
            final Call<UserLocation> userLocationCall = api.getUserLocation();

            userLocationCall.enqueue(new Callback<UserLocation>() {
                @Override
                public void onResponse(@NonNull Call<UserLocation> call,
                                       @NonNull Response<UserLocation> response) {
                    UserLocation fetchedLocation = response.isSuccessful() ?
                            response.body() : MyCustomVariables.getDefaultUserLocation();

                    if (fetchedLocation != null) {
                        MyCustomMethods.saveLocationToSharedPreferences(SplashScreenActivity.this,
                                fetchedLocation, "userLocation");
                    }
                }

                @Override
                public void onFailure(@NonNull Call<UserLocation> call,
                                      @NonNull Throwable t) {

                }
            });

            if (currentUserID != null) {
                MyCustomVariables.getDatabaseReference()
                        .child("usersList")
                        .child(currentUserID)
                        .child("personalInformation")
                        .addListenerForSingleValueEvent(new ValueEventListener() {
                            @Override
                            public void onDataChange(@NonNull DataSnapshot snapshot) {
                                if (snapshot.exists()) {
                                    final UserPersonalInformation personalInformation =
                                            snapshot.getValue(UserPersonalInformation.class);

                                    final String rememberMeChecked = MyCustomMethods
                                            .retrieveRememberMeFromSharedPreferences(SplashScreenActivity.this,
                                                    "rememberMeChecked");

                                    final boolean userCanBeRedirectedToHomePage =
                                            personalInformation != null && !personalInformation.isAdmin() &&
                                                    rememberMeChecked != null && rememberMeChecked.equals("true");

                                    MyCustomMethods.goToActivityWithoutTransition(SplashScreenActivity.this,
                                            userCanBeRedirectedToHomePage ? HomeActivity.class : AuthenticationActivity.class);
                                }
                            }

                            @Override
                            public void onCancelled(@NonNull DatabaseError error) {

                            }
                        });
            } else {
                MyCustomMethods.goToActivityWithoutTransition(SplashScreenActivity.this,
                        AuthenticationActivity.class);
            }
        }
    }
}