package com.example.citydangersalertapp.feature.myreports;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.MyReportsFragmentBinding;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;

public class MyReportsFragment extends Fragment {
    private MyReportsFragmentBinding binding;
    private MyReportsViewModel viewModel;
    private final ArrayList<Report> reportsList = new ArrayList<>();
    private MyReportsListAdapter recyclerViewAdapter;

    public MyReportsFragment() {
        // Required empty public constructor
    }

    public static MyReportsFragment newInstance() {
        MyReportsFragment fragment = new MyReportsFragment();
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
        setRecyclerView();

        return binding.getRoot();
    }

    @Override
    public void onStart() {
        super.onStart();
        populateReportsList();
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.my_reports_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(MyReportsViewModel.class);
        recyclerViewAdapter =
                new MyReportsListAdapter(viewModel, reportsList, requireContext(), binding.recyclerView, requireActivity().getSupportFragmentManager());
    }

    private void setLayoutVariables() {

    }

    private void populateReportsList() {
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();

        if (currentUserId != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(currentUserId)
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            final boolean personalReportsNodeExists =
                                    snapshot.exists() && snapshot.hasChild("personalReports");

                            if (personalReportsNodeExists) {
                                if (!reportsList.isEmpty()) {
                                    final int currentNumberOfReports = recyclerViewAdapter.getItemCount();

                                    reportsList.clear();
                                    recyclerViewAdapter.notifyItemRangeRemoved(0, currentNumberOfReports);
                                }

                                for (final DataSnapshot personalReportsIterator : snapshot.child("personalReports").getChildren()) {
                                    final Report personalReport = personalReportsIterator.getValue(Report.class);

                                    if (personalReport != null) {
                                        reportsList.add(personalReport);
                                    }
                                }

                                recyclerViewAdapter.notifyItemRangeChanged(0, reportsList.size());
                            }

                            binding.noReportsFoundText.setVisibility(personalReportsNodeExists ? View.GONE : View.VISIBLE);
                            binding.recyclerView.setVisibility(personalReportsNodeExists ? View.VISIBLE : View.GONE);
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {

                        }
                    });
        }
    }

    private void setRecyclerView() {
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(recyclerViewAdapter);
    }
}