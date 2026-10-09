package com.cinepass.controller;

import com.cinepass.dto.BookingResponse;
import com.cinepass.dto.CreateBookingRequest;
import com.cinepass.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookings", description = "Ticket booking and reservations management")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new booking and reserve seats (1-6 seats)")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse response = bookingService.createBooking(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/mine")
    @Operation(summary = "Get list of all bookings for currently logged-in user")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = bookingService.getMyBookings(userDetails.getUsername());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking detail by ID")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse booking = bookingService.getBookingById(id, userDetails.getUsername());
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a booking and release its seats")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse cancelledBooking = bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(cancelledBooking);
    }
}
