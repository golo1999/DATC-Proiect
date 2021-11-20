package com.example.citydangersalertapp.feature.authentication;

import android.app.Activity;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

public class RegisterViewModel extends ViewModel {
    private final ObservableField<String> userEmail = new ObservableField<>("");
    private final ObservableField<String> userPassword = new ObservableField<>("");
    private final ObservableField<String> userFirstName = new ObservableField<>("");
    private final ObservableField<String> userLastName = new ObservableField<>("");
    private final ObservableField<String> userPIN = new ObservableField<>("");

    public ObservableField<String> getUserEmail() {
        return userEmail;
    }

    public ObservableField<String> getUserPassword() {
        return userPassword;
    }

    public ObservableField<String> getUserFirstName() {
        return userFirstName;
    }

    public ObservableField<String> getUserLastName() {
        return userLastName;
    }

    public ObservableField<String> getUserPIN() {
        return userPIN;
    }

    public void loginHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(new LogInFragment());
    }

    public void registerHandler(@NonNull Activity currentActivity,
                                String enteredEmail,
                                String enteredPassword,
                                String enteredFirstName,
                                String enteredLastName,
                                String enteredPIN) {
        Toast.makeText(currentActivity, enteredEmail + " " + enteredPassword + " " + enteredFirstName + " " + enteredLastName + " " + enteredPIN, Toast.LENGTH_SHORT).show();
    }
}