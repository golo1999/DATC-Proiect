package com.example.citydangersalertapp.model;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Objects;
import java.util.UUID;

public class Report implements Cloneable{
    private String reportId;
    private String userId;
    @Nullable
    private String note;
    private boolean checkStatus;
    @Nullable
    private String checkedBy;
    @Nullable
    private String photoURL;
    private MyCustomDateTime dateTime;
    private int category;
    private UserLocation location;

    public Report() {
        // Required empty public constructor
    }

    public Report(Report report) {

    }

    public Report(String userId,
                  @Nullable String note,
                  @Nullable String photoURL,
                  MyCustomDateTime dateTime,
                  int category,
                  UserLocation location) {
        this.reportId = String.valueOf(UUID.randomUUID());
        this.userId = userId;
        this.note = note;
        this.photoURL = photoURL;
        this.dateTime = dateTime;
        this.category = category;
        this.location = location;
    }

    public Report(String reportId,
                  String userId,
                  @Nullable String note,
                  boolean checkStatus,
                  @Nullable String photoURL,
                  MyCustomDateTime dateTime,
                  int category) {
        this.reportId = reportId;
        this.userId = userId;
        this.note = note;
        this.checkStatus = checkStatus;
        this.photoURL = photoURL;
        this.dateTime = dateTime;
        this.category = category;
    }

    public Report(String reportId,
                  String userId,
                  @Nullable String note,
                  boolean checkStatus,
                  MyCustomDateTime dateTime,
                  int category,
                  UserLocation location) {
        this.reportId = reportId;
        this.userId = userId;
        this.note = note;
        this.checkStatus = checkStatus;
        this.dateTime = dateTime;
        this.category = category;
        this.location = location;
    }

    public Report(String userId,
                  @Nullable String note,
                  MyCustomDateTime dateTime,
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

    public boolean isCheckStatus() {
        return checkStatus;
    }

    public void setCheckStatus(boolean checkStatus) {
        this.checkStatus = checkStatus;
    }

    @Nullable
    public String getCheckedBy() {
        return checkedBy;
    }

    public void setCheckedBy(@Nullable String checkedBy) {
        this.checkedBy = checkedBy;
    }

    @Nullable
    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(@Nullable String photoURL) {
        this.photoURL = photoURL;
    }

    public MyCustomDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(MyCustomDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public UserLocation getLocation() {
        return location;
    }

    public void setLocation(UserLocation location) {
        this.location = location;
    }

    @NonNull
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Report report = (Report) o;
        return checkStatus == report.checkStatus &&
                category == report.category &&
                reportId.equals(report.reportId) &&
                userId.equals(report.userId) &&
                Objects.equals(note, report.note) &&
                Objects.equals(checkedBy, report.checkedBy) &&
                Objects.equals(photoURL, report.photoURL) &&
                Objects.equals(dateTime, report.dateTime) &&
                Objects.equals(location, report.location);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reportId, userId, note, checkStatus, checkedBy, photoURL, dateTime, category, location);
    }

    @NonNull
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
                ", location=" + location +
                '}';
    }
}