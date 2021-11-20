package com.example.citydangersalertapp.feature;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.feature.adddanger.AddDangerFragment;

public class HomeViewModel extends ViewModel {
    private final AddDangerFragment addDangerFragmentInstance = new AddDangerFragment();
    private final MyReportsFragment myReportsFragmentInstance = new MyReportsFragment();
    private final NearbyDangersMapFragment nearbyDangersMapFragmentInstance = new NearbyDangersMapFragment();
    private final ProfileFragment profileFragmentInstance = new ProfileFragment();
    private Fragment currentFragment = myReportsFragmentInstance;
    private Fragment lastFragment = currentFragment;
    private long backPressedTime;

    public AddDangerFragment getAddDangerFragmentInstance() {
        return addDangerFragmentInstance;
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

    public void onAddDangerButtonClick(@NonNull Activity parentActivity) {
        if (!(getCurrentFragment() instanceof AddDangerFragment)) {
            ((HomeActivity) parentActivity).setFragment(getAddDangerFragmentInstance());
        }
    }
}