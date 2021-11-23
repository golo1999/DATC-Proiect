package com.example.citydangersalertapp.model;

public class UserPersonalInformation {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private int level = 1;
    private String pin;
    private String photoURL;

    public UserPersonalInformation() {
        // Required empty public constructor
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
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    @Override
    public String toString() {
        return "UserPersonalInformation{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", level=" + level +
                ", pin='" + pin + '\'' +
                ", photoURL='" + photoURL + '\'' +
                '}';
    }
}