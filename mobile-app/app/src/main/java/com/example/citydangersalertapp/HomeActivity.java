package com.example.citydangersalertapp;

import android.graphics.Color;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.databinding.HomeActivityBinding;
import com.example.citydangersalertapp.databinding.NavigationDrawerHeaderBinding;
import com.example.citydangersalertapp.feature.HomeViewModel;
import com.example.citydangersalertapp.feature.ProfileFragment;
import com.example.citydangersalertapp.feature.SettingsFragment;
import com.example.citydangersalertapp.feature.addreport.AddReportFragment;
import com.example.citydangersalertapp.feature.myreports.MyReportsFragment;
import com.example.citydangersalertapp.feature.nearbydangersmap.NearbyDangersMapFragment;
import com.google.android.material.navigation.NavigationView;

public class HomeActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
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
        final ActionBarDrawerToggle drawerToggle = new ActionBarDrawerToggle(this, homeActivityBinding.drawer, homeActivityBinding.toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        homeActivityBinding.drawer.addDrawerListener(drawerToggle);
        drawerToggle.syncState();
        drawerToggle.getDrawerArrowDrawable().setColor(Color.WHITE);
    }

    public void setFragment(Fragment newFragment) {
        viewModel.setCurrentFragment(newFragment);

        getSupportFragmentManager()
                .beginTransaction()
                .replace(homeActivityBinding.fragmentContainer.getId(), newFragment)
                .commit();

        // hiding the button if the new fragment is an instance of AddReportFragment
        homeActivityBinding.addReportButton.setVisibility(newFragment instanceof AddReportFragment ? View.GONE : View.VISIBLE);
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