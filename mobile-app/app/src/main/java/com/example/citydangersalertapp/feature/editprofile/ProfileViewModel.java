package com.example.citydangersalertapp.feature.editprofile;

import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

public class ProfileViewModel extends ViewModel {
    private final ObservableField<String> firstName = new ObservableField<>("");
    private final ObservableField<String> lastName = new ObservableField<>("");
    private final ObservableField<String> pin = new ObservableField<>("");

    public ObservableField<String> getFirstName() {
        return firstName;
    }

    public ObservableField<String> getLastName() {
        return lastName;
    }

    public ObservableField<String> getPin() {
        return pin;
    }
}