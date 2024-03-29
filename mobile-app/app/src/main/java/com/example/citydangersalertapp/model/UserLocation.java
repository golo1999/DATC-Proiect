package com.example.citydangersalertapp.model;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.util.Objects;

public class UserLocation {
    private String country;
    private String countryCode;
    private String region;
    private String regionName;
    private String city;
    @SerializedName("lat")
    private double latitude;
    @SerializedName("lon")
    private double longitude;

    public UserLocation() {
        // Required empty constructor
    }

    public UserLocation(String country,
                        String countryCode,
                        String region,
                        String regionName,
                        String city,
                        double latitude,
                        double longitude) {
        this.country = country;
        this.countryCode = countryCode;
        this.region = region;
        this.regionName = regionName;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public UserLocation(double latitude,
                        double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserLocation that = (UserLocation) o;
        return Double.compare(that.latitude, latitude) == 0 &&
                Double.compare(that.longitude, longitude) == 0 &&
                country.equals(that.country) &&
                countryCode.equals(that.countryCode) &&
                region.equals(that.region) &&
                regionName.equals(that.regionName) &&
                city.equals(that.city);
    }

    @Override
    public int hashCode() {
        return Objects.hash(country, countryCode, region, regionName, city, latitude, longitude);
    }

    @NonNull
    @Override
    public String toString() {
        return "UserLocation{" +
                "country='" + country + '\'' +
                ", countryCode='" + countryCode + '\'' +
                ", region='" + region + '\'' +
                ", regionName='" + regionName + '\'' +
                ", city='" + city + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}