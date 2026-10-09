package com.cinepass.service;

import com.cinepass.dto.ShowtimeRequest;
import com.cinepass.dto.ShowtimeResponse;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.repository.BookingSeatRepository;
import com.cinepass.repository.MovieRepository;
import com.cinepass.repository.ShowtimeRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShowtimeServiceTest {

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private BookingSeatRepository bookingSeatRepository;

    @InjectMocks
    private ShowtimeService showtimeService;

    private Movie sampleMovie;
    private Showtime sampleShowtime;
    private UUID movieId;
    private UUID showtimeId;

    @BeforeEach
    void setUp() {
        movieId = UUID.randomUUID();
        showtimeId = UUID.randomUUID();

        sampleMovie = new Movie("Interstellar", "Sci-Fi", 169, "U/A", "poster", "synopsis", "cast");
        sampleMovie.setId(movieId);

        sampleShowtime = new Showtime(sampleMovie, "PVR Cinemas", LocalDate.now(), LocalTime.of(18, 30), BigDecimal.valueOf(250));
        sampleShowtime.setId(showtimeId);
    }

    @Test
    @DisplayName("GetShowtimesForMovie - Returns showtime list")
    void getShowtimesForMovie_success() {
        when(movieRepository.existsById(movieId)).thenReturn(true);
        when(showtimeRepository.findByMovieIdOrderByShowDateAscShowTimeAsc(movieId)).thenReturn(List.of(sampleShowtime));

        List<ShowtimeResponse> result = showtimeService.getShowtimesForMovie(movieId);

        assertEquals(1, result.size());
        assertEquals("PVR Cinemas", result.get(0).getTheatreName());
    }

    @Test
    @DisplayName("GetBookedSeats - Returns booked seat codes array")
    void getBookedSeats_success() {
        when(showtimeRepository.existsById(showtimeId)).thenReturn(true);
        when(bookingSeatRepository.findBookedSeatCodesByShowtimeId(showtimeId)).thenReturn(List.of("A1", "A2", "B5"));

        List<String> seats = showtimeService.getBookedSeats(showtimeId);

        assertEquals(3, seats.size());
        assertTrue(seats.contains("A1"));
        assertTrue(seats.contains("B5"));
    }

    @Test
    @DisplayName("CreateShowtime - Admin creates showtime successfully")
    void createShowtime_success() {
        ShowtimeRequest req = new ShowtimeRequest(movieId, "INOX", LocalDate.now(), LocalTime.of(15, 0), BigDecimal.valueOf(200));

        when(movieRepository.findById(movieId)).thenReturn(Optional.of(sampleMovie));
        when(showtimeRepository.save(any(Showtime.class))).thenReturn(sampleShowtime);

        ShowtimeResponse resp = showtimeService.createShowtime(req);

        assertNotNull(resp);
        assertEquals("PVR Cinemas", resp.getTheatreName());
        verify(showtimeRepository).save(any(Showtime.class));
    }

    @Test
    @DisplayName("UpdateShowtime - Updates showtime details")
    void updateShowtime_success() {
        ShowtimeRequest req = new ShowtimeRequest(movieId, "INOX", LocalDate.now().plusDays(1),
                LocalTime.of(15, 0), BigDecimal.valueOf(200));

        when(showtimeRepository.findById(showtimeId)).thenReturn(Optional.of(sampleShowtime));
        when(movieRepository.findById(movieId)).thenReturn(Optional.of(sampleMovie));
        when(showtimeRepository.save(any(Showtime.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ShowtimeResponse response = showtimeService.updateShowtime(showtimeId, req);

        assertEquals("INOX", response.getTheatreName());
        assertEquals(LocalDate.now().plusDays(1), response.getShowDate());
        assertEquals(BigDecimal.valueOf(200), response.getTicketPrice());
    }

    @Test
    @DisplayName("DeleteShowtime - Deletes showtime when found")
    void deleteShowtime_success() {
        when(showtimeRepository.existsById(showtimeId)).thenReturn(true);

        showtimeService.deleteShowtime(showtimeId);

        verify(showtimeRepository).deleteById(showtimeId);
    }
}
