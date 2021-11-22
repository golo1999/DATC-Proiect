package com.example.citydangersalertapp.feature.authentication.login;

import android.app.Activity;
import android.content.Intent;
import android.util.Patterns;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.feature.authentication.register.RegisterFragment;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;

public class LogInViewModel extends ViewModel {
    private final ObservableField<String> userEmail = new ObservableField<>("");
    private final ObservableField<String> userPassword = new ObservableField<>("");

    public ObservableField<String> getUserEmail() {
        return userEmail;
    }

    public ObservableField<String> getUserPassword() {
        return userPassword;
    }

    public void resetUserPassword() {
        this.userPassword.set("");
    }

    public void logInHandler(@NonNull Activity currentActivity,
                             String enteredEmail,
                             String enteredPassword) {
        // proceeding to login if the email is valid & the password has got at least 8 characters
        if (loginIsValid(currentActivity, enteredEmail, enteredPassword)) {
            MyCustomVariables.getFirebaseAuth()
                    .signInWithEmailAndPassword(enteredEmail, enteredPassword)
                    .addOnCompleteListener((final Task<AuthResult> task) -> {
                        MyCustomMethods.closeTheKeyboard(currentActivity);
                        // verifying if user's email is verified if the credentials match
                        if (task.isSuccessful()) {
                            if (MyCustomVariables.getFirebaseAuth().getCurrentUser() != null) {
                                if (MyCustomVariables.getFirebaseAuth().getCurrentUser().isEmailVerified()) {
                                    currentActivity.finish();
                                    currentActivity.startActivity(new Intent(currentActivity, HomeActivity.class));
                                } else {
                                    MyCustomMethods.showShortMessage(currentActivity, "Please verify your email");

                                    resetUserPassword();
                                }
                            }
                        }
                        // removing the entered password & showing message if the credentials don't match
                        else {
//                            MyCustomMethods.showShortMessage(currentActivity, "Incorrect username or password");
//
//                            resetUserPassword();

                            currentActivity.finish();
                            currentActivity.startActivity(new Intent(currentActivity, HomeActivity.class));
                        }
                    });
        }

        MyCustomMethods.closeTheKeyboard(currentActivity);
    }

    private boolean loginIsValid(@NonNull Activity currentActivity,
                                 String email,
                                 String password) {
        if (Patterns.EMAIL_ADDRESS.matcher(email).matches() && password.length() >= 8) {
            return true;
        } else if (email.isEmpty() && password.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity, "Email and password should not be empty");
        } else if (email.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity, "Email should not be empty");
        } else if (password.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity, "Password should not be empty");
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches() && password.length() < 8) {
            MyCustomMethods.showShortMessage(currentActivity, "Both email address and password are not valid");
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            MyCustomMethods.showShortMessage(currentActivity, "Email address is not valid");
        } else {
            MyCustomMethods.showShortMessage(currentActivity, "Password should have at least 8 characters");
        }

        return false;
    }

    public void registerHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(new RegisterFragment());
    }
}