package com.example.citydangersalertapp.utility;

import android.app.Dialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.text.format.DateFormat;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import java.time.LocalTime;

public class TimePickerFragment extends DialogFragment {
    private LocalTime timePickerStartTime = LocalTime.now();

    public TimePickerFragment() {
        // Required empty public constructor
    }

    public TimePickerFragment(final LocalTime timePickerStarTime) {
        this.timePickerStartTime = timePickerStarTime;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(final @Nullable Bundle savedInstanceState) {
        return new TimePickerDialog(requireActivity(),
                (TimePickerDialog.OnTimeSetListener) requireActivity(),
                timePickerStartTime.getHour(),
                timePickerStartTime.getMinute(),
                DateFormat.is24HourFormat(requireActivity()));
    }
}