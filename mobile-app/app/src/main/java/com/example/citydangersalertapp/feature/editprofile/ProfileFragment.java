package com.example.citydangersalertapp.feature.editprofile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.citydangersalertapp.HomeActivity;
import com.example.citydangersalertapp.R;
import com.example.citydangersalertapp.databinding.ProfileFragmentBinding;
import com.example.citydangersalertapp.model.MyCustomDate;
import com.example.citydangersalertapp.model.UserPersonalInformation;
import com.example.citydangersalertapp.utility.MyCustomMethods;
import com.example.citydangersalertapp.utility.MyCustomVariables;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import java.time.LocalDate;

public class ProfileFragment extends Fragment {
    private ProfileFragmentBinding binding;
    private ProfileViewModel viewModel;

    public interface OnBirthDateReceivedCallback {
        void onBirthDateReceived(LocalDate newBirthDate);
    }

    public ProfileFragment() {
        // Required empty public constructor
    }

    public static ProfileFragment newInstance() {
        ProfileFragment fragment = new ProfileFragment();
        Bundle args = new Bundle();

        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        setFragmentVariables(inflater, container);
        setLayoutVariables();
        setFieldHints();

        return binding.getRoot();
    }

    public void setBirthDateText(final LocalDate date) {
        final String formattedDate = MyCustomMethods.getFormattedDate(date);

        if (!viewModel.getBirthDate().equals(date)) {
            viewModel.setBirthDate(date);
        }

        binding.birthDateText.setText(formattedDate);
    }

    private void setFragmentVariables(LayoutInflater inflater,
                                      ViewGroup container) {
        binding = DataBindingUtil.inflate(inflater, R.layout.profile_fragment, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(ProfileViewModel.class);
    }

    private void setFieldHints() {
        final String currentUserID = MyCustomVariables.getFirebaseAuth().getUid();

        if (currentUserID != null) {
            MyCustomVariables.getDatabaseReference()
                    .child("usersList")
                    .child(currentUserID)
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            if (snapshot.exists() && snapshot.hasChild("personalInformation")) {
                                final UserPersonalInformation personalInformation =
                                        snapshot.child("personalInformation").getValue(UserPersonalInformation.class);

                                if (personalInformation != null) {
                                    final MyCustomDate birthDate = personalInformation.getBirthDate();

                                    binding.emailField.setHint(personalInformation.getEmail());
                                    binding.firstNameField.setHint(personalInformation.getFirstName());
                                    binding.firstNameField.setText(personalInformation.getFirstName());
                                    binding.lastNameField.setHint(personalInformation.getLastName());
                                    binding.lastNameField.setText(personalInformation.getLastName());
                                    binding.pinField.setHint(personalInformation.getPin());
                                    binding.pinField.setText(personalInformation.getPin());

                                    setBirthDateText(LocalDate.of(birthDate.getYear(), birthDate.getMonth(), birthDate.getDay()));
                                }
                            }
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {

                        }
                    });
        }
    }

    private void setLayoutVariables() {
        binding.setActivity((HomeActivity) requireActivity());
        binding.setFragmentManager(requireActivity().getSupportFragmentManager());
        binding.setViewModel(viewModel);
    }
}