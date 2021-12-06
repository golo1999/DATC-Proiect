package com.example.citydangersalertapp.feature.editreport;

import androidx.databinding.ObservableField;
import androidx.lifecycle.ViewModel;

import java.time.LocalDate;
import java.time.LocalTime;

public class EditReportViewModel extends ViewModel {
    private final ObservableField<String> note = new ObservableField<>();
    private LocalDate reportDate = LocalDate.now();
    private LocalTime reportTime = LocalTime.now();

    public ObservableField<String> getNote() {
        return note;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }

    public LocalTime getReportTime() {
        return reportTime;
    }

    public void setReportTime(LocalTime reportTime) {
        this.reportTime = reportTime;
    }
}