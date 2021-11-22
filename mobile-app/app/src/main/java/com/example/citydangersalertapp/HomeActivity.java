package com.example.citydangersalertapp;

import android.graphics.Color;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.databinding.HomeActivityBinding;
import com.example.citydangersalertapp.feature.HomeViewModel;
import com.example.citydangersalertapp.feature.myreports.MyReportsFragment;
import com.example.citydangersalertapp.feature.NearbyDangersMapFragment;
import com.example.citydangersalertapp.feature.ProfileFragment;
import com.example.citydangersalertapp.feature.SettingsFragment;
import com.example.citydangersalertapp.feature.addreport.AddReportFragment;
import com.google.android.material.navigation.NavigationView;

public class HomeActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    private HomeActivityBinding binding;
    private HomeViewModel viewModel;
    private Toast backToast;

    @Override
    public void onBackPressed() {
        if (binding != null && binding.drawer.isDrawerOpen(GravityCompat.START)) {
            binding.drawer.closeDrawer(GravityCompat.START);
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
        setLayoutVariables();
        setToolbar();
        setDrawer();
        setNavigationViewItemListener();
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.drawer_menu_my_reports &&
                !(viewModel.getCurrentFragment() instanceof MyReportsFragment)) {
            // viewModel.setCurrentFragment(viewModel.getMyReportsFragmentInstance());
            setFragment(viewModel.getMyReportsFragmentInstance());
            Toast.makeText(this, "set new fragment", Toast.LENGTH_SHORT).show();
        } else if (item.getItemId() == R.id.drawer_menu_nearby_dangers &&
                !(viewModel.getCurrentFragment() instanceof NearbyDangersMapFragment)) {
            // viewModel.setCurrentFragment(viewModel.getNearbyDangersMapFragmentInstance());
            setFragment(viewModel.getNearbyDangersMapFragmentInstance());
            Toast.makeText(this, "set new fragment", Toast.LENGTH_SHORT).show();
        } else if (item.getItemId() == R.id.drawer_menu_profile &&
                !(viewModel.getCurrentFragment() instanceof ProfileFragment)) {
            // viewModel.setCurrentFragment(viewModel.getProfileFragmentInstance());
            setFragment(viewModel.getProfileFragmentInstance());
            Toast.makeText(this, "set new fragment", Toast.LENGTH_SHORT).show();
        } else if (item.getItemId() == R.id.drawer_menu_settings &&
                !(viewModel.getCurrentFragment() instanceof SettingsFragment)) {

        } else if (item.getItemId() == R.id.drawer_menu_log_out) {
            viewModel.logOutHandler(this);
        }

//        setFragment(viewModel.getCurrentFragment());
        binding.drawer.closeDrawer(GravityCompat.START);

        return true;
    }

    @Override
    protected void onStart() {
        super.onStart();
        setFragment(viewModel.getCurrentFragment());
    }

    private void setDrawer() {
        final ActionBarDrawerToggle drawerToggle = new ActionBarDrawerToggle(this, binding.drawer, binding.toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        binding.drawer.addDrawerListener(drawerToggle);
        drawerToggle.syncState();
        drawerToggle.getDrawerArrowDrawable().setColor(Color.WHITE);
    }

    public void setFragment(Fragment fragment) {
        viewModel.setCurrentFragment(fragment);

        getSupportFragmentManager()
                .beginTransaction()
                .replace(binding.fragmentContainer.getId(), fragment)
                .commit();
    }

    private void setLayoutVariables() {
        binding.setActivity(this);
        binding.setViewModel(viewModel);
    }

    private void setNavigationViewItemListener() {
        binding.navigationView.setNavigationItemSelectedListener(this);
    }

    private void setToolbar() {
        setSupportActionBar(binding.toolbar);
    }

    private void setActivityVariables() {
        binding = DataBindingUtil.setContentView(this, R.layout.home_activity);
        viewModel = new ViewModelProvider(this).get(HomeViewModel.class);
    }
}