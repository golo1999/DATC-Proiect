package com.example.citydangersalertapp.feature.addreport;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.AddReportFragmentBinding;
import com.example.citydangersalertapp.utility.CategoriesSpinnerAdapter;

public class AddReportFragment extends Fragment {
    private AddReportFragmentBinding binding;
    private AddReportViewModel viewModel;

    final AdapterView.OnItemSelectedListener itemSelectedListener = new AdapterView.OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> parent,
                                   View view,
                                   int position,
                                   long id) {
            ((TextView) parent.getChildAt(0)).setTextColor(Color.parseColor("#00203f"));
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {

        }
    };

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
        setCategoriesSpinner();
        setAddReportPhotoCallback();
        setCategoriesSpinnerStyling();
//        setCategoriesSpinnerListener();

        return binding.getRoot();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
//        removeCategoriesSpinnerListener();
    }

    private void removeCategoriesSpinnerListener() {
        binding.categoriesSpinner.setOnItemSelectedListener(null);
    }

    private void setFragmentVariables(@NonNull LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.add_report_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(AddReportViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((HomeActivity) requireActivity());
        binding.setFragment(this);
        binding.setViewModel(viewModel);
    }

    private void setCategoriesSpinner() {
        final String[] categoriesList = requireActivity().getResources().getStringArray(R.array.danger_category_names);
        final CategoriesSpinnerAdapter spinnerAdapter =
                new CategoriesSpinnerAdapter(requireContext(), R.layout.custom_spinner_item, categoriesList);

        binding.categoriesSpinner.setAdapter(spinnerAdapter);
    }

    private void setCategoriesSpinnerListener() {
        binding.categoriesSpinner.setOnItemSelectedListener(itemSelectedListener);
    }

    private void setCategoriesSpinnerStyling() {
        final AdapterView.OnItemSelectedListener itemSelectedListener = new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(final AdapterView<?> parent,
                                       final View view,
                                       final int position,
                                       long id) {
//                if (MyCustomVariables.getFirebaseAuth().getUid() != null) {
//                    final int color = viewModel.getTextColor(SettingsActivity.this);
//                    // the first element will have the text aligned to its start and
//                    // the color based on the selected theme
//                    ((TextView) parent.getChildAt(0)).setTextColor(color);
//                    ((TextView) parent.getChildAt(0)).setGravity(Gravity.END);
//                    ((TextView) parent.getChildAt(0)).setTypeface(null, Typeface.BOLD);
//                }

                ((TextView) parent.getChildAt(0)).setTextColor(Color.parseColor("#00203f"));
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        };

        binding.categoriesSpinner.setOnItemSelectedListener(itemSelectedListener);


//        final int color = R.attr.colorPrimary;
//        final int dropDownTheme = R.attr.colorPrimary;
//
//        // setting arrow color
//        binding.categoriesSpinner.getBackground().setColorFilter(color, PorterDuff.Mode.SRC_ATOP);
//
////        // setting elements' color
////        binding.categoriesSpinner.setPopupBackgroundResource(dropDownTheme);
    }

    private void setAddReportPhotoCallback() {
        ((HomeActivity) requireActivity()).setAddReportPhotoUriCallback(selectedUri -> {
            if (!selectedUri.equals(viewModel.getSelectedPhotoUri())) {
                viewModel.setSelectedPhotoUri(selectedUri);
                binding.photo.setImageURI(viewModel.getSelectedPhotoUri());
                setPhotoText();
            }
        });
    }

    public void setPhotoText() {
        binding.photoContainer.setVisibility(viewModel.getSelectedPhotoUri() != null ? View.VISIBLE : View.GONE);

        binding.photoText.setText(requireActivity().getResources().getString(viewModel.getSelectedPhotoUri() != null ?
                R.string.remove_photo : R.string.add_photo));
    }

    public void toggleButton(boolean enabled) {
        binding.uploadButton.setEnabled(enabled);
    }
}