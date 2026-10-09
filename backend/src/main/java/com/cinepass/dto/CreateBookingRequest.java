package com.cinepass.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public class CreateBookingRequest {

    @NotNull(message = "Showtime ID is required")
    private UUID showtimeId;

    @NotEmpty(message = "Seat codes cannot be empty")
    @Size(min = 1, max = 6, message = "You can book between 1 and 6 seats")
    private List<String> seatCodes;

    public CreateBookingRequest() {}

    public CreateBookingRequest(UUID showtimeId, List<String> seatCodes) {
        this.showtimeId = showtimeId;
        this.seatCodes = seatCodes;
    }

    public UUID getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(UUID showtimeId) {
        this.showtimeId = showtimeId;
    }

    public List<String> getSeatCodes() {
        return seatCodes;
    }

    public void setSeatCodes(List<String> seatCodes) {
        this.seatCodes = seatCodes;
    }
}
