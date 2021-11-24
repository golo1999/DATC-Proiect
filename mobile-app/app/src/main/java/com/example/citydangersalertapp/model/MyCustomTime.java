package com.example.citydangersalertapp.model;

import java.time.LocalDateTime;

public class MyCustomTime {
    private int year;
    private int month;
    private String monthName;
    private int day;
    private String dayName;
    private int hour;
    private int minute;
    private int second;

    public MyCustomTime() {
        // Required empty public constructor
    }

    public MyCustomTime(int year,
                        int month,
                        String monthName,
                        int day,
                        String dayName,
                        int hour,
                        int minute,
                        int second) {
        this.year = year;
        this.month = month;
        this.monthName = monthName;
        this.day = day;
        this.dayName = dayName;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    public MyCustomTime(int year,
                        int month,
                        int day,
                        int hour,
                        int minute,
                        int second) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    public MyCustomTime(LocalDateTime localDateTime) {
        this.year = localDateTime.getYear();
        this.month = localDateTime.getMonthValue();
        this.monthName = String.valueOf(localDateTime.getMonth());
        this.day = localDateTime.getDayOfMonth();
        this.dayName = String.valueOf(localDateTime.getDayOfWeek());
        this.hour = localDateTime.getHour();
        this.minute = localDateTime.getMinute();
        this.second = localDateTime.getSecond();
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

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public int getSecond() {
        return second;
    }

    public void setSecond(int second) {
        this.second = second;
    }
}