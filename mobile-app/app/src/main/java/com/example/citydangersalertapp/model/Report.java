package com.example.citydangersalertapp.model;

import androidx.annotation.Nullable;

import java.time.LocalDateTime;

public class Report {
    private String id;
    @Nullable
    private String note;
    @Nullable
    private String photoURL;
    private LocalDateTime dateTime;
    private int category;
}