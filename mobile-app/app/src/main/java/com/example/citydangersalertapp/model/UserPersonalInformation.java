package com.example.citydangersalertapp.model;

import androidx.annotation.NonNull;

import com.example.citydangersalertapp.utility.MyCustomMethods;

import java.time.LocalDate;

public class UserPersonalInformation {
    private String id;
    private final boolean admin = false;
    private MyCustomDate birthDate = new MyCustomDate(LocalDate.now());
    private String email;
    private String firstName;
    private String lastName;
    private int level = 1;
    private String pin;
    private String photoURL;
    private double taxReduction = 0d;

    public UserPersonalInformation() {
        // Required empty public constructor
    }

    public UserPersonalInformation(String id,
                                   MyCustomDate birthDate,
                                   String email,
                                   String firstName,
                                   String lastName,
                                   int level,
                                   String pin,
                                   String photoURL,
                                   double taxReduction) {
        this.id = id;
        this.birthDate = birthDate;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.level = level;
        this.pin = pin;
        this.photoURL = photoURL;
        this.taxReduction = taxReduction;
    }

    public UserPersonalInformation(String id,
                                   String email,
                                   String firstName,
                                   String lastName,
                                   String pin,
                                   double taxReduction) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pin = pin;
        this.taxReduction = taxReduction;
    }

    public UserPersonalInformation(String id,
                                   String email,
                                   String firstName,
                                   String lastName,
                                   String pin) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pin = pin;

        if (MyCustomMethods.getBirthDateFromPIN(pin) != null) {
            setBirthDate(MyCustomMethods.getBirthDateFromPIN(pin));
        }
    }

    public UserPersonalInformation(String id,
                                   MyCustomDate birthDate,
                                   String email,
                                   String firstName,
                                   String lastName,
                                   int level,
                                   String pin) {
        this.id = id;
        this.birthDate = birthDate;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.level = level;
        this.pin = pin;

        if (MyCustomMethods.getBirthDateFromPIN(pin) != null) {
            setBirthDate(MyCustomMethods.getBirthDateFromPIN(pin));
        }
    }

    public UserPersonalInformation(String id,
                                   String email,
                                   String firstName,
                                   String lastName,
                                   String pin,
                                   String photoURL) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pin = pin;
        this.photoURL = photoURL;

        if (MyCustomMethods.getBirthDateFromPIN(pin) != null) {
            setBirthDate(MyCustomMethods.getBirthDateFromPIN(pin));
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isAdmin() {
        return admin;
    }

    public MyCustomDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(MyCustomDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }

    public double getTaxReduction() {
        return taxReduction;
    }

    public void setTaxReduction(double taxReduction) {
        this.taxReduction = taxReduction;
    }

    @NonNull
    @Override
    public String toString() {
        return "UserPersonalInformation{" +
                "id='" + id + '\'' +
                ", admin=" + admin +
                ", birthDate=" + birthDate +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", level=" + level +
                ", pin='" + pin + '\'' +
                ", photoURL='" + photoURL + '\'' +
                ", taxReduction=" + taxReduction +
                '}';
    }
}