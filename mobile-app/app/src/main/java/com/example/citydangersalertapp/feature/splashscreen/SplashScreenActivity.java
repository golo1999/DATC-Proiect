package com.example.citydangersalertapp.feature.splashscreen;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.SplashScreenActivityBinding;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;

public class SplashScreenActivity extends AppCompatActivity {
    private SplashScreenActivityBinding binding;
    private final LogoLauncher launcher = new LogoLauncher();

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setVariables();
//        viewModel.startSplashScreenHandler(launcher);
        startSplashScreen();
    }

    private void setVariables() {
        binding = DataBindingUtil.setContentView(this, R.layout.splash_screen_activity);
//        viewModel = new ViewModelProvider(this).get(SplashScreenViewModel.class);
    }

    private void startSplashScreen() {
        launcher.start();
    }

    public class LogoLauncher extends Thread {

        public void run() {
            try {
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                final boolean userIsAuthenticated = MyCustomVariables.getFirebaseAuth().getCurrentUser() != null;

//                if (MyCustomVariables.getFirebaseAuth().getCurrentUser() != null &&
//                        MyCustomVariables.getFirebaseAuth().getUid() != null) {
//                    MyCustomVariables.getDatabaseReference()
//                            .child(MyCustomVariables.getFirebaseAuth().getUid())
//                            .addListenerForSingleValueEvent(new ValueEventListener() {
//                                @Override
//                                public void onDataChange(final @NonNull DataSnapshot snapshot) {
//                                    if (snapshot.exists() &&
//                                            snapshot.hasChild("ApplicationSettings") &&
//                                            snapshot.hasChild("PersonalInformation")) {
//                                        final ApplicationSettings applicationSettings = snapshot
//                                                .child("ApplicationSettings")
//                                                .getValue(ApplicationSettings.class);
//                                        final PersonalInformation personalInformation = snapshot
//                                                .child("PersonalInformation")
//                                                .getValue(PersonalInformation.class);
//
//                                        if (applicationSettings != null &&
//                                                personalInformation != null) {
//                                            final UserDetails details =
//                                                    new UserDetails(applicationSettings, personalInformation);
//
//                                            if (!userDetailsAlreadyExistInSharedPreferences(details)) {
//                                                saveUserDetailsToSharedPreferences(details);
//                                            }
//
//                                            if (retrieveUserDetailsFromSharedPreferences() != null) {
//                                                final UserDetails userDetails =
//                                                        retrieveUserDetailsFromSharedPreferences();
//
//                                                MyCustomVariables.setUserDetails(userDetails);
//                                            }
//                                        }
//                                    }
//                                }
//
//                                @Override
//                                public void onCancelled(final @NonNull DatabaseError error) {
//
//                                }
//                            });
//                }

                MyCustomMethods.goToActivityWithoutTransition(SplashScreenActivity.this,
                        userIsAuthenticated ? HomeActivity.class : AuthenticationActivity.class);
            }
        }
    }
}