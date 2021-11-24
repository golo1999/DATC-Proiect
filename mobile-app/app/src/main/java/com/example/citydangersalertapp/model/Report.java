package com.example.citydangersalertapp.model;

import androidx.annotation.Nullable;

import java.time.LocalDateTime;
import java.util.UUID;

public class Report {
    private String reportId;
    private String userId;
    @Nullable
    private String note;
    @Nullable
    private String photoURL;
    private MyCustomTime customTime;
    private LocalDateTime dateTime;
    private int category;

    public Report() {
        // Required empty public constructor
    }

    public Report(String userId,
                  @Nullable String note,
                  @Nullable String photoURL,
                  LocalDateTime dateTime,
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
                  LocalDateTime dateTime,
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

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
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
                ", photoURL='" + photoURL + '\'' +
                ", dateTime=" + dateTime +
                ", category=" + category +
                '}';
    }
}