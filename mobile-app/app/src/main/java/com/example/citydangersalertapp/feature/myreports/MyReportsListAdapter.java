package com.example.citydangersalertapp.feature.myreports;

import android.content.Context;
import android.content.SharedPreferences;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.feature.HomeViewModel;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.DeleteReportCustomDialog;

import java.util.ArrayList;

public class MyReportsListAdapter extends RecyclerView.Adapter<MyReportsListAdapter.ViewHolder> {
    private final HomeActivity homeActivity;
    private final HomeViewModel viewModel;
    private final ArrayList<Report> reportsList;
    private final Context context;
    private final RecyclerView recyclerView;
    private final FragmentManager fragmentManager;

    public MyReportsListAdapter(HomeActivity homeActivity,
                                HomeViewModel viewModel,
                                ArrayList<Report> reportsList,
                                Context context,
                                RecyclerView recyclerView,
                                FragmentManager fragmentManager) {
        this.homeActivity = homeActivity;
        this.viewModel = viewModel;
        this.reportsList = reportsList;
        this.context = context;
        this.recyclerView = recyclerView;
        this.fragmentManager = fragmentManager;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent,
                                         int viewType) {
        final View view =
                LayoutInflater.from(context).inflate(R.layout.report_item_design, parent, false);

        return new ViewHolder(view, homeActivity, viewModel, context, reportsList, recyclerView, fragmentManager);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder,
                                 int position) {
        final String[] categoryNamesList = context.getResources().getStringArray(R.array.danger_category_names);
        final Report report = reportsList.get(position);

        holder.reportCategory.setText(categoryNamesList[report.getCategory()]);
        holder.reportNote.setText(report.getNote() != null ? report.getNote() : "No note found");
        holder.reportDate.setText(report.getDateTime().toString());
    }

    @Override
    public int getItemCount() {
        return reportsList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private TextView reportCategory;
        private TextView reportNote;
        private TextView reportDate;
        private ImageView reportEdit;
        private ImageView reportDelete;
        private final HomeActivity homeActivity;
        private final HomeViewModel viewModel;
        private final Context context;
        private final ArrayList<Report> reportsList;
        private final RecyclerView recyclerView;
        private Report selectedReport;
        private ConstraintLayout mainLayout;
        private SharedPreferences preferences;
        private final FragmentManager fragmentManager;

        public ViewHolder(@NonNull View itemView,
                          HomeActivity homeActivity,
                          HomeViewModel viewModel,
                          Context context,
                          ArrayList<Report> reportsList,
                          RecyclerView recyclerView,
                          FragmentManager fragmentManager) {
            super(itemView);

            this.homeActivity = homeActivity;
            this.viewModel = viewModel;
            this.context = context;
            this.reportsList = reportsList;
            this.recyclerView = recyclerView;
            this.fragmentManager = fragmentManager;

            setVariables(itemView);
            setOnClickListeners();
        }

        private void setVariables(final View v) {
            reportCategory = v.findViewById(R.id.category);
            reportNote = v.findViewById(R.id.note);
            reportDate = v.findViewById(R.id.date);
            reportEdit = v.findViewById(R.id.editReport);
            reportDelete = v.findViewById(R.id.deleteReport);
            mainLayout = v.findViewById(R.id.mainLayout);
        }

        private void setOnClickListeners() {
            reportEdit.setOnClickListener((View view) -> {
                if (getBindingAdapterPosition() > -1) {
                    // retrieving the selected transaction from the list
                    selectedReport = reportsList.get(getBindingAdapterPosition());

                    if (selectedReport != null &&
                            (viewModel.getSelectedReport() == null ||
                                    !viewModel.getSelectedReport().equals(selectedReport))) {
                        viewModel.setSelectedReport(selectedReport);
                        viewModel.editReportHandler(homeActivity);
                    }
                }
            });

            reportDelete.setOnClickListener((View view) -> {
                final MyReportsListAdapter adapter =
                        (MyReportsListAdapter) recyclerView.getAdapter();

                final int positionInList = getBindingAdapterPosition();

                if (adapter != null && positionInList > -1) {
                    showTransactionDeleteDialog(reportsList, adapter, positionInList);
                }
            });
        }

        private void showTransactionDeleteDialog(final ArrayList<Report> reportsList,
                                                 final MyReportsListAdapter adapter,
                                                 final int positionInList) {
            DeleteReportCustomDialog deleteReportCustomDialog =
                    new DeleteReportCustomDialog(reportsList, adapter, positionInList);

            deleteReportCustomDialog.show(fragmentManager, "deleteDialogFragment");
        }
    }
}