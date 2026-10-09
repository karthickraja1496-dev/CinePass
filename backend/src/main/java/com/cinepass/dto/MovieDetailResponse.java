package com.cinepass.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MovieDetailResponse {
    private UUID id;
    private String title;
    private String genre;
    private Integer durationMins;
    private String rating;
    private String posterUrl;
    private String synopsis;
    private String castMembers;
    private LocalDateTime createdAt;
    private List<ShowtimeResponse> showtimes = new ArrayList<>();

    public MovieDetailResponse() {}

    public MovieDetailResponse(UUID id, String title, String genre, Integer durationMins, String rating,
                               String posterUrl, String synopsis, String castMembers, LocalDateTime createdAt,
                               List<ShowtimeResponse> showtimes) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.durationMins = durationMins;
        this.rating = rating;
        this.posterUrl = posterUrl;
        this.synopsis = synopsis;
        this.castMembers = castMembers;
        this.createdAt = createdAt;
        this.showtimes = showtimes != null ? showtimes : new ArrayList<>();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getDurationMins() {
        return durationMins;
    }

    public void setDurationMins(Integer durationMins) {
        this.durationMins = durationMins;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getCastMembers() {
        return castMembers;
    }

    public void setCastMembers(String castMembers) {
        this.castMembers = castMembers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ShowtimeResponse> getShowtimes() {
        return showtimes;
    }

    public void setShowtimes(List<ShowtimeResponse> showtimes) {
        this.showtimes = showtimes;
    }
}
