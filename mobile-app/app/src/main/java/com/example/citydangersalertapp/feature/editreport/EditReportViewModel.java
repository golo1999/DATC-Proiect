package com.example.citydangersalertapp.feature.editreport;

import static android.content.Context.MODE_PRIVATE;

import android.app.Activity;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.databinding.ObservableInt;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.DatePickerFragment;
import com.example.citydangersalertapp.utility.TimePickerFragment;
import com.google.gson.Gson;

import java.time.LocalDate;
import java.time.LocalTime;

public class EditReportViewModel extends ViewModel {
    private Report selectedReport;
    private final ObservableField<String> note = new ObservableField<>();
    private final ObservableInt category = new ObservableInt();
    private LocalDate date = LocalDate.now();
    private LocalTime time = LocalTime.now();

    public Report getSelectedReport() {
        return selectedReport;
    }

    public void setSelectedReport(Report selectedReport) {
        this.selectedReport = selectedReport;
    }

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

    private void resetInputs() {
        setNote("");
    }

    public void cancelHandler(@NonNull Activity parentActivity) {
        resetInputs();
        parentActivity.onBackPressed();
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
        final Report retrievedReport = retrieveReportFromSharedPreferences(parentActivity);

        Log.d("retrievedReport", retrievedReport != null ? retrievedReport.toString() : "null");

        if (retrievedReport != null) {

            Report editedReport = null;
            try {
                editedReport = (Report) retrievedReport.clone();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }

            if (editedReport != null) {
                Log.d("123initialReport", retrievedReport.toString());

                if (!String.valueOf(note.get()).equals(retrievedReport.getNote())) {
                    editedReport.setNote(note.get());
                }

                if (category.get() != retrievedReport.getCategory()) {
                    editedReport.setCategory(category.get());
                }

                Log.d("123copiedReport", editedReport.toString());
                Log.d("123reportsAreTheSame", String.valueOf(retrievedReport.equals(editedReport)));
            }
        }
    }

//    private void saveReportToSharedPreferences(@NonNull Activity parentActivity) {
//        if (selectedReport != null) {
//            SharedPreferences preferences =
//                    parentActivity.getSharedPreferences(MyCustomVariables.getSharedPreferencesFileName(), MODE_PRIVATE);
//
//            SharedPreferences.Editor editor = preferences.edit();
//            Gson gson = new Gson();
//            String json = gson.toJson(report);
//
//            editor.putString("currentUserDetails", json);
//            editor.apply();
//        }
//    }
}