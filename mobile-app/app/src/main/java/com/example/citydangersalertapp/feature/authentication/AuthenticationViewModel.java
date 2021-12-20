package com.example.citydangersalertapp.feature.authentication;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.feature.authentication.forgotpassword.*;
import com.example.citydangersalertapp.feature.authentication.login.LogInFragment;
import com.example.citydangersalertapp.feature.authentication.register.*;

public class AuthenticationViewModel extends ViewModel {
    private final LogInFragment logInFragmentInstance = new LogInFragment();
    private final RegisterFragment registerFragmentInstance = new RegisterFragment();
    private final ForgotPasswordFragment forgotPasswordFragmentInstance = new ForgotPasswordFragment();
    private Fragment selectedFragment = logInFragmentInstance;

    public LogInFragment getLogInFragmentInstance() {
        return logInFragmentInstance;
    }

    public RegisterFragment getRegisterFragmentInstance() {
        return registerFragmentInstance;
    }

    public ForgotPasswordFragment getForgotPasswordFragmentInstance() {
        return forgotPasswordFragmentInstance;
    }

    public Fragment getSelectedFragment() {
        return selectedFragment;
    }

    public void setSelectedFragment(Fragment selectedFragment) {
        this.selectedFragment = selectedFragment;
    }

    public void onLogInButtonClickHandler(@NonNull Activity currentActivity) {
        currentActivity.finish();
        currentActivity.startActivity(new Intent(currentActivity, HomeActivity.class));
    }

    public void onRegisterHereClickHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(registerFragmentInstance);
    }
}