package com.example.citydangersalertapp.feature.selectphoto;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.UploadTask;
import com.squareup.picasso.Picasso;

public class SelectPhotoViewModel extends ViewModel {
    private Uri selectedPhotoUri;

    public Uri getSelectedPhotoUri() {
        return selectedPhotoUri;
    }

    public void setSelectedPhotoUri(Uri selectedPhotoUri) {
        this.selectedPhotoUri = selectedPhotoUri;
    }

    public int getRequestId() {
        return 2;
    }

//    public void openFileChooser(@NonNull Activity activity) {
//        final Intent intent = new Intent();
//
//        intent.setType("image/*");
//        intent.setAction(Intent.ACTION_GET_CONTENT);
//        activity.startActivityForResult(intent, getRequestId());
//    }

    public void showPhoto(final ImageView uploadedPhoto) {
        if (MyCustomVariables.getFirebaseAuth().getUid() != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(MyCustomVariables.getFirebaseAuth().getUid())
                    .child("personalInformation")
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(final @NonNull DataSnapshot snapshot) {
                            if (snapshot.hasChild("photoURL")) {
                                final String URL = String.valueOf(snapshot.child("photoURL").getValue());

                                if (!URL.trim().isEmpty()) {
                                    Picasso.get()
                                            .load(URL)
                                            .fit()
                                            .into(uploadedPhoto);
                                }
                            }
                        }

                        @Override
                        public void onCancelled(final @NonNull DatabaseError error) {

                        }
                    });
        }
    }

    public void uploadSelectedPhoto(@NonNull Activity activity) {
        if (selectedPhotoUri != null) {
            if (MyCustomVariables.getFirebaseAuth().getUid() != null) {
                MyCustomVariables.getFirebaseStorageReference()
                        .child(MyCustomVariables.getFirebaseAuth().getUid())
                        .child("profilePicture")
                        .putFile(selectedPhotoUri)
                        .addOnSuccessListener((final UploadTask.TaskSnapshot taskSnapshot) -> {
                            final Task<Uri> uriTask = taskSnapshot.getStorage().getDownloadUrl();

                            while (!uriTask.isComplete()) ;

                            final Uri url = uriTask.getResult();

                            MyCustomVariables.getDatabaseReference()
                                    .child("usersList")
                                    .child(MyCustomVariables.getFirebaseAuth().getUid())
                                    .child("personalInformation")
                                    .child("photoURL")
                                    .setValue(String.valueOf(url))
                                    .addOnCompleteListener((Task<Void> uploadPhotoTask) -> {
                                        if (uploadPhotoTask.isSuccessful()) {
                                            ((HomeActivity) activity).setDrawerUserProfile();

                                            MyCustomMethods.showShortMessage(activity,
                                                    activity.getResources().getString(R.string.upload_successful));
                                        }
                                    });
                        })
                        .addOnFailureListener((final Exception e) ->
                                MyCustomMethods.showShortMessage(activity, e.getMessage()));
            }
        } else {
            MyCustomMethods.showShortMessage(activity, activity.getResources().getString(R.string.select_file_first));
        }
    }
}