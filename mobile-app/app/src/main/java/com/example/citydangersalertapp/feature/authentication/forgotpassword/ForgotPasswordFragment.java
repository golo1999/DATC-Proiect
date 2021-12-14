package com.example.citydangersalertapp.feature.authentication.forgotpassword;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.ForgotPasswordFragmentBinding;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;

public class ForgotPasswordFragment extends Fragment {
    private ForgotPasswordFragmentBinding binding;
    private ForgotPasswordViewModel viewModel;

    public ForgotPasswordFragment() {
        // Required empty public constructor
    }

    public static ForgotPasswordFragment newInstance() {
        ForgotPasswordFragment fragment = new ForgotPasswordFragment();
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
        binding = DataBindingUtil.inflate(inflater, R.layout.forgot_password_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(ForgotPasswordViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((AuthenticationActivity) requireActivity());
        binding.setViewModel(viewModel);
    }
}