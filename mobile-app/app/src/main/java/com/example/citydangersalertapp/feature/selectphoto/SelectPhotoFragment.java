package com.example.citydangersalertapp.feature.selectphoto;

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
import com.example.citydangersalertapp.databinding.SelectPhotoFragmentBinding;
import com.example.citydangersalertapp.utility.MyCustomMethods;

public class SelectPhotoFragment extends Fragment {
    private SelectPhotoFragmentBinding binding;
    private SelectPhotoViewModel viewModel;

    public SelectPhotoFragment() {
        // Required empty public constructor
    }

    public static SelectPhotoFragment newInstance() {
        SelectPhotoFragment fragment = new SelectPhotoFragment();
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
        setOnClickListeners();
        setSelectedPhotoCallback();
        viewModel.showPhoto(binding.photo);

        return binding.getRoot();
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.select_photo_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(SelectPhotoViewModel.class);
    }

    private void setLayoutVariables() {

    }

    private void setOnClickListeners() {
        binding.chooseButton.setOnClickListener((View v) -> {
            viewModel.openFileChooser(requireActivity());
        });

        binding.uploadButton.setOnClickListener((View v) -> {
            viewModel.uploadSelectedPhoto(requireActivity());
        });
    }

    private void setSelectedPhotoCallback() {
        ((HomeActivity) requireActivity()).setSelectedPhotoUriCallback(selectedUri -> {
            viewModel.setSelectedPhotoUri(selectedUri);
            binding.photo.setImageURI(viewModel.getSelectedPhotoUri());
        });
    }
}