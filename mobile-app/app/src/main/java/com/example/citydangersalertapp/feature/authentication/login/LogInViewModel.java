package com.example.citydangersalertapp.feature.authentication.login;

import android.app.Activity;
import android.content.Intent;
import android.util.Patterns;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableBoolean;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.feature.authentication.forgotpassword.ForgotPasswordFragment;
import com.example.citydangersalertapp.feature.authentication.register.*;
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
    private final ObservableBoolean rememberMeChecked = new ObservableBoolean(false);

    public ObservableField<String> getUserEmail() {
        return userEmail;
    }

    public ObservableField<String> getUserPassword() {
        return userPassword;
    }

    public void resetUserPassword() {
        this.userPassword.set("");
    }

    public ObservableBoolean getRememberMeChecked() {
        return rememberMeChecked;
    }

    public void forgotPasswordHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(new ForgotPasswordFragment());
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
                                                                    MyCustomMethods
                                                                            .saveRememberMeToSharedPreferences(currentActivity,
                                                                                    rememberMeChecked.get(),
                                                                                    "rememberMeChecked");

                                                                    currentActivity.finish();
                                                                    currentActivity.startActivity(new Intent(currentActivity, HomeActivity.class));
//                                                                    currentActivity.overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                                                                } else {
                                                                    MyCustomMethods.showShortMessage(currentActivity,
                                                                            currentActivity.getResources().getString(R.string.please_verify_your_email));
                                                                    resetUserPassword();
                                                                }

                                                            }
                                                            // removing the entered password and
                                                            // showing message if the credentials don't match
                                                            else {
                                                                MyCustomMethods.showShortMessage(currentActivity,
                                                                        currentActivity.getResources().getString(R.string.incorrect_username_password));
                                                                resetUserPassword();
                                                            }
                                                        });
                                            }
                                            // if the entered email is admin
                                            else if (doesNotHaveAccess) {
                                                MyCustomMethods.showShortMessage(currentActivity,
                                                        currentActivity.getResources().getString(R.string.access_denied));
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
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.email) +
                                    currentActivity.getResources().getString(R.string.whitespace) +
                                    currentActivity.getResources().getString(R.string.and) +
                                    currentActivity.getResources().getString(R.string.whitespace) +
                                    currentActivity.getResources().getString(R.string.password).toLowerCase() +
                                    currentActivity.getResources().getString(R.string.whitespace)));
        } else if (email.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.email)));
        } else if (password.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.password)));
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches() && password.length() < 8) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.email_password_not_valid));
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.email_not_valid));
        } else {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.password_minimum_characters, 8));
        }

        return false;
    }

    public void registerHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(new RegisterFragment());
    }
}