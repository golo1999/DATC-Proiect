package com.example.citydangersalertapp.feature.addreport;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.databinding.ObservableInt;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.model.MyCustomDateTime;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.model.UserLocation;
import com.example.citydangersalertapp.utility.JsonPlaceHolderAPI;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;

import java.time.LocalDateTime;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AddReportViewModel extends ViewModel {
    private final ObservableField<String> reportNote = new ObservableField<>();

    private final ObservableInt reportCategory = new ObservableInt();

    private final Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(MyCustomVariables.getBaseURL())
            .addConverterFactory(GsonConverterFactory.create()).build();

    private final JsonPlaceHolderAPI api = retrofit.create(JsonPlaceHolderAPI.class);

    public ObservableField<String> getReportNote() {
        return reportNote;
    }

    public ObservableInt getReportCategory() {
        return reportCategory;
    }

    public void cancelReportHandler(@NonNull Activity parentActivity) {
        parentActivity.onBackPressed();
    }

    public void saveReportHandler(@NonNull Activity parentActivity) {
        final Call<UserLocation> userLocationCall = api.getUserLocation();
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();
        final String reportNote = String.valueOf(getReportNote().get()).trim().isEmpty() ? null : getReportNote().get();
        final MyCustomDateTime reportLocalDateTime = new MyCustomDateTime(LocalDateTime.now());
        final Report newReport = new Report(currentUserId, reportNote, reportLocalDateTime, reportCategory.get());

        MyCustomMethods.closeTheKeyboard(parentActivity);

        userLocationCall.enqueue(new Callback<UserLocation>() {
            @Override
            public void onResponse(@NonNull Call<UserLocation> call,
                                   @NonNull Response<UserLocation> response) {
                if (response.isSuccessful()) {
                    final UserLocation fetchedUserLocation = response.body();

                    if (fetchedUserLocation != null) {
                        newReport.setLocation(fetchedUserLocation);
                    }
                } else {
                    MyCustomMethods.showShortMessage(parentActivity,
                            "Response unsuccessful, code: " + response.code());
                }

                if (currentUserId != null) {
                    MyCustomVariables.getDatabaseReference()
                            .child("usersList")
                            .child(currentUserId)
                            .child("personalReports")
                            .child(newReport.getReportId())
                            .setValue(newReport)
                            .addOnSuccessListener(unused -> {
                                MyCustomMethods.showShortMessage(parentActivity, "Report added successfully");
                                parentActivity.onBackPressed();
                            })
                            .addOnFailureListener(e -> MyCustomMethods.showShortMessage(parentActivity,
                                    "Couldn't add the report. Please try again"));
                }
            }

            @Override
            public void onFailure(@NonNull Call<UserLocation> call,
                                  @NonNull Throwable t) {
                MyCustomMethods.showShortMessage(parentActivity, "Couldn't add location to the report");
            }
        });
    }
}