package com.example.citydangersalertapp.feature.addreport;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.model.Report;

public class AddReportViewModel extends ViewModel {
    private final ObservableField<String> reportNote = new ObservableField<>();

    public ObservableField<String> getReportNote() {
        return reportNote;
    }

    public void cancelReportHandler() {

    }

    public void saveReportHandler(@NonNull Activity parentActivity) {
        MyCustomMethods.closeTheKeyboard(parentActivity);

        final Report newReport;
    }
}