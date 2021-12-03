package com.example.citydangersalertapp.feature.editreport;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.citydangersalertapp.R;

public class EditReportFragment extends Fragment {

    public EditReportFragment() {
        // Required empty public constructor
    }

    public static EditReportFragment newInstance() {
        EditReportFragment fragment = new EditReportFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.edit_report_fragment, container, false);
    }
}