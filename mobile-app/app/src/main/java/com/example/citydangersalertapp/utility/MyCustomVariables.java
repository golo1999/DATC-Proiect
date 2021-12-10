package com.example.citydangersalertapp.utility;

import com.example.citydangersalertapp.model.UserLocation;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class MyCustomVariables {
    private static final DatabaseReference DATABASE_REFERENCE = FirebaseDatabase.getInstance().getReference();
    private static final FirebaseAuth FIREBASE_AUTH = FirebaseAuth.getInstance();
    private static final String LOCATION_API_BASE_URL = "http://ip-api.com/";
    private static final UserLocation DEFAULT_USER_LOCATION = new UserLocation(51.509865, -0.118092);
    private static final String SHARED_PREFERENCES_APP_DATA = "CITY_DANGERS_ALERT_APP_DATA";

    public static DatabaseReference getDatabaseReference() {
        return DATABASE_REFERENCE;
    }

    public static FirebaseAuth getFirebaseAuth() {
        return FIREBASE_AUTH;
    }

    public static String getLocationApiBaseUrl() {
        return LOCATION_API_BASE_URL;
    }

    public static UserLocation getDefaultUserLocation() {
        return DEFAULT_USER_LOCATION;
    }

    public static String getSharedPreferencesAppData() {
        return SHARED_PREFERENCES_APP_DATA;
    }
}