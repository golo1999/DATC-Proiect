package com.example.citydangersalertapp;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.DatePicker;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
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
import com.example.citydangersalertapp.feature.selectphoto.SelectPhotoFragment;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.utility.DeleteReportCustomDialog;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.material.navigation.NavigationView;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;

public class HomeActivity
        extends AppCompatActivity
        implements DatePickerDialog.OnDateSetListener,
        DeleteReportCustomDialog.DeleteDialogListener,
        EditReportFragment.OnReportDateTimeReceivedCallback,
        NavigationView.OnNavigationItemSelectedListener,
        ProfileFragment.OnBirthDateReceivedCallback,
        TimePickerDialog.OnTimeSetListener {
    private HomeActivityBinding homeActivityBinding;
    private NavigationDrawerHeaderBinding drawerHeaderBinding;
    private HomeViewModel viewModel;
    private Toast backToast;
    private final int profileSelectPhotoRequestId = 2;
    private final int addReportPhotoRequestId = 3;
    private final int editReportPhotoRequestId = 5;
    private GetSelectedPhotoUriCallback selectedPhotoUriCallback;
    private GetAddReportPhotoUriCallback addReportPhotoUriCallback;
    private GetEditReportPhotoUriCallback editReportPhotoUriCallback;

    public interface GetSelectedPhotoUriCallback {
        void getSelectedPhotoUri(Uri selectedUri);
    }

    public interface GetAddReportPhotoUriCallback {
        void getAddReportPhotoUri(Uri selectedUri);
    }

    public interface GetEditReportPhotoUriCallback {
        void getEditReportPhotoUri(Uri selectedUri);
    }

    @Override
    public void onBackPressed() {
        if (homeActivityBinding != null && homeActivityBinding.drawer.isDrawerOpen(GravityCompat.START)) {
            homeActivityBinding.drawer.closeDrawer(GravityCompat.START);
        }
        // if the current Fragment is AddDanger or SelectPhoto
        else if (viewModel.getCurrentFragment() instanceof AddReportFragment ||
                viewModel.getCurrentFragment() instanceof SelectPhotoFragment) {
            setFragment(viewModel.getLastFragment());
        }
        // if the current Fragment is MyReports
        else if (!(viewModel.getCurrentFragment() instanceof MyReportsFragment)) {
            setFragment(viewModel.getMyReportsFragmentInstance());
        } else {
            if (viewModel.getBackPressedTime() + 2000 > System.currentTimeMillis()) {
                backToast.cancel();
                super.onBackPressed();
                return;
            } else {
                backToast = Toast.makeText(this,
                        getResources().getString(R.string.press_again_to_exit),
                        Toast.LENGTH_SHORT);

                backToast.show();
            }

            viewModel.setBackPressedTime(System.currentTimeMillis());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setActivityVariables();
        setLayoutVariables();
        setToolbar();
        initializeDrawer();
        setNavigationViewItemListener();
    }

    @Override
    protected void onStart() {
        super.onStart();
        setFragment(viewModel.getCurrentFragment() != null ?
                viewModel.getCurrentFragment() : viewModel.getMyReportsFragmentInstance());
        setDrawerUserProfile();
        setToolbarTitle();
    }

    @Override
    protected void onActivityResult(int requestCode,
                                    int resultCode,
                                    @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (data != null && data.getData() != null) {
            if (requestCode == profileSelectPhotoRequestId) {
                viewModel.setImageUri(data.getData());
                selectedPhotoUriCallback.getSelectedPhotoUri(viewModel.getImageUri());
            } else if (requestCode == addReportPhotoRequestId) {
                viewModel.setImageUri(data.getData());
                addReportPhotoUriCallback.getAddReportPhotoUri(viewModel.getImageUri());
            } else if (requestCode == editReportPhotoRequestId) {
                viewModel.setImageUri(data.getData());
                editReportPhotoUriCallback.getEditReportPhotoUri(viewModel.getImageUri());
            }
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
        final LocalDate newDate = LocalDate.of(year, month + 1, dayOfMonth);

        if (viewModel.getCurrentFragment() instanceof ProfileFragment) {
            onBirthDateReceived(newDate);
        } else if (viewModel.getCurrentFragment() instanceof EditReportFragment) {
            onReportDateReceived(newDate);
        }
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        return viewModel.selectNavigationItemHandler(this, item, homeActivityBinding);
    }

    @Override
    public void onReportDateReceived(LocalDate newReportDate) {
        final Fragment currentDisplayedFragment = viewModel.getCurrentFragment();

        if (currentDisplayedFragment instanceof EditReportFragment) {
            ((EditReportFragment) currentDisplayedFragment).setReportDateText(newReportDate);
        }
    }

    @Override
    public void onReportTimeReceived(LocalTime newReportTime) {
        final Fragment currentDisplayedFragment = viewModel.getCurrentFragment();

        if (currentDisplayedFragment instanceof EditReportFragment) {
            ((EditReportFragment) currentDisplayedFragment).setReportTimeText(newReportTime);
        }
    }

    @Override
    public void onTimeSet(TimePicker view,
                          int hourOfDay,
                          int minute) {
        final LocalTime newTime = LocalTime.of(hourOfDay, minute);

        if (viewModel.getCurrentFragment() instanceof EditReportFragment) {
            onReportTimeReceived(newTime);
        }
    }

    public SelectPhotoFragment getPhotoFragmentInstance() {
        return viewModel.getSelectPhotoFragmentInstance();
    }

    private void initializeDrawer() {
        final ActionBarDrawerToggle drawerToggle =
                new ActionBarDrawerToggle(this, homeActivityBinding.drawer, homeActivityBinding.toolbar,
                        R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        homeActivityBinding.drawer.addDrawerListener(drawerToggle);
        homeActivityBinding.navigationView.setCheckedItem(R.id.drawer_menu_my_reports);
        drawerToggle.syncState();
        drawerToggle.getDrawerArrowDrawable().setColor(Color.parseColor("#ADEFD1"));
    }

    private void setToolbarTitle() {
        if (viewModel.getCurrentFragment() instanceof AddReportFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.add_report))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.add_report));
        } else if (viewModel.getCurrentFragment() instanceof EditReportFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.edit_report))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.edit_report));
        } else if ((viewModel.getCurrentFragment() instanceof MyReportsFragment || viewModel.getCurrentFragment() == null) &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.my_reports))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.my_reports));
        } else if (viewModel.getCurrentFragment() instanceof NearbyDangersMapFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.nearby_dangers))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.nearby_dangers));
        } else if (viewModel.getCurrentFragment() instanceof ProfileFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.profile))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.profile));
        } else if (viewModel.getCurrentFragment() instanceof SettingsFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.settings))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.settings));
        } else if (viewModel.getCurrentFragment() instanceof SelectPhotoFragment &&
                !String.valueOf(homeActivityBinding.toolbar.getTitle()).trim().equals(getResources().getString(R.string.select_photo))) {
            homeActivityBinding.toolbar.setTitle(getResources().getString(R.string.select_photo));
        }
    }

    public void setFragment(Fragment newFragment) {
        if (viewModel.getCurrentFragment() == null
                || !newFragment.getClass().toString().equals(viewModel.getCurrentFragment().getClass().toString())) {
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

            if (viewModel.getCurrentFragment() instanceof EditReportFragment) {
                int navMenuSize = homeActivityBinding.navigationView.getMenu().size();

                for (int i = 0; i < navMenuSize; i++) {
                    homeActivityBinding.navigationView.getMenu().getItem(i).setChecked(false);
                }
            }
        }
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
        drawerHeaderBinding = DataBindingUtil.inflate(getLayoutInflater(), R.layout.navigation_drawer_header,
                homeActivityBinding.drawer, false);
        viewModel = new ViewModelProvider(this).get(HomeViewModel.class);
    }

    public void setDrawerUserProfile() {
        viewModel.setDrawerProfile(homeActivityBinding);
    }

    public void setAddReportPhotoUriCallback(GetAddReportPhotoUriCallback callback) {
        this.addReportPhotoUriCallback = callback;
    }

    public void setEditReportPhotoUriCallback(GetEditReportPhotoUriCallback callback) {
        this.editReportPhotoUriCallback = callback;
    }

    public void setSelectedPhotoUriCallback(GetSelectedPhotoUriCallback callback) {
        this.selectedPhotoUriCallback = callback;
    }
}