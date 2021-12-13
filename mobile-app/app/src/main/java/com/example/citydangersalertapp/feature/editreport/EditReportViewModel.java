package com.example.citydangersalertapp.feature.editreport;

import static android.content.Context.MODE_PRIVATE;

import android.app.Activity;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.databinding.ObservableInt;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.DatePickerFragment;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.example.citydangersalertapp.utility.TimePickerFragment;
import com.google.android.gms.tasks.Task;
import com.google.firebase.storage.UploadTask;
import com.google.gson.Gson;

import java.time.LocalDate;
import java.time.LocalTime;

public class EditReportViewModel extends ViewModel {
    private final ObservableField<String> note = new ObservableField<>();
    private final ObservableInt category = new ObservableInt();
    private LocalDate date = LocalDate.now();
    private LocalTime time = LocalTime.now();
    private boolean photoRemovable;
    private Uri selectedPhotoUri;

    public ObservableField<String> getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note.set(note);
    }

    public ObservableInt getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category.set(category);
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public boolean isPhotoRemovable() {
        return photoRemovable;
    }

    public void setPhotoRemovable(boolean photoRemovable) {
        this.photoRemovable = photoRemovable;
    }

    public Uri getSelectedPhotoUri() {
        return selectedPhotoUri;
    }

    public void setSelectedPhotoUri(Uri selectedPhotoUri) {
        this.selectedPhotoUri = selectedPhotoUri;
    }

    public int getREQUEST_ID() {
        return 5;
    }

    public void resetInputs() {
        setNote(null);
    }

    public void cancelHandler(@NonNull Activity parentActivity) {
        parentActivity.onBackPressed();
    }

    public void onPhotoTextClickHandler(@NonNull Activity parentActivity) {
        if (isPhotoRemovable()) {
        } else {
            MyCustomMethods.openFileChooser(parentActivity, getREQUEST_ID());
        }
    }

    public void reportDateTextClickHandler(FragmentManager fragmentManager) {
        final DialogFragment datePickerFragment = new DatePickerFragment(date);

        datePickerFragment.show(fragmentManager, "date_picker");
    }

    public void reportTimeTextClickHandler(FragmentManager fragmentManager) {
        final DialogFragment timePickerFragment = new TimePickerFragment(time);

        timePickerFragment.show(fragmentManager, "time_picker");
    }

    public Report retrieveReportFromSharedPreferences(@NonNull Activity parentActivity) {
        SharedPreferences preferences =
                parentActivity.getSharedPreferences("CITY_DANGERS_ALERT_APP_DATA", MODE_PRIVATE);
        Gson gson = new Gson();
        String json = preferences.getString("selectedReport", "");

        return gson.fromJson(json, Report.class);
    }

    public void saveReportDetailsHandler(@NonNull Activity parentActivity) {
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();
        final Report report = retrieveReportFromSharedPreferences(parentActivity);

        if (report != null) {
            if (!String.valueOf(note.get()).equals(report.getNote())) {
                report.setNote(note.get());
            }

            if (category.get() != report.getCategory()) {
                report.setCategory(category.get());
            }

            if (date.getYear() != report.getDateTime().getYear()) {
                report.getDateTime().setYear(date.getYear());
            }

            if (date.getMonthValue() != report.getDateTime().getMonth()) {
                report.getDateTime().setMonth(date.getMonthValue());
            }

            if (!String.valueOf(date.getMonth()).equals(report.getDateTime().getMonthName())) {
                report.getDateTime().setMonthName(String.valueOf(date.getMonth()));
            }

            if (date.getDayOfMonth() != report.getDateTime().getDay()) {
                report.getDateTime().setDay(date.getDayOfMonth());
            }

            if (!String.valueOf(date.getDayOfWeek()).equals(report.getDateTime().getDayName())) {
                report.getDateTime().setDayName(String.valueOf(date.getDayOfWeek()));
            }

            if (time.getHour() != report.getDateTime().getHour()) {
                report.getDateTime().setHour(time.getHour());
            }

            if (time.getMinute() != report.getDateTime().getMinute()) {
                report.getDateTime().setMinute(time.getMinute());
            }

            if (time.getSecond() != report.getDateTime().getSecond()) {
                report.getDateTime().setSecond(time.getSecond());
            }

            if (selectedPhotoUri != null && currentUserId != null) {
                MyCustomVariables.getFirebaseStorageReference()
                        .child(currentUserId)
                        .child("reportsList")
                        .child(report.getReportId())
                        .putFile(selectedPhotoUri)
                        .addOnSuccessListener((final UploadTask.TaskSnapshot taskSnapshot) -> {
                            final Task<Uri> uriTask = taskSnapshot.getStorage().getDownloadUrl();

                            while (!uriTask.isComplete()) ;

                            final Uri url = uriTask.getResult();

                            report.setPhotoURL(String.valueOf(url));

                            final Report retrievedReport = retrieveReportFromSharedPreferences(parentActivity);

                            // if the report has been modified
                            if (!report.equals(retrievedReport)) {
                                MyCustomVariables.getDatabaseReference()
                                        .child("usersList")
                                        .child(currentUserId)
                                        .child("personalReports")
                                        .child(report.getReportId())
                                        .setValue(report)
                                        .addOnCompleteListener((Task<Void> task) -> {
                                            if (task.isSuccessful()) {
                                                MyCustomMethods.showShortMessage(parentActivity,
                                                        parentActivity.getResources().getString(R.string.report_updated));
                                                parentActivity.onBackPressed();
                                            }
                                        });
                            }
                            // if the report has NOT been modified
                            else {
                                MyCustomMethods.showShortMessage(parentActivity,
                                        parentActivity.getResources().getString(R.string.no_changes_have_been_made));
                            }

                            setSelectedPhotoUri(null);
                            setNote(null);
                        })
                        .addOnFailureListener((final Exception exception) ->
                                MyCustomMethods.showShortMessage(parentActivity, exception.getMessage()));
            } else {
                final Report retrievedReport = retrieveReportFromSharedPreferences(parentActivity);

                // if the report has been modified
                if (!report.equals(retrievedReport)) {
                    if (currentUserId != null) {
                        MyCustomVariables.getDatabaseReference()
                                .child("usersList")
                                .child(currentUserId)
                                .child("personalReports")
                                .child(report.getReportId())
                                .setValue(report)
                                .addOnCompleteListener((Task<Void> task) -> {
                                    if (task.isSuccessful()) {
                                        MyCustomMethods.showShortMessage(parentActivity,
                                                parentActivity.getResources().getString(R.string.report_updated));
                                        parentActivity.onBackPressed();
                                    }
                                });
                    }
                }
                // if the report has NOT been modified
                else {
                    MyCustomMethods.showShortMessage(parentActivity,
                            parentActivity.getResources().getString(R.string.no_changes_have_been_made));
                }

                setNote(null);

//            Log.d("123editedReport", report.toString());
//            Log.d("123initialReport", retrievedReport.toString());
//            Log.d("123reportsAreTheSame", String.valueOf(report.equals(retrievedReport)));
            }
        }
    }
}