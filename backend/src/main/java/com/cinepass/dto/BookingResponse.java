package com.cinepass.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public class BookingResponse {
    private UUID id;
    private UUID showtimeId;
    private UUID movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private String theatreName;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal ticketPrice;
    private List<String> seatCodes;
    private int seatCount;
    private BigDecimal totalAmount;
    private String bookingStatus;
    private String userName;
    private String userEmail;
    private LocalDateTime createdAt;

    public BookingResponse() {}

    public BookingResponse(UUID id, UUID showtimeId, UUID movieId, String movieTitle, String moviePosterUrl,
                           String theatreName, LocalDate showDate, LocalTime showTime, BigDecimal ticketPrice,
                           List<String> seatCodes, BigDecimal totalAmount, String bookingStatus,
                           String userName, String userEmail, LocalDateTime createdAt) {
        this.id = id;
        this.showtimeId = showtimeId;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.moviePosterUrl = moviePosterUrl;
        this.theatreName = theatreName;
        this.showDate = showDate;
        this.showTime = showTime;
        this.ticketPrice = ticketPrice;
        this.seatCodes = seatCodes;
        this.seatCount = seatCodes != null ? seatCodes.size() : 0;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.userName = userName;
        this.userEmail = userEmail;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(UUID showtimeId) {
        this.showtimeId = showtimeId;
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

    public List<String> getSeatCodes() {
        return seatCodes;
    }

    public void setSeatCodes(List<String> seatCodes) {
        this.seatCodes = seatCodes;
        this.seatCount = seatCodes != null ? seatCodes.size() : 0;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(int seatCount) {
        this.seatCount = seatCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
