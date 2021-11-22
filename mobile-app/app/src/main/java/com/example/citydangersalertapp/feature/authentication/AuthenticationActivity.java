package com.example.citydangersalertapp.feature.authentication;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.AuthenticationActivityBinding;

public class AuthenticationActivity extends AppCompatActivity {
    private AuthenticationActivityBinding binding;
    private AuthenticationViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setVariables();
        setLayoutVariables();
        setFragment(new LogInFragment());
    }

    public void setFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(binding.mainContainer.getId(), fragment)
                .commit();
    }

    private void setLayoutVariables() {
        binding.setActivity(this);
        binding.setViewModel(viewModel);
    }

    private void setVariables() {
        binding = DataBindingUtil.setContentView(this, R.layout.authentication_activity);
        viewModel = new ViewModelProvider(this).get(AuthenticationViewModel.class);
    }
}