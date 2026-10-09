package com.cinepass.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public class ShowtimeResponse {
    private UUID id;
    private UUID movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private String theatreName;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal ticketPrice;
    private LocalDateTime createdAt;

    public ShowtimeResponse() {}

    public ShowtimeResponse(UUID id, UUID movieId, String movieTitle, String moviePosterUrl,
                            String theatreName, LocalDate showDate, LocalTime showTime,
                            BigDecimal ticketPrice, LocalDateTime createdAt) {
        this.id = id;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.moviePosterUrl = moviePosterUrl;
        this.theatreName = theatreName;
        this.showDate = showDate;
        this.showTime = showTime;
        this.ticketPrice = ticketPrice;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getMovieId() {
        return movieId;
    }

    public void setMovieId(UUID movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getMoviePosterUrl() {
        return moviePosterUrl;
    }

    public void setMoviePosterUrl(String moviePosterUrl) {
        this.moviePosterUrl = moviePosterUrl;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public void setShowDate(LocalDate showDate) {
        this.showDate = showDate;
    }

    public LocalTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalTime showTime) {
        this.showTime = showTime;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
