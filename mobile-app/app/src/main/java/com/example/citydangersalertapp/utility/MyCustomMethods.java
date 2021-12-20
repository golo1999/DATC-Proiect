package com.example.citydangersalertapp.utility;

import static android.content.Context.MODE_PRIVATE;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.text.format.DateFormat;
import android.util.Patterns;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.example.citydangersalertapp.model.MyCustomDate;
import com.example.citydangersalertapp.model.UserLocation;
import com.google.gson.Gson;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

public final class MyCustomMethods {
    private MyCustomMethods() {

    }

    public static void closeTheKeyboard(@NonNull Activity parentActivity) {
        final View view = parentActivity.getCurrentFocus();

        if (view != null) {
            final InputMethodManager manager =
                    (InputMethodManager) parentActivity.getSystemService(Context.INPUT_METHOD_SERVICE);

            manager.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    public static boolean emailIsValid(@NonNull Activity parentActivity,
                                       String email) {
        if (email != null) {
            if (Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                return true;
            } else {
                MyCustomMethods.showShortMessage(parentActivity, "Email is not valid");
            }
        } else {
            MyCustomMethods.showShortMessage(parentActivity, "Email should not be empty");
        }

        return false;
    }

    public static MyCustomDate getBirthDateFromPIN(String pin) {
        if (pinIsValid(pin)) {
            final int yearFromPIN = Integer.parseInt(pin.charAt(0) == '1' || pin.charAt(0) == '2' ?
                    "19" + pin.substring(1, 3) : "20" + pin.substring(1, 3));
            final int monthFromPIN = Integer.parseInt(pin.substring(3, 5));
            final int dayFromPIN = Integer.parseInt(pin.substring(5, 7));
            final LocalDate birthDateAsLocalDate = LocalDate.of(yearFromPIN, monthFromPIN, dayFromPIN);

            return new MyCustomDate(birthDateAsLocalDate);
        }

        return null;
    }

    public static String getFormattedDate(final LocalDate date) {
        final String dayName = date.getDayOfWeek().name().charAt(0) +
                date.getDayOfWeek().name().substring(1).toLowerCase();

        final String monthName = String.valueOf(date.getMonth()).charAt(0) +
                String.valueOf(date.getMonth()).substring(1).toLowerCase();

        final int day = date.getDayOfMonth();

        final StringBuilder transactionDate = new StringBuilder(dayName)
                .append(", ")
                .append(monthName)
                .append(" ")
                .append(day);

        // displaying the year if it's not the current one
        if (date.getYear() != LocalDate.now().getYear()) {
            transactionDate.append(", ")
                    .append(date.getYear());
        }

        return String.valueOf(transactionDate);
    }

    public static String getFormattedTime(final Context context,
                                          final LocalTime time) {
        final String hour = time.getHour() < 10 ?
                "0" + time.getHour() : time.getHour() > 12 && !DateFormat.is24HourFormat(context) ?
                String.valueOf(time.getHour() - 12) : String.valueOf(time.getHour());

        final String minute = time.getMinute() < 10 ?
                "0" + time.getMinute() : String.valueOf(time.getMinute());

        final String second = time.getSecond() < 10 ?
                "0" + time.getSecond() : String.valueOf(time.getSecond());

        final StringBuilder transactionTime = new StringBuilder(hour)
                .append(":")
                .append(minute)
                .append(":")
                .append(second);

        // setting AM or PM if the time format is 12h
        if (!DateFormat.is24HourFormat(context)) {
            transactionTime.append(" ")
                    .append(time.getHour() < 12 ? "AM" : "PM");
        }

        return String.valueOf(transactionTime);
    }

    public static void goToActivityWithoutTransition(final @NonNull Activity currentActivity,
                                                     final @NonNull Class<? extends Activity> nextActivity) {
        currentActivity.startActivity(new Intent(currentActivity, nextActivity));
        currentActivity.finish();
    }

    public static boolean nameIsValid(String name) {
        if (name.length() < 2) {
            return false;
        } else for (final char character : name.toCharArray()) {
            // if the character is not a letter
            if (!Character.isLetter(character)) {
                return false;
            }
        }

        return true;
    }

    public static void openFileChooser(@NonNull Activity activity,
                                       final int REQUEST_ID) {
        final Intent intent = new Intent();

        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        activity.startActivityForResult(intent, REQUEST_ID);
    }

    public static boolean pinIsValid(String pin) {
        if (pin.length() != 13) {
            return false;
        } else if (pin.charAt(0) != '1' && pin.charAt(0) != '2' && pin.charAt(0) != '5' && pin.charAt(0) != '6') {
            return false;
        } else {
            final String year = pin.substring(1, 3);
            final String month = pin.substring(3, 5);
            final String day = pin.substring(5, 7);
            final int parsedYear = Integer.parseInt(pin.charAt(0) == '1' || pin.charAt(0) == '2' ? "19" + year : "20" + year);
            final int parsedMonth = Integer.parseInt(month);
            final int parsedDay = Integer.parseInt(day);

            final boolean monthIsValid = Integer.parseInt(month) >= 1 && Integer.parseInt(month) <= 12;
            final boolean dayIsValid31 = (Arrays.asList(1, 3, 5, 6, 7, 10, 12).contains(parsedMonth)) &&
                    (parsedDay >= 1 && parsedDay <= 31);
            final boolean dayIsValid30 = (Arrays.asList(4, 6, 9, 11).contains(parsedMonth)) &&
                    (parsedDay >= 1 && parsedDay <= 30);
            final boolean dayIsValidFebruary = (!yearIsLeap(parsedYear) && parsedDay >= 1 && parsedDay <= 28) ||
                    (yearIsLeap(parsedYear) && parsedDay >= 1 && parsedDay <= 29);
            final boolean dayIsValid = dayIsValid31 || dayIsValid30 || dayIsValidFebruary;

            return monthIsValid && dayIsValid;
        }
    }

    public static UserLocation retrieveLocationFromSharedPreferences(@NonNull Activity parentActivity,
                                                                     @NonNull String key) {
        SharedPreferences preferences =
                parentActivity.getSharedPreferences(MyCustomVariables.getSharedPreferencesAppData(), MODE_PRIVATE);
        Gson gson = new Gson();
        String json = preferences.getString(key, "");

        return gson.fromJson(json, UserLocation.class);
    }

    public static String retrieveRememberMeFromSharedPreferences(@NonNull Activity parentActivity,
                                                                 @NonNull String key) {
        SharedPreferences preferences =
                parentActivity.getSharedPreferences(MyCustomVariables.getSharedPreferencesAppData(), MODE_PRIVATE);
        Gson gson = new Gson();
        String json = preferences.getString(key, "");

        return gson.fromJson(json, String.class);
    }

    public static void saveLocationToSharedPreferences(@NonNull Activity parentActivity,
                                                       @NonNull UserLocation location,
                                                       @NonNull String key) {
        SharedPreferences preferences =
                parentActivity.getSharedPreferences(MyCustomVariables.getSharedPreferencesAppData(), MODE_PRIVATE);

        SharedPreferences.Editor editor = preferences.edit();
        Gson gson = new Gson();
        String json = gson.toJson(location);

        editor.putString(key, json);
        editor.apply();
    }

    public static void saveRememberMeToSharedPreferences(@NonNull Activity parentActivity,
                                                         boolean rememberMe,
                                                         @NonNull String key) {
        SharedPreferences preferences =
                parentActivity.getSharedPreferences(MyCustomVariables.getSharedPreferencesAppData(), MODE_PRIVATE);

        SharedPreferences.Editor editor = preferences.edit();
        Gson gson = new Gson();
        String json = gson.toJson(rememberMe);

        editor.putString(key, json);
        editor.apply();
    }

    public static void showShortMessage(final Context context, final String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    public static boolean yearIsLeap(int year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
}