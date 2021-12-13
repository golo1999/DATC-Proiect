package com.example.citydangersalertapp.model;

import androidx.annotation.NonNull;

public class AdminPersonalInformation {
    private String id;
    private final boolean admin = true;
    private String email;
    private String firstName;
    private String lastName;

    public AdminPersonalInformation() {
        // Required empty public constructor
    }

    public AdminPersonalInformation(String id,
                                    String email,
                                    String firstName,
                                    String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getId() {
        return id;
    }

    public boolean isAdmin() {
        return admin;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    @NonNull
    @Override
    public String toString() {
        return "AdminPersonalInformation{" +
                "id='" + id + '\'' +
                ", admin=" + admin +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }
}