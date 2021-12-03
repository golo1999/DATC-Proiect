package com.example.citydangersalertapp.feature;

import android.app.Activity;
import android.content.Intent;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.view.GravityCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.HomeActivityBinding;
import com.example.citydangersalertapp.feature.addreport.AddReportFragment;
import com.example.citydangersalertapp.feature.authentication.AuthenticationActivity;
import com.example.citydangersalertapp.feature.editreport.EditReportFragment;
import com.example.citydangersalertapp.feature.myreports.MyReportsFragment;
import com.example.citydangersalertapp.feature.nearbydangersmap.NearbyDangersMapFragment;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class HomeViewModel extends ViewModel {
    private final AddReportFragment addReportFragmentInstance = new AddReportFragment();
    private final EditReportFragment editReportFragmentInstance = new EditReportFragment();
    private final MyReportsFragment myReportsFragmentInstance = new MyReportsFragment();
    private final NearbyDangersMapFragment nearbyDangersMapFragmentInstance = new NearbyDangersMapFragment();
    private final ProfileFragment profileFragmentInstance = new ProfileFragment();
    private final SettingsFragment settingsFragmentInstance = new SettingsFragment();
    private Fragment currentFragment = myReportsFragmentInstance;
    private Fragment lastFragment = currentFragment;
    private long backPressedTime;

    public AddReportFragment getAddReportFragmentInstance() {
        return addReportFragmentInstance;
    }

    public EditReportFragment getEditReportFragmentInstance() {
        return editReportFragmentInstance;
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

    public SettingsFragment getSettingsFragmentInstance() {
        return settingsFragmentInstance;
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

    public void addReportHandler(@NonNull Activity parentActivity) {
        if (!(getCurrentFragment() instanceof AddReportFragment)) {
            ((HomeActivity) parentActivity).setFragment(addReportFragmentInstance);
        }
    }

    public void editReportHandler(@NonNull Activity parentActivity) {
        if (!(getCurrentFragment() instanceof EditReportFragment)) {
            ((HomeActivity) parentActivity).setFragment(editReportFragmentInstance);
        }
    }

    public void logOutHandler(@NonNull Activity parentActivity) {
        MyCustomVariables.getFirebaseAuth().signOut();
        parentActivity.startActivity(new Intent(parentActivity, AuthenticationActivity.class));
        parentActivity.finishAffinity();
//        parentActivity.overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    public boolean selectNavigationItemHandler(@NonNull HomeActivity parentActivity,
                                               @NonNull MenuItem item,
                                               HomeActivityBinding binding) {
        if (item.getItemId() == R.id.drawer_menu_my_reports && !(currentFragment instanceof MyReportsFragment)) {
            parentActivity.setFragment(myReportsFragmentInstance);
        } else if (item.getItemId() == R.id.drawer_menu_add_report && !(currentFragment instanceof AddReportFragment)) {
            parentActivity.setFragment(addReportFragmentInstance);
        } else if (item.getItemId() == R.id.drawer_menu_nearby_dangers && !(currentFragment instanceof NearbyDangersMapFragment)) {
            parentActivity.setFragment(nearbyDangersMapFragmentInstance);
        } else if (item.getItemId() == R.id.drawer_menu_profile && !(currentFragment instanceof ProfileFragment)) {
            parentActivity.setFragment(profileFragmentInstance);
        } else if (item.getItemId() == R.id.drawer_menu_settings && !(currentFragment instanceof SettingsFragment)) {
            parentActivity.setFragment(settingsFragmentInstance);
        } else if (item.getItemId() == R.id.drawer_menu_log_out) {
            logOutHandler(parentActivity);
        }

        binding.drawer.closeDrawer(GravityCompat.START);

        return true;
    }

    public void setDrawerProfile(HomeActivityBinding binding) {
        final View drawerHeader = binding.navigationView.getHeaderView(0);
        final TextView drawerName = drawerHeader.findViewById(R.id.name);
        final TextView drawerEmail = drawerHeader.findViewById(R.id.email);
        final TextView drawerLevel = drawerHeader.findViewById(R.id.level);
        final String currentUserId = MyCustomVariables.getFirebaseAuth().getUid();

        if (currentUserId != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(currentUserId)
                    .child("personalInformation")
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            if (snapshot.exists()) {
                                final UserPersonalInformation personalInformation =
                                        snapshot.getValue(UserPersonalInformation.class);

                                if (personalInformation != null) {
                                    final String currentUserLevel = "Level " + personalInformation.getLevel();

                                    drawerName.setText(personalInformation.getFirstName());
                                    drawerEmail.setText(personalInformation.getEmail());
                                    drawerLevel.setText(currentUserLevel);
                                }
                            }
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {

                        }
                    });
        }
    }
}