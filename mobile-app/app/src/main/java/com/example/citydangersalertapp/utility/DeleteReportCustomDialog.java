package com.example.citydangersalertapp.utility;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;

import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.feature.myreports.MyReportsListAdapter;
import com.example.citydangersalertapp.model.Report;

import java.util.ArrayList;

public class DeleteReportCustomDialog extends DialogFragment {
    private final ArrayList<Report> reportsList;
    private final MyReportsListAdapter adapter;
    private final int positionInList;
    private DeleteDialogListener listener;

    public DeleteReportCustomDialog(final ArrayList<Report> reportsList,
                                    final MyReportsListAdapter adapter,
                                    final int positionInList) {
        this.reportsList = reportsList;
        this.adapter = adapter;
        this.positionInList = positionInList;
    }

    public interface DeleteDialogListener {
        void onDialogPositiveClick(final DialogFragment dialog,
                                   final ArrayList<Report> transactionsList,
                                   final MyReportsListAdapter adapter,
                                   final int positionInList);

        void onDialogNegativeClick(final DialogFragment dialog);
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(final Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        builder.setMessage(R.string.delete_report)
                .setPositiveButton(R.string.ok, (dialog, id) ->
                        listener.onDialogPositiveClick(DeleteReportCustomDialog.this, reportsList,
                                adapter, positionInList))
                .setNegativeButton(R.string.cancel, (dialog, id) ->
                        listener.onDialogNegativeClick(DeleteReportCustomDialog.this));

        return builder.create();
    }

    @Override
    public void onAttach(final @NonNull Context context) {
        super.onAttach(context);

        try {
            listener = (DeleteDialogListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException(context.toString() + " must implement NoticeDialogListener");
        }
    }
}