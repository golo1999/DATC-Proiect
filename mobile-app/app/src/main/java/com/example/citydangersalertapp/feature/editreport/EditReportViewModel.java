package com.example.citydangersalertapp.feature.editreport;

import androidx.databinding.ObservableField;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.utility.DatePickerFragment;
import com.example.citydangersalertapp.utility.TimePickerFragment;

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

    public void reportDateTextClickHandler(FragmentManager fragmentManager) {
        final DialogFragment datePickerFragment = new DatePickerFragment(reportDate);

        datePickerFragment.show(fragmentManager, "date_picker");
    }

    public void reportTimeTextClickHandler(FragmentManager fragmentManager) {
        final DialogFragment timePickerFragment = new TimePickerFragment(reportTime);

        timePickerFragment.show(fragmentManager, "time_picker");
    }
}