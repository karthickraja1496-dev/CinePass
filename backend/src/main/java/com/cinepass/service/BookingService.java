package com.cinepass.service;

import com.cinepass.dto.BookingResponse;
import com.cinepass.dto.CreateBookingRequest;
import com.cinepass.entity.Booking;
import com.cinepass.entity.BookingSeat;
import com.cinepass.entity.Showtime;
import com.cinepass.entity.User;
import com.cinepass.exception.BadRequestException;
import com.cinepass.exception.ConflictException;
import com.cinepass.exception.ForbiddenException;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.repository.BookingRepository;
import com.cinepass.repository.BookingSeatRepository;
import com.cinepass.repository.ShowtimeRepository;
import com.cinepass.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final Pattern VALID_SEAT_PATTERN = Pattern.compile("^[A-E]([1-9]|10)$");

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          BookingSeatRepository bookingSeatRepository,
                          ShowtimeRepository showtimeRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showtimeRepository = showtimeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Showtime showtime = showtimeRepository.findByIdForUpdate(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + request.getShowtimeId()));

        List<String> rawSeats = request.getSeatCodes();
        if (rawSeats == null || rawSeats.isEmpty()) {
            throw new BadRequestException("At least 1 seat must be selected");
        }
        if (rawSeats.size() > 6) {
            throw new BadRequestException("Maximum 6 seats allowed per booking");
        }

        // Clean & uppercase seat codes, eliminate duplicates
        List<String> normalizedSeats = rawSeats.stream()
                .map(s -> s.trim().toUpperCase())
                .distinct()
                .collect(Collectors.toList());

        // Validate seat format (Rows A-E, 1-10)
        for (String seatCode : normalizedSeats) {
            if (!VALID_SEAT_PATTERN.matcher(seatCode).matches()) {
                throw new BadRequestException("Invalid seat code: " + seatCode + ". Valid seats are A1-A10 through E1-E10.");
            }
        }

        // Check for conflicting already booked seats
        List<String> conflictingSeats = bookingSeatRepository.findConflictingSeats(showtime.getId(), normalizedSeats);
        if (!conflictingSeats.isEmpty()) {
            throw new ConflictException("Seat(s) already booked: " + String.join(", ", conflictingSeats));
        }

        BigDecimal totalAmount = showtime.getTicketPrice().multiply(BigDecimal.valueOf(normalizedSeats.size()));

        Booking booking = new Booking(user, showtime, totalAmount, "CONFIRMED");
        Booking savedBooking = bookingRepository.save(booking);

        List<BookingSeat> seatEntities = new ArrayList<>();
        for (String seatCode : normalizedSeats) {
            BookingSeat seat = new BookingSeat(savedBooking, seatCode);
            seatEntities.add(seat);
        }
        bookingSeatRepository.saveAll(seatEntities);
        savedBooking.setSeats(seatEntities);

        return toResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(UUID id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new ForbiddenException("You are not authorized to view this booking");
        }

        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(UUID id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new ForbiddenException("You are not authorized to cancel this booking");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setBookingStatus("CANCELLED");
        Booking updated = bookingRepository.save(booking);

        return toResponse(updated);
    }

    public BookingResponse toResponse(Booking booking) {
        List<String> seatCodes = booking.getSeats() != null
                ? booking.getSeats().stream().map(BookingSeat::getSeatCode).sorted().collect(Collectors.toList())
                : Collections.emptyList();

        Showtime showtime = booking.getShowtime();

        return new BookingResponse(
                booking.getId(),
                showtime.getId(),
                showtime.getMovie().getId(),
                showtime.getMovie().getTitle(),
                showtime.getMovie().getPosterUrl(),
                showtime.getTheatreName(),
                showtime.getShowDate(),
                showtime.getShowTime(),
                showtime.getTicketPrice(),
                seatCodes,
                booking.getTotalAmount(),
                booking.getBookingStatus(),
                booking.getUser().getName(),
                booking.getUser().getEmail(),
                booking.getCreatedAt()
        );
    }
}
