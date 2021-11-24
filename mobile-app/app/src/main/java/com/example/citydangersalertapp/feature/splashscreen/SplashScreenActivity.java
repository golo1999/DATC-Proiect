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
        startSplashScreen();
    }

    private void setVariables() {
        binding = DataBindingUtil.setContentView(this, R.layout.splash_screen_activity);
    }

    private void startSplashScreen() {
        launcher.start();
    }

    public class LogoLauncher extends Thread {
        private final boolean userIsAuthenticated = MyCustomVariables.getFirebaseAuth().getCurrentUser() != null;

        public void run() {
            try {
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                MyCustomMethods.goToActivityWithoutTransition(SplashScreenActivity.this,
                        userIsAuthenticated ? HomeActivity.class : AuthenticationActivity.class);
            }
        }
    }
}