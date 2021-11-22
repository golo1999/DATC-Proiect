package com.example.citydangersalertapp.feature.authentication;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.RegisterFragmentBinding;

public class RegisterFragment extends Fragment {
    private RegisterFragmentBinding binding;
    private RegisterViewModel viewModel;

    public RegisterFragment() {
        // Required empty public constructor
    }

    public static RegisterFragment newInstance() {
        RegisterFragment fragment = new RegisterFragment();
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
        binding = DataBindingUtil.inflate(inflater, R.layout.register_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(RegisterViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((AuthenticationActivity) requireActivity());
        binding.setViewModel(viewModel);
    }
}