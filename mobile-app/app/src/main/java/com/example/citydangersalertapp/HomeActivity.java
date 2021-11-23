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
import com.example.citydangersalertapp.feature.HomeViewModel;
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
        return viewModel.selectNavigationItemHandler(this, item, binding);
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

    public void setFragment(Fragment newFragment) {
        viewModel.setCurrentFragment(newFragment);

        getSupportFragmentManager()
                .beginTransaction()
                .replace(binding.fragmentContainer.getId(), newFragment)
                .commit();

        // hiding the button if the new fragment is an instance of AddReportFragment
        binding.addReportButton.setVisibility(newFragment instanceof AddReportFragment ? View.GONE : View.VISIBLE);
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