package com.example.citydangersalertapp.feature.authentication.login;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.LogInFragmentBinding;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class LogInFragment extends Fragment {
    private LogInFragmentBinding binding;
    private LogInViewModel viewModel;

    public LogInFragment() {
        // Required empty public constructor
    }

    public static LogInFragment newInstance() {
        LogInFragment fragment = new LogInFragment();
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
        binding = DataBindingUtil.inflate(inflater, R.layout.log_in_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(LogInViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((AuthenticationActivity) requireActivity());
        binding.setViewModel(viewModel);
    }
}