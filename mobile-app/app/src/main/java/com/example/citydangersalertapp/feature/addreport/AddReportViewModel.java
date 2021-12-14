package com.example.citydangersalertapp.feature.addreport;

import android.app.Activity;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.databinding.ObservableInt;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.model.MyCustomDateTime;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.model.UserLocation;
import com.example.citydangersalertapp.utility.JsonPlaceHolderAPI;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.gms.tasks.Task;
import com.google.firebase.storage.UploadTask;

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
            .baseUrl(MyCustomVariables.getLocationApiBaseUrl())
            .addConverterFactory(GsonConverterFactory.create()).build();
    private final JsonPlaceHolderAPI api = retrofit.create(JsonPlaceHolderAPI.class);
    private Uri selectedPhotoUri;

    public ObservableField<String> getReportNote() {
        return reportNote;
    }

    public ObservableInt getReportCategory() {
        return reportCategory;
    }

    public Uri getSelectedPhotoUri() {
        return selectedPhotoUri;
    }

    public void setSelectedPhotoUri(Uri selectedPhotoUri) {
        this.selectedPhotoUri = selectedPhotoUri;
    }

    public int getAddPhotoRequestId() {
        return 3;
    }

    private void addReportToDatabase(@NonNull Activity parentActivity,
                                     final String currentUserId,
                                     final Report newReport) {
        final Call<UserLocation> userLocationCall = api.getUserLocation();

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
                            parentActivity.getResources().getString(R.string.response_unsuccessful_code) + response.code());
                }

                MyCustomVariables.getDatabaseReference()
                        .child("usersList")
                        .child(currentUserId)
                        .child("personalReports")
                        .child(newReport.getReportId())
                        .setValue(newReport)
                        .addOnSuccessListener((Void unused) -> {
                            MyCustomMethods.showShortMessage(parentActivity,
                                    parentActivity.getResources().getString(R.string.report_added_successfully));
                            parentActivity.onBackPressed();
                        })
                        .addOnFailureListener((Exception exception) ->
                                MyCustomMethods.showShortMessage(parentActivity,
                                        parentActivity.getResources().getString(R.string.could_not_add_report)));
            }

            @Override
            public void onFailure(@NonNull Call<UserLocation> call,
                                  @NonNull Throwable t) {
                MyCustomMethods.showShortMessage(parentActivity,
                        parentActivity.getResources().getString(R.string.could_not_add_location_to_report));
            }
        });
    }

    public void cancelReportHandler(@NonNull Activity parentActivity) {
        parentActivity.onBackPressed();
        resetInputs();
    }

    public void onPhotoTextClickHandler(@NonNull Activity parentActivity,
                                        @NonNull Fragment parentFragment) {
        if (selectedPhotoUri != null) {
            setSelectedPhotoUri(null);
            ((AddReportFragment) parentFragment).setPhotoText();
        } else {
            MyCustomMethods.openFileChooser(parentActivity, getAddPhotoRequestId());
        }
    }

    private void resetInputs() {
        reportNote.set(null);
        reportCategory.set(0);
        setSelectedPhotoUri(null);
    }

    public void saveReportHandler(@NonNull Activity parentActivity,
                                  @NonNull Fragment fragment) {
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();
        final String reportNote = String.valueOf(getReportNote().get()).trim().isEmpty() ? null : getReportNote().get();
        final MyCustomDateTime reportLocalDateTime = new MyCustomDateTime(LocalDateTime.now());
        final Report newReport = new Report(currentUserId, reportNote, reportLocalDateTime, reportCategory.get());

        if (currentUserId != null) {
            ((AddReportFragment) fragment).toggleButton(false);
            MyCustomMethods.closeTheKeyboard(parentActivity);

            if (selectedPhotoUri != null) {
                MyCustomVariables.getFirebaseStorageReference()
                        .child(currentUserId)
                        .child("reportsList")
                        .child(newReport.getReportId())
                        .putFile(selectedPhotoUri)
                        .addOnSuccessListener((final UploadTask.TaskSnapshot taskSnapshot) -> {
                            final Task<Uri> uriTask = taskSnapshot.getStorage().getDownloadUrl();

                            while (!uriTask.isComplete()) ;

                            final Uri url = uriTask.getResult();

                            newReport.setPhotoURL(String.valueOf(url));
                            addReportToDatabase(parentActivity, currentUserId, newReport);
                        })
                        .addOnFailureListener((final Exception exception) ->
                                MyCustomMethods.showShortMessage(parentActivity, exception.getMessage()));

                setSelectedPhotoUri(null);
            } else {
                addReportToDatabase(parentActivity, currentUserId, newReport);
            }

            ((AddReportFragment) fragment).toggleButton(true);
            resetInputs();
        }
    }
}