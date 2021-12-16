package com.example.citydangersalertapp.feature.authentication.register;

import android.app.Activity;
import android.util.Patterns;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.feature.authentication.login.LogInFragment;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.auth.FirebaseUser;

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

    public void resetUserPassword() {
        this.userPassword.set("");
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

    private void createPersonalInformationPath(@NonNull Activity currentActivity) {
        final String userId = MyCustomVariables.getFirebaseAuth().getUid();

        if (userId != null) {
            final UserPersonalInformation personalInformation =
                    new UserPersonalInformation(userId, userEmail.get(), userFirstName.get(), userLastName.get(), userPIN.get());

            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(personalInformation.getId())
                    .child("personalInformation")
                    .setValue(personalInformation)
                    .addOnCompleteListener(addUserToDatabaseTask -> {
                        if (!addUserToDatabaseTask.isSuccessful()) {
                            MyCustomMethods.showShortMessage(currentActivity,
                                    currentActivity.getResources().getString(R.string.please_verify_your_email));
                        }
                    });
        }
    }

    public void loginHandler(@NonNull Activity currentActivity) {
        ((AuthenticationActivity) currentActivity).setFragment(new LogInFragment());
    }

    private boolean registrationIsValid(@NonNull Activity currentActivity,
                                        String enteredEmail,
                                        String enteredPassword,
                                        String enteredFirstName,
                                        String enteredLastName,
                                        String enteredPIN) {
        // if all inputs are valid
        if (Patterns.EMAIL_ADDRESS.matcher(enteredEmail).matches() &&
                enteredPassword.length() >= 8 &&
                MyCustomMethods.nameIsValid(enteredFirstName) &&
                MyCustomMethods.nameIsValid(enteredLastName) &&
                MyCustomMethods.pinIsValid(enteredPIN)
        ) {
            return true;
        } else if (enteredEmail.isEmpty() &&
                enteredPassword.isEmpty() &&
                enteredFirstName.isEmpty() &&
                enteredLastName.isEmpty() &&
                enteredPIN.isEmpty()
        ) {
            MyCustomMethods.showShortMessage(currentActivity, "No input contains characters");
        } else if (enteredFirstName.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.first_name)));
        } else if (enteredLastName.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.last_name)));
        } else if (enteredEmail.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.email)));
        } else if (enteredPassword.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.password)));
        } else if (enteredPIN.isEmpty()) {
            MyCustomMethods.showShortMessage(currentActivity,
                    currentActivity.getResources().getString(R.string.input_should_not_be_empty,
                            currentActivity.getResources().getString(R.string.pin)));
        } else {
            MyCustomMethods.showShortMessage(currentActivity, "Please complete all the inputs");
        }

        return false;
    }

    public void registerHandler(@NonNull Activity currentActivity,
                                @NonNull String enteredEmail,
                                @NonNull String enteredPassword,
                                String enteredFirstName,
                                String enteredLastName,
                                String enteredPIN) {
        if (registrationIsValid(currentActivity, enteredEmail, enteredPassword, enteredFirstName, enteredLastName, enteredPIN)) {
            MyCustomVariables.getFirebaseAuth()
                    .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
                    .addOnCompleteListener(createUserTask -> {
                        // if the account can be created
                        if (createUserTask.isSuccessful()) {
                            final FirebaseUser newUser = MyCustomVariables.getFirebaseAuth().getCurrentUser();

                            if (newUser != null) {
                                newUser.sendEmailVerification()
                                        .addOnCompleteListener(sendEmailVerificationTask -> {
                                            if (sendEmailVerificationTask.isSuccessful()) {
                                                createPersonalInformationPath(currentActivity);
                                                MyCustomVariables.getFirebaseAuth().signOut();
                                                ((AuthenticationActivity) currentActivity).setFragment(new LogInFragment());
                                            }
                                        });
                            }
                        } else {
                            MyCustomMethods.showShortMessage(currentActivity,
                                    currentActivity.getResources().getString(R.string.email_already_exists));
                            resetUserPassword();
                        }
                    })
//                    .addOnFailureListener(e -> {
//                        MyCustomMethods.showShortMessage(currentActivity, e.getMessage());
//                    })
            ;
        }
    }
}