package com.example.citydangersalertapp.feature.nearbydangersmap;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.NearbyDangersMapFragmentBinding;

public class NearbyDangersMapFragment extends Fragment {
    private NearbyDangersMapFragmentBinding binding;

    public NearbyDangersMapFragment() {
        // Required empty public constructor
    }

    public static NearbyDangersMapFragment newInstance() {
        NearbyDangersMapFragment fragment = new NearbyDangersMapFragment();
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
        binding = DataBindingUtil.inflate(inflater, R.layout.nearby_dangers_map_fragment, container, false);
    }

    private void setLayoutVariables() {

    }
}