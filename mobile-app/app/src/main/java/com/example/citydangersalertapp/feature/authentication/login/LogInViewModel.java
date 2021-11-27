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
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

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
            MyCustomVariables.getDatabaseReference()
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            if (snapshot.exists()) {
                                for (DataSnapshot list : snapshot.getChildren()) {
                                    for (DataSnapshot profile : list.getChildren()) {
                                        if (profile.hasChild("personalInformation") &&
                                                profile.child("personalInformation").hasChild("admin") &&
                                                profile.child("personalInformation").hasChild("email")) {
                                            final String adminValue =
                                                    String.valueOf(profile.child("personalInformation").child("admin").getValue());

                                            final String emailValue =
                                                    String.valueOf(profile.child("personalInformation").child("email").getValue());

                                            final boolean hasAccess = enteredEmail.equals(emailValue) &&
                                                    adminValue.equals("false");

                                            final boolean doesNotHaveAccess = enteredEmail.equals(emailValue) &&
                                                    adminValue.equals("true");

                                            // if the entered email is not admin
                                            if (hasAccess) {
                                                MyCustomVariables.getFirebaseAuth()
                                                        .signInWithEmailAndPassword(enteredEmail, enteredPassword)
                                                        .addOnCompleteListener((final Task<AuthResult> signInTask) -> {
                                                            MyCustomMethods.closeTheKeyboard(currentActivity);
                                                            // verifying if user's email is verified if the credentials match
                                                            if (signInTask.isSuccessful() &&
                                                                    MyCustomVariables.getFirebaseAuth().getCurrentUser() != null) {
                                                                if (MyCustomVariables.getFirebaseAuth().getCurrentUser().isEmailVerified()) {
                                                                    currentActivity.finish();
                                                                    currentActivity.startActivity(new Intent(currentActivity, HomeActivity.class));
                                                                } else {
                                                                    MyCustomMethods.showShortMessage(currentActivity,
                                                                            "Please verify your email");
                                                                    resetUserPassword();
                                                                }

                                                            }
                                                            // removing the entered password and
                                                            // showing message if the credentials don't match
                                                            else {
                                                                MyCustomMethods.showShortMessage(currentActivity,
                                                                        "Incorrect username or password");
                                                                resetUserPassword();
                                                            }
                                                        });
                                            }
                                            // if the entered email is admin
                                            else if (doesNotHaveAccess) {
                                                MyCustomMethods.showShortMessage(currentActivity, "Access denied");
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {

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