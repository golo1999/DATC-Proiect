package com.example.citydangersalertapp.feature.myreports;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.MyReportsFragmentBinding;

public class MyReportsFragment extends Fragment {
    private MyReportsFragmentBinding binding;

    public MyReportsFragment() {
        // Required empty public constructor
    }

    public static MyReportsFragment newInstance() {
        MyReportsFragment fragment = new MyReportsFragment();
        Bundle args = new Bundle();

        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        setFragmentVariables(inflater, container);
        setLayoutVariables();

        return binding.getRoot();
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.my_reports_fragment, container, false);
    }

    private void setLayoutVariables() {

    }
}