package com.example.citydangersalertapp.feature;

import android.app.Activity;
import android.content.Intent;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.view.GravityCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.HomeActivityBinding;
import com.example.citydangersalertapp.feature.addreport.AddReportFragment;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.feature.myreports.MyReportsFragment;
import com.example.citydangersalertapp.feature.nearbydangersmap.NearbyDangersMapFragment;

public class HomeViewModel extends ViewModel {
    private final AddReportFragment addReportFragmentInstance = new AddReportFragment();
    private final MyReportsFragment myReportsFragmentInstance = new MyReportsFragment();
    private final NearbyDangersMapFragment nearbyDangersMapFragmentInstance = new NearbyDangersMapFragment();
    private final ProfileFragment profileFragmentInstance = new ProfileFragment();
    private Fragment currentFragment = myReportsFragmentInstance;
    private Fragment lastFragment = currentFragment;
    private long backPressedTime;

    public AddReportFragment getAddReportFragmentInstance() {
        return addReportFragmentInstance;
    }

    public MyReportsFragment getMyReportsFragmentInstance() {
        return myReportsFragmentInstance;
    }

    public NearbyDangersMapFragment getNearbyDangersMapFragmentInstance() {
        return nearbyDangersMapFragmentInstance;
    }

    public ProfileFragment getProfileFragmentInstance() {
        return profileFragmentInstance;
    }

    public Fragment getCurrentFragment() {
        return currentFragment;
    }

    public void setCurrentFragment(Fragment currentFragment) {
        this.currentFragment = currentFragment;
    }

    public Fragment getLastFragment() {
        return lastFragment;
    }

    public void setLastFragment(Fragment lastFragment) {
        this.lastFragment = lastFragment;
    }

    public long getBackPressedTime() {
        return backPressedTime;
    }

    public void setBackPressedTime(long backPressedTime) {
        this.backPressedTime = backPressedTime;
    }

    public void setFragmentHandler(@NonNull Activity parentActivity,
                                   @NonNull Fragment newFragment) {

    }

    public void addDangerHandler(@NonNull Activity parentActivity) {
        if (!(getCurrentFragment() instanceof AddReportFragment)) {
            ((HomeActivity) parentActivity).setFragment(addReportFragmentInstance);
        }
    }

    public void logOutHandler(@NonNull Activity parentActivity) {
        parentActivity.startActivity(new Intent(parentActivity, AuthenticationActivity.class));
        parentActivity.finishAffinity();
//        parentActivity.overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    public boolean selectNavigationItemHandler(@NonNull HomeActivity parentActivity,
                                               @NonNull MenuItem item,
                                               HomeActivityBinding binding) {
        if (item.getItemId() == R.id.drawer_menu_my_reports &&
                !(currentFragment instanceof MyReportsFragment)) {
            // viewModel.setCurrentFragment(viewModel.getMyReportsFragmentInstance());

            parentActivity.setFragment(myReportsFragmentInstance);
            Toast.makeText(parentActivity, "set new fragment", Toast.LENGTH_SHORT).show();
        } else if (item.getItemId() == R.id.drawer_menu_nearby_dangers &&
                !(currentFragment instanceof NearbyDangersMapFragment)) {
            // viewModel.setCurrentFragment(viewModel.getNearbyDangersMapFragmentInstance());
            parentActivity.setFragment(nearbyDangersMapFragmentInstance);
            Toast.makeText(parentActivity, "set new fragment", Toast.LENGTH_SHORT).show();
        } else if (item.getItemId() == R.id.drawer_menu_profile &&
                !(currentFragment instanceof ProfileFragment)) {
            // viewModel.setCurrentFragment(viewModel.getProfileFragmentInstance());
            parentActivity.setFragment(profileFragmentInstance);
            Toast.makeText(parentActivity, "set new fragment", Toast.LENGTH_SHORT).show();
        } else if (item.getItemId() == R.id.drawer_menu_settings &&
                !(currentFragment instanceof SettingsFragment)) {

        } else if (item.getItemId() == R.id.drawer_menu_log_out) {
            logOutHandler(parentActivity);
        }

        binding.drawer.closeDrawer(GravityCompat.START);

        return true;
    }
}