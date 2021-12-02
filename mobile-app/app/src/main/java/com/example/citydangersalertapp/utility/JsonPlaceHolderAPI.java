package com.example.citydangersalertapp.utility;

import com.example.citydangersalertapp.model.UserLocation;

import retrofit2.Call;
import retrofit2.http.GET;

public interface JsonPlaceHolderAPI {
    @GET("json/?fields=223")
    Call<UserLocation> getUserLocation();
}