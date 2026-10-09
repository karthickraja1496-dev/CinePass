package com.cinepass.service;

import com.cinepass.dto.BookingResponse;
import com.cinepass.dto.CreateBookingRequest;
import com.cinepass.entity.Booking;
import com.cinepass.entity.BookingSeat;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.entity.User;
import com.cinepass.exception.BadRequestException;
import com.cinepass.exception.ConflictException;
import com.cinepass.repository.BookingRepository;
import com.cinepass.repository.BookingSeatRepository;
import com.cinepass.repository.ShowtimeRepository;
import com.cinepass.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingSeatRepository bookingSeatRepository;

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private User sampleUser;
    private Movie sampleMovie;
    private Showtime sampleShowtime;
    private UUID showtimeId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        showtimeId = UUID.randomUUID();

        sampleUser = new User("user@test.com", "pass", "John", false);
        sampleUser.setId(userId);

        sampleMovie = new Movie("Inception", "Sci-Fi", 148, "U/A", "poster", "synopsis", "cast");
        sampleMovie.setId(UUID.randomUUID());

        sampleShowtime = new Showtime(sampleMovie, "PVR", LocalDate.now(), LocalTime.of(19, 0), BigDecimal.valueOf(250));
        sampleShowtime.setId(showtimeId);
    }

    @Test
    @DisplayName("CreateBooking - Success when seats are available")
    void createBooking_success() {
        CreateBookingRequest req = new CreateBookingRequest(showtimeId, List.of("A1", "A2"));

        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(sampleUser));
        when(showtimeRepository.findByIdForUpdate(showtimeId)).thenReturn(Optional.of(sampleShowtime));
        when(bookingSeatRepository.findConflictingSeats(showtimeId, List.of("A1", "A2"))).thenReturn(Collections.emptyList());

        Booking mockBooking = new Booking(sampleUser, sampleShowtime, BigDecimal.valueOf(500), "CONFIRMED");
        mockBooking.setId(UUID.randomUUID());
        when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);

        BookingResponse response = bookingService.createBooking("user@test.com", req);

        assertNotNull(response);
        assertEquals("CONFIRMED", response.getBookingStatus());
        assertEquals(2, response.getSeatCount());
        assertEquals(BigDecimal.valueOf(500), response.getTotalAmount());
        verify(bookingSeatRepository).saveAll(anyList());
        verify(showtimeRepository).findByIdForUpdate(showtimeId);
    }

    @Test
    @DisplayName("CreateBooking - Throws ConflictException when seat is already booked")
    void createBooking_conflict() {
        CreateBookingRequest req = new CreateBookingRequest(showtimeId, List.of("A1", "A2"));

        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(sampleUser));
        when(showtimeRepository.findByIdForUpdate(showtimeId)).thenReturn(Optional.of(sampleShowtime));
        when(bookingSeatRepository.findConflictingSeats(showtimeId, List.of("A1", "A2"))).thenReturn(List.of("A1"));

        assertThrows(ConflictException.class, () -> bookingService.createBooking("user@test.com", req));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("CreateBooking - Throws BadRequestException when exceeding 6 seats")
    void createBooking_exceedSeatLimit() {
        CreateBookingRequest req = new CreateBookingRequest(showtimeId, List.of("A1", "A2", "A3", "A4", "A5", "A6", "A7"));

        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(sampleUser));
        when(showtimeRepository.findByIdForUpdate(showtimeId)).thenReturn(Optional.of(sampleShowtime));

        assertThrows(BadRequestException.class, () -> bookingService.createBooking("user@test.com", req));
    }

    @Test
    @DisplayName("CancelBooking - Cancels confirmed booking and updates status")
    void cancelBooking_success() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = new Booking(sampleUser, sampleShowtime, BigDecimal.valueOf(250), "CONFIRMED");
        booking.setId(bookingId);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(sampleUser));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        BookingResponse resp = bookingService.cancelBooking(bookingId, "user@test.com");

        assertNotNull(resp);
        assertEquals("CANCELLED", resp.getBookingStatus());
    }
}
