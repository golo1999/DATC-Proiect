package com.example.citydangersalertapp.model;

import androidx.annotation.Nullable;

import java.util.UUID;

public class Report {
    private String reportId;
    private String userId;
    @Nullable
    private String note;
    @Nullable
    private boolean checkStatus = false;
    private String photoURL;
    private MyCustomTime dateTime;
    private int category;

    public Report() {
        // Required empty public constructor
    }

    public Report(String userId,
                  @Nullable String note,
                  @Nullable String photoURL,
                  MyCustomTime dateTime,
                  int category) {
        this.reportId = String.valueOf(UUID.randomUUID());
        this.userId = userId;
        this.note = note;
        this.photoURL = photoURL;
        this.dateTime = dateTime;
        this.category = category;
    }

    public Report(String userId,
                  @Nullable String note,
                  MyCustomTime dateTime,
                  int category) {
        this.reportId = String.valueOf(UUID.randomUUID());
        this.userId = userId;
        this.note = note;
        this.dateTime = dateTime;
        this.category = category;
    }


    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Nullable
    public String getNote() {
        return note;
    }

    public void setNote(@Nullable String note) {
        this.note = note;
    }

    @Nullable
    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(@Nullable String photoURL) {
        this.photoURL = photoURL;
    }

    public MyCustomTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(MyCustomTime dateTime) {
        this.dateTime = dateTime;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }


    @Override
    public String toString() {
        return "Report{" +
                "reportId='" + reportId + '\'' +
                ", userId='" + userId + '\'' +
                ", note='" + note + '\'' +
                ", checkStatus=" + checkStatus +
                ", photoURL='" + photoURL + '\'' +
                ", dateTime=" + dateTime +
                ", category=" + category +
                '}';
    }
}