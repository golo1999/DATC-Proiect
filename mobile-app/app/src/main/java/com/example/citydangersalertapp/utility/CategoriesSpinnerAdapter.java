package com.example.citydangersalertapp.utility;

import android.content.Context;
import android.graphics.Color;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.example.citydangersalertapp.R;

public class CategoriesSpinnerAdapter extends ArrayAdapter<String> {
    private Context context;

    public CategoriesSpinnerAdapter(Context context,
                                    int textViewResourceId,
                                    String[] categoriesList) {
        super(context, textViewResourceId, categoriesList);
    }

    @Override
    public View getDropDownView(int position,
                                @Nullable View convertView,
                                @NonNull ViewGroup parent) {
        final View view = super.getDropDownView(position, convertView, parent);

        ((TextView) view).setGravity(Gravity.CENTER);
        ((TextView) view).setTextColor(Color.parseColor("#adefd1"));
        view.setBackgroundColor(Color.parseColor("#00203f"));

        return view;
    }
}