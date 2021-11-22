package com.example.citydangersalertapp.feature.addreport;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.AddReportFragmentBinding;

public class AddReportFragment extends Fragment {
    private AddReportFragmentBinding binding;
    private AddReportViewModel viewModel;

    public AddReportFragment() {
        // Required empty public constructor
    }

    public static AddReportFragment newInstance() {
        AddReportFragment fragment = new AddReportFragment();
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

    private void setFragmentVariables(@NonNull LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.add_report_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(AddReportViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((HomeActivity) requireActivity());
        binding.setViewModel(viewModel);
    }
}