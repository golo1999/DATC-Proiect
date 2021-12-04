package com.example.citydangersalertapp.model;

import androidx.annotation.NonNull;

import java.time.LocalDate;
import java.util.Objects;

public class MyCustomDate {
    private int year;
    private int month;
    private String monthName;
    private int day;
    private String dayName;

    public MyCustomDate() {
        // Required empty public constructor
    }

    public MyCustomDate(int year,
                        int month,
                        String monthName,
                        int day,
                        String dayName) {
        this.year = year;
        this.month = month;
        this.monthName = monthName;
        this.day = day;
        this.dayName = dayName;
    }

    public MyCustomDate(int year,
                        int month,
                        int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public MyCustomDate(LocalDate localDate) {
        this.year = localDate.getYear();
        this.month = localDate.getMonthValue();
        this.monthName = String.valueOf(localDate.getMonth());
        this.day = localDate.getDayOfMonth();
        this.dayName = String.valueOf(localDate.getDayOfWeek());
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MyCustomDate that = (MyCustomDate) o;
        return year == that.year && month == that.month && day == that.day && monthName.equals(that.monthName) && dayName.equals(that.dayName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(year, month, monthName, day, dayName);
    }

    @NonNull
    @Override
    public String toString() {
        return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year;
    }
}