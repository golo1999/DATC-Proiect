package com.example.citydangersalertapp.feature.authentication;

import android.app.Activity;
import android.content.Intent;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;

public class LogInViewModel extends ViewModel {
    private final ObservableField<String> userEmail = new ObservableField<>("");
    private final ObservableField<String> userPassword = new ObservableField<>("");

    public ObservableField<String> getUserEmail() {
        return userEmail;
    }

    public ObservableField<String> getUserPassword() {
        return userPassword;
    }

    public void logInHandler(@NonNull Activity currentActivity,
                             String enteredEmail,
                             String enteredPassword) {
        Toast.makeText(currentActivity, enteredEmail + " " + enteredPassword, Toast.LENGTH_SHORT).show();
        currentActivity.finish();
        currentActivity.startActivity(new Intent(currentActivity, HomeActivity.class));
    }

    public void registerHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(new RegisterFragment());
    }
}