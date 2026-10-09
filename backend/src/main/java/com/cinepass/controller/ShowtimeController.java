package com.cinepass.controller;

import com.cinepass.dto.ShowtimeRequest;
import com.cinepass.dto.ShowtimeResponse;
import com.cinepass.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Showtimes", description = "Showtime scheduling and seat availability endpoints")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping("/api/movies/{id}/showtimes")
    @Operation(summary = "Get all showtimes for a specific movie")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByMovie(@PathVariable("id") UUID movieId) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimesForMovie(movieId);
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/api/showtimes")
    @Operation(summary = "Get all available showtimes")
    public ResponseEntity<List<ShowtimeResponse>> getAllShowtimes() {
        List<ShowtimeResponse> showtimes = showtimeService.getAllShowtimes();
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/api/showtimes/{id}")
    @Operation(summary = "Get showtime details by ID")
    public ResponseEntity<ShowtimeResponse> getShowtimeById(@PathVariable UUID id) {
        ShowtimeResponse showtime = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(showtime);
    }

    @GetMapping("/api/showtimes/{id}/seats")
    @Operation(summary = "Get list of already booked seat codes for a showtime")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable UUID id) {
        List<String> bookedSeats = showtimeService.getBookedSeats(id);
        return ResponseEntity.ok(bookedSeats);
    }

    @PostMapping("/api/showtimes")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new showtime (Admin only)")
    public ResponseEntity<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        ShowtimeResponse response = showtimeService.createShowtime(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/api/showtimes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing showtime (Admin only)")
    public ResponseEntity<ShowtimeResponse> updateShowtime(
            @PathVariable UUID id,
            @Valid @RequestBody ShowtimeRequest request) {
        ShowtimeResponse response = showtimeService.updateShowtime(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/showtimes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a showtime (Admin only)")
    public ResponseEntity<Void> deleteShowtime(@PathVariable UUID id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}
