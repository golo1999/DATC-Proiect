package com.example.citydangersalertapp.feature.authentication.forgotpassword;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.feature.authentication.login.LogInFragment;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;

public class ForgotPasswordViewModel extends ViewModel {
    private final ObservableField<String> userEmail = new ObservableField<>();

    public ObservableField<String> getUserEmail() {
        return userEmail;
    }

    public void resetInput() {
        userEmail.set(null);
    }

    public void goBackHandler(@NonNull Activity activity) {
        ((AuthenticationActivity) activity).setFragment(new LogInFragment());
    }

    public void resetPasswordHandler(@NonNull Activity activity,
                                     String enteredEmail) {
        if (MyCustomMethods.emailIsValid(activity, enteredEmail)) {
            MyCustomVariables.getFirebaseAuth()
                    .sendPasswordResetEmail(enteredEmail)
                    .addOnSuccessListener((Void command) -> {
                        resetInput();
                        activity.onBackPressed();
                        MyCustomMethods.showShortMessage(activity,
                                activity.getResources().getString(R.string.email_sent));
                    })
                    .addOnFailureListener((Exception exception) -> {
                        MyCustomMethods.showShortMessage(activity,
                                activity.getResources().getString(R.string.something_went_wrong));
                    });
        }
    }
}