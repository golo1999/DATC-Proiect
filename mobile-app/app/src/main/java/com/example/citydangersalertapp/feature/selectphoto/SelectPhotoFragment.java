package com.example.citydangersalertapp.feature.selectphoto;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.SelectPhotoFragmentBinding;

public class SelectPhotoFragment extends Fragment {
    private SelectPhotoFragmentBinding binding;

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

        return binding.getRoot();
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.select_photo_fragment, container, false);
    }

    private void setLayoutVariables() {

    }
}