package com.example.citydangersalertapp.utility;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class MyCustomVariables {
    private static final DatabaseReference DATABASE_REFERENCE = FirebaseDatabase.getInstance().getReference();
    private static final FirebaseAuth FIREBASE_AUTH = FirebaseAuth.getInstance();
    private static final String LOCATION_API_BASE_URL = "http://ip-api.com/";

    public static DatabaseReference getDatabaseReference() {
        return DATABASE_REFERENCE;
    }

    public static FirebaseAuth getFirebaseAuth() {
        return FIREBASE_AUTH;
    }

    public static String getLocationApiBaseUrl() {
        return LOCATION_API_BASE_URL;
    }
}