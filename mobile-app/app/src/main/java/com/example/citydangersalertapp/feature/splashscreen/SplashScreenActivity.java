package com.example.citydangersalertapp.feature.splashscreen;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.SplashScreenActivityBinding;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class SplashScreenActivity extends AppCompatActivity {
    private SplashScreenActivityBinding binding;
    private final LogoLauncher launcher = new LogoLauncher();

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setVariables();
        startSplashScreen();
    }

    private void setVariables() {
        binding = DataBindingUtil.setContentView(this, R.layout.splash_screen_activity);
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
                final String currentUserID = MyCustomVariables.getFirebaseAuth().getUid();

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

                                        MyCustomMethods.goToActivityWithoutTransition(SplashScreenActivity.this,
                                                personalInformation != null && !personalInformation.isAdmin() ?
                                                        HomeActivity.class : AuthenticationActivity.class);
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
}