package com.example.citydangersalertapp.feature;

import static android.content.Context.MODE_PRIVATE;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
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
import com.example.citydangersalertapp.feature.editprofile.ProfileFragment;
import com.example.citydangersalertapp.feature.editreport.EditReportFragment;
import com.example.citydangersalertapp.feature.myreports.MyReportsFragment;
import com.example.citydangersalertapp.feature.nearbydangersmap.NearbyDangersMapFragment;
import com.example.citydangersalertapp.feature.selectphoto.SelectPhotoFragment;
import com.example.citydangersalertapp.model.Report;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import de.hdodenhof.circleimageview.CircleImageView;

public class HomeViewModel extends ViewModel {
    private final AddReportFragment addReportFragmentInstance = new AddReportFragment();
    private final EditReportFragment editReportFragmentInstance = new EditReportFragment(this);
    private final MyReportsFragment myReportsFragmentInstance = new MyReportsFragment(this);
    private final NearbyDangersMapFragment nearbyDangersMapFragmentInstance = new NearbyDangersMapFragment();
    private final ProfileFragment profileFragmentInstance = new ProfileFragment();
    private final SelectPhotoFragment selectPhotoFragmentInstance = new SelectPhotoFragment();
    private Fragment currentFragment;
    private Fragment lastFragment = currentFragment;
    private Report selectedReport;
    private long backPressedTime;
    private Uri imageUri;

    public int getProfileSelectPhotoRequestId() {
        return 2;
    }

    public int getAddReportPhotoRequestId() {
        return 3;
    }

    public int getEditReportPhotoRequestId() {
        return 5;
    }

    public MyReportsFragment getMyReportsFragmentInstance() {
        return myReportsFragmentInstance;
    }

    public SelectPhotoFragment getSelectPhotoFragmentInstance() {
        return selectPhotoFragmentInstance;
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

    public Report getSelectedReport() {
        return selectedReport;
    }

    public void setSelectedReport(Report selectedReport) {
        this.selectedReport = selectedReport;
    }

    public long getBackPressedTime() {
        return backPressedTime;
    }

    public void setBackPressedTime(long backPressedTime) {
        this.backPressedTime = backPressedTime;
    }

    public Uri getImageUri() {
        return imageUri;
    }

    public void setImageUri(Uri imageUri) {
        this.imageUri = imageUri;
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
        MyCustomMethods.saveRememberMeToSharedPreferences(parentActivity, false, "rememberMeChecked");
        parentActivity.finishAffinity();
        parentActivity.startActivity(new Intent(parentActivity, AuthenticationActivity.class));
    }

    public void saveReportDetailsHandler(@NonNull Activity parentActivity) {
        if (selectedReport != null) {
            parentActivity.onBackPressed();
        }
    }

    public void saveReportToSharedPreferences(@NonNull Activity parentActivity) {
        if (selectedReport != null) {
            SharedPreferences preferences =
                    parentActivity.getSharedPreferences(MyCustomVariables.getSharedPreferencesAppData(), MODE_PRIVATE);

            SharedPreferences.Editor editor = preferences.edit();
            Gson gson = new Gson();
            String json = gson.toJson(selectedReport);

            editor.putString("selectedReport", json);
            editor.apply();
        }
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
        } else if (item.getItemId() == R.id.drawer_menu_log_out) {
            logOutHandler(parentActivity);
        }

        binding.drawer.closeDrawer(GravityCompat.START);

        return true;
    }

    public void setDrawerProfile(HomeActivityBinding binding) {
        final View drawerHeader = binding.navigationView.getHeaderView(0);
        final CircleImageView drawerPhoto = drawerHeader.findViewById(R.id.photo);
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

                                    if (personalInformation.getPhotoURL() != null) {
                                        Picasso.get()
                                                .load(personalInformation.getPhotoURL())
                                                .fit()
                                                .into(drawerPhoto);
                                    }

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