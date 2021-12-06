package com.example.citydangersalertapp;

import android.app.DatePickerDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.DatePicker;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.databinding.HomeActivityBinding;
import com.example.citydangersalertapp.databinding.NavigationDrawerHeaderBinding;
import com.example.citydangersalertapp.feature.HomeViewModel;
import com.example.citydangersalertapp.feature.SettingsFragment;
import com.example.citydangersalertapp.feature.addreport.AddReportFragment;
import com.example.citydangersalertapp.feature.editprofile.ProfileFragment;
import com.example.citydangersalertapp.feature.editreport.EditReportFragment;
import com.example.citydangersalertapp.feature.myreports.MyReportsFragment;
import com.example.citydangersalertapp.feature.myreports.MyReportsListAdapter;
import com.example.citydangersalertapp.feature.nearbydangersmap.NearbyDangersMapFragment;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.DeleteReportCustomDialog;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.material.navigation.NavigationView;

import java.time.LocalDate;
import java.util.ArrayList;

public class HomeActivity
        extends AppCompatActivity
        implements DatePickerDialog.OnDateSetListener,
        DeleteReportCustomDialog.DeleteDialogListener,
        NavigationView.OnNavigationItemSelectedListener,
        ProfileFragment.OnBirthDateReceivedCallback {
    private HomeActivityBinding homeActivityBinding;
    private NavigationDrawerHeaderBinding drawerHeaderBinding;
    private HomeViewModel viewModel;
    private Toast backToast;

    @Override
    public void onBackPressed() {
        if (homeActivityBinding != null && homeActivityBinding.drawer.isDrawerOpen(GravityCompat.START)) {
            homeActivityBinding.drawer.closeDrawer(GravityCompat.START);
        }
        // if the current Fragment is AddDanger
        else if (viewModel.getCurrentFragment() instanceof AddReportFragment) {
            setFragment(viewModel.getLastFragment());
        } else if (!(viewModel.getCurrentFragment() instanceof MyReportsFragment)) {
            setFragment(viewModel.getMyReportsFragmentInstance());
        } else {
            if (viewModel.getBackPressedTime() + 2000 > System.currentTimeMillis()) {
                backToast.cancel();
                super.onBackPressed();
                return;
            } else {
                backToast = Toast.makeText(this,
                        "Press again to exit",
                        Toast.LENGTH_SHORT);

                backToast.show();
            }

            viewModel.setBackPressedTime(System.currentTimeMillis());
        }
    }

    @Override
    public void onBirthDateReceived(LocalDate newBirthDate) {
        final Fragment currentDisplayedFragment = viewModel.getCurrentFragment();

        if (currentDisplayedFragment instanceof ProfileFragment) {
            ((ProfileFragment) currentDisplayedFragment).setBirthDateText(newBirthDate);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setActivityVariables();
        setToolbarTitle();
        setLayoutVariables();
        setToolbar();
        setDrawer();
        setNavigationViewItemListener();
    }

    @Override
    public void onDialogPositiveClick(DialogFragment dialog,
                                      ArrayList<Report> reportsList,
                                      MyReportsListAdapter adapter,
                                      int positionInList) {
        final Report reportToDelete = reportsList.get(positionInList);
        final String currentUserID = MyCustomVariables.getFirebaseAuth().getUid();

        reportsList.remove(positionInList);
        adapter.notifyItemRemoved(positionInList);

        if (currentUserID != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(currentUserID)
                    .child("personalReports")
                    .child(reportToDelete.getReportId())
                    .removeValue();
        }
    }

    @Override
    public void onDialogNegativeClick(DialogFragment dialog) {

    }

    @Override
    public void onDateSet(DatePicker view,
                          int year,
                          int month,
                          int dayOfMonth) {
        final LocalDate newBirthDate = LocalDate.of(year, month + 1, dayOfMonth);

        onBirthDateReceived(newBirthDate);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        return viewModel.selectNavigationItemHandler(this, item, homeActivityBinding);
    }

    @Override
    protected void onStart() {
        super.onStart();
        setFragment(viewModel.getCurrentFragment());
        setDrawerUserProfile();
    }

    private void setToolbarTitle() {
        if (viewModel.getCurrentFragment() instanceof AddReportFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals("Add report")) {
            homeActivityBinding.toolbar.setTitle("Add report");
        } else if (viewModel.getCurrentFragment() instanceof EditReportFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals("Edit report")) {
            homeActivityBinding.toolbar.setTitle("Edit report");
        } else if (viewModel.getCurrentFragment() instanceof MyReportsFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals("My reports")) {
            homeActivityBinding.toolbar.setTitle("My reports");
        } else if (viewModel.getCurrentFragment() instanceof NearbyDangersMapFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals("Nearby dangers")) {
            homeActivityBinding.toolbar.setTitle("Nearby dangers");
        } else if (viewModel.getCurrentFragment() instanceof ProfileFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals("Profile")) {
            homeActivityBinding.toolbar.setTitle("Profile");
        } else if (viewModel.getCurrentFragment() instanceof SettingsFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals("Settings")) {
            homeActivityBinding.toolbar.setTitle("Settings");
        }
    }

    private void setDrawer() {
        final ActionBarDrawerToggle drawerToggle =
                new ActionBarDrawerToggle(this, homeActivityBinding.drawer, homeActivityBinding.toolbar,
                        R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        homeActivityBinding.drawer.addDrawerListener(drawerToggle);
        homeActivityBinding.navigationView.setCheckedItem(R.id.drawer_menu_my_reports);
        drawerToggle.syncState();
        drawerToggle.getDrawerArrowDrawable().setColor(Color.parseColor("#ADEFD1"));
    }

    public void setFragment(Fragment newFragment) {
        final int addReportButtonVisibility =
                !(newFragment instanceof MyReportsFragment || newFragment instanceof NearbyDangersMapFragment) ?
                        View.GONE : View.VISIBLE;

        final int newCheckedItemId =
                newFragment instanceof MyReportsFragment ?
                        R.id.drawer_menu_my_reports :
                        newFragment instanceof NearbyDangersMapFragment ?
                                R.id.drawer_menu_nearby_dangers :
                                newFragment instanceof ProfileFragment ?
                                        R.id.drawer_menu_profile :
                                        newFragment instanceof SettingsFragment ?
                                                R.id.drawer_menu_settings : R.id.drawer_menu_add_report;

        viewModel.setLastFragment(viewModel.getCurrentFragment());
        viewModel.setCurrentFragment(newFragment);

        getSupportFragmentManager()
                .beginTransaction()
                .replace(homeActivityBinding.fragmentContainer.getId(), newFragment)
                .commit();

        // hiding the button if the new fragment is an instance of AddReportFragment, SettingsFragment or ProfileFragment
        homeActivityBinding.addReportButton.setVisibility(addReportButtonVisibility);
        homeActivityBinding.navigationView.setCheckedItem(newCheckedItemId);
        setToolbarTitle();
    }

    private void setLayoutVariables() {
        homeActivityBinding.setActivity(this);
        homeActivityBinding.setViewModel(viewModel);
    }

    private void setNavigationViewItemListener() {
        homeActivityBinding.navigationView.setNavigationItemSelectedListener(this);
    }

    private void setToolbar() {
        setSupportActionBar(homeActivityBinding.toolbar);
    }

    private void setActivityVariables() {
        homeActivityBinding = DataBindingUtil.setContentView(this, R.layout.home_activity);
        drawerHeaderBinding = DataBindingUtil.inflate(getLayoutInflater(), R.layout.navigation_drawer_header, homeActivityBinding.drawer, false);
        viewModel = new ViewModelProvider(this).get(HomeViewModel.class);
    }

    private void setDrawerUserProfile() {
        viewModel.setDrawerProfile(homeActivityBinding);
    }
}