package com.example.citydangersalertapp.feature.editreport;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.EditReportFragmentBinding;
import com.example.citydangersalertapp.feature.HomeViewModel;
import com.example.citydangersalertapp.model.MyCustomDateTime;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.MyCustomMethods;

import java.time.LocalDate;
import java.time.LocalTime;

public class EditReportFragment extends Fragment {
    private EditReportFragmentBinding binding;
    private HomeViewModel homeViewModel;
    private EditReportViewModel editReportViewModel;

    public interface OnReportDateTimeReceivedCallback {
        void onReportDateReceived(LocalDate newReportDate);

        void onReportTimeReceived(LocalTime newReportTime);
    }

    final AdapterView.OnItemSelectedListener itemSelectedListener = new AdapterView.OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> parent,
                                   View view,
                                   int position,
                                   long id) {
//            MyCustomMethods.showShortMessage(requireContext(), String.valueOf(position));

            if (editReportViewModel.getCategory().get() != position) {
                editReportViewModel.setCategory(position);
            }
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {

        }
    };

    public EditReportFragment() {
        // Required empty public constructor
    }

    public EditReportFragment(HomeViewModel homeViewModel) {
        this.homeViewModel = homeViewModel;
    }

    public static EditReportFragment newInstance() {
        EditReportFragment fragment = new EditReportFragment();
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
        setCategoriesSpinnerListener();

        return binding.getRoot();
    }

    @Override
    public void onStart() {
        super.onStart();
        setFieldHints();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        removeCategoriesSpinnerListener();
    }

    private void removeCategoriesSpinnerListener() {
        binding.categoriesSpinner.setOnItemSelectedListener(null);
    }

    private void setFieldHints() {
        final Report selectedReport = homeViewModel.getSelectedReport();

        if (selectedReport != null) {
            final MyCustomDateTime reportDateTime = selectedReport.getDateTime();

            final LocalDate reportFormattedDate =
                    LocalDate.of(reportDateTime.getYear(), reportDateTime.getMonth(), reportDateTime.getDay());

            final LocalTime reportFormattedTime =
                    LocalTime.of(reportDateTime.getHour(), reportDateTime.getMinute(), reportDateTime.getSecond());

            if (selectedReport.getNote() != null) {
                binding.noteField.setHint(selectedReport.getNote());
                editReportViewModel.setNote(selectedReport.getNote());
            }

            binding.categoriesSpinner.setSelection(selectedReport.getCategory());

            setReportDateText(reportFormattedDate);
            setReportTimeText(reportFormattedTime);
        }
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.edit_report_fragment, container, false);
        editReportViewModel = new ViewModelProvider(requireActivity()).get(EditReportViewModel.class);
    }

    private void setLayoutVariables() {
        binding.setActivity((HomeActivity) requireActivity());
        binding.setFragmentManager(requireActivity().getSupportFragmentManager());
        binding.setEditReportViewModel(editReportViewModel);
        binding.setHomeViewModel(homeViewModel);
    }

    public void setReportDateText(final LocalDate date) {
        final String formattedDate = MyCustomMethods.getFormattedDate(date);

        if (!editReportViewModel.getDate().equals(date)) {
            editReportViewModel.setDate(date);
        }

        binding.dateText.setText(formattedDate);
    }

    public void setReportTimeText(final LocalTime time) {
        final String formattedTime = MyCustomMethods.getFormattedTime(requireContext(), time);

        if (!editReportViewModel.getTime().equals(time)) {
            editReportViewModel.setTime(time);
        }

        binding.timeText.setText(formattedTime);
    }

    private void setCategoriesSpinnerListener() {
        binding.categoriesSpinner.setOnItemSelectedListener(itemSelectedListener);
    }
}