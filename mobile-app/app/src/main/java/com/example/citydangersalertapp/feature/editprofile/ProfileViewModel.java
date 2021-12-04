package com.example.citydangersalertapp.feature.editprofile;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.model.MyCustomDate;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import java.time.LocalDate;

public class ProfileViewModel extends ViewModel {
    private final ObservableField<String> firstName = new ObservableField<>("");
    private final ObservableField<String> lastName = new ObservableField<>("");
    private final ObservableField<String> pin = new ObservableField<>("");
    private LocalDate birthDate = LocalDate.now();

    public ObservableField<String> getFirstName() {
        return firstName;
    }

    public ObservableField<String> getLastName() {
        return lastName;
    }

    public ObservableField<String> getPin() {
        return pin;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void birthDateTextClickHandler(FragmentManager fragmentManager) {
        final DialogFragment datePickerFragment = new DatePickerFragment(birthDate);

        datePickerFragment.show(fragmentManager, "date_picker");

//        final String currentUserID = MyCustomVariables.getFirebaseAuth().getUid();
//
//        if (currentUserID != null) {
//            MyCustomVariables.getDatabaseReference()
//                    .child("usersList")
//                    .child(currentUserID)
//                    .addListenerForSingleValueEvent(new ValueEventListener() {
//                        @Override
//                        public void onDataChange(@NonNull DataSnapshot snapshot) {
//                            if (snapshot.exists() &&
//                                    snapshot.hasChild("personalInformation") &&
//                                    snapshot.child("personalInformation").hasChild("birthDate")) {
//                                final MyCustomDate birthDate =
//                                        snapshot.child("personalInformation").child("birthDate").getValue(MyCustomDate.class);
//
//                                if (birthDate != null) {
//                                    final LocalDate parsedBirthDate =
//                                            LocalDate.of(birthDate.getYear(), birthDate.getMonth(), birthDate.getDay());
//
//                                    final DialogFragment datePickerFragment = new DatePickerFragment(parsedBirthDate);
//
//                                    datePickerFragment.show(fragmentManager, "date_picker");
//                                }
//                            }
//                        }
//
//                        @Override
//                        public void onCancelled(@NonNull DatabaseError error) {
//
//                        }
//                    });
//        }
    }

    public boolean personalInformationIsValid(String firstName,
                                              String lastName,
                                              String pin) {
        return MyCustomMethods.nameIsValid(firstName) && MyCustomMethods.nameIsValid(lastName) && MyCustomMethods.pinIsValid(pin);
    }

    public void updateProfileHandler(@NonNull Activity parentActivity) {
        final String enteredFirstName = firstName.get();
        final String enteredLastName = lastName.get();
        final String enteredPIN = pin.get();

        if (enteredFirstName != null && enteredLastName != null && enteredPIN != null) {
            if (personalInformationIsValid(enteredFirstName, enteredLastName, enteredPIN)) {
                MyCustomMethods.closeTheKeyboard(parentActivity);

                final String currentUserID = MyCustomVariables.getFirebaseAuth().getUid();

                if (currentUserID != null) {
                    MyCustomVariables.getDatabaseReference()
                            .child("usersList")
                            .child(currentUserID)
                            .addListenerForSingleValueEvent(new ValueEventListener() {
                                @Override
                                public void onDataChange(@NonNull DataSnapshot snapshot) {
                                    if (snapshot.exists() &&
                                            snapshot.hasChild("personalInformation")) {
                                        final UserPersonalInformation personalInformation =
                                                snapshot.child("personalInformation").getValue(UserPersonalInformation.class);

                                        if (personalInformation != null) {
                                            final MyCustomDate chosenBirthDate = new MyCustomDate(birthDate);

                                            final boolean enteredFirstNameIsTheSame =
                                                    enteredFirstName.trim().equals(personalInformation.getFirstName());
                                            final boolean enteredLastNameIsTheSame =
                                                    enteredLastName.trim().equals(personalInformation.getLastName());
                                            final boolean enteredPinIsTheSame =
                                                    enteredPIN.trim().equals(personalInformation.getPin());
                                            final boolean chosenBirthDateIsTheSame =
                                                    chosenBirthDate.equals(personalInformation.getBirthDate());

                                            if (!enteredFirstNameIsTheSame) {
                                                personalInformation.setFirstName(enteredFirstName);
                                            }

                                            if (!enteredLastNameIsTheSame) {
                                                personalInformation.setLastName(enteredLastName);
                                            }

                                            if (!enteredPinIsTheSame) {
                                                personalInformation.setPin(enteredPIN);
                                            }

                                            if (!chosenBirthDateIsTheSame) {
                                                personalInformation.setBirthDate(chosenBirthDate);
                                            }

                                            MyCustomVariables.getDatabaseReference()
                                                    .child("usersList")
                                                    .child(currentUserID)
                                                    .child("personalInformation")
                                                    .setValue(personalInformation)
                                                    .addOnCompleteListener((Task<Void> task) -> {
                                                        MyCustomMethods.showShortMessage(parentActivity,
                                                                "Profile updated");
                                                        parentActivity.onBackPressed();
                                                    });

                                        }
                                    }
                                }

                                @Override
                                public void onCancelled(@NonNull DatabaseError error) {

                                }
                            });
                }
            } else if (enteredFirstName.trim().isEmpty() &&
                    enteredLastName.trim().isEmpty() &&
                    enteredPIN.isEmpty()) {
                MyCustomMethods.showShortMessage(parentActivity, "Please fill in all fields");
            } else if ((enteredFirstName.trim().isEmpty() || enteredLastName.trim().isEmpty() ||
                    (!MyCustomMethods.nameIsValid(enteredFirstName.trim()) || !MyCustomMethods.nameIsValid(enteredLastName.trim())))) {
                MyCustomMethods.showShortMessage(parentActivity, "All names should have at least 2 characters");
            } else if (enteredPIN.isEmpty() || !MyCustomMethods.pinIsValid(enteredPIN)) {
                MyCustomMethods.showShortMessage(parentActivity, "PIN should have 13 characters");
            } else if (!MyCustomMethods.nameIsValid(enteredFirstName.trim()) &&
                    !MyCustomMethods.nameIsValid(enteredLastName.trim()) &&
                    !MyCustomMethods.pinIsValid(enteredPIN)) {
                MyCustomMethods.showShortMessage(parentActivity,
                        "All names should have at least 2 characters and PIN should have 13");
            }
        }
    }
}