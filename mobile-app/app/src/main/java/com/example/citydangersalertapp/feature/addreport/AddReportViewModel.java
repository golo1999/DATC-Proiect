package com.example.citydangersalertapp.feature.addreport;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.model.MyCustomTime;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;

import java.time.LocalDateTime;

public class AddReportViewModel extends ViewModel {
    private final ObservableField<String> reportNote = new ObservableField<>();

    public ObservableField<String> getReportNote() {
        return reportNote;
    }

    public void cancelReportHandler() {

    }

    public void saveReportHandler(@NonNull Activity parentActivity) {
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();
        final String reportNote = String.valueOf(getReportNote().get()).trim().isEmpty() ? null : getReportNote().get();
        final MyCustomTime reportLocalDateTime = new MyCustomTime(LocalDateTime.now());
        final Report newReport = new Report(currentUserId, reportNote, reportLocalDateTime, 0);

        MyCustomMethods.closeTheKeyboard(parentActivity);

        if (currentUserId != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(currentUserId)
                    .child("personalReports")
                    .child(newReport.getReportId())
                    .setValue(newReport);
        }
    }
}