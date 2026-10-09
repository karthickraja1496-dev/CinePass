package com.cinepass.service;

import com.cinepass.dto.MovieDetailResponse;
import com.cinepass.dto.MovieRequest;
import com.cinepass.dto.MovieResponse;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.exception.ResourceNotFoundException;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private ShowtimeRepository showtimeRepository;

    @InjectMocks
    private MovieService movieService;

    private Movie sampleMovie;
    private UUID movieId;

    @BeforeEach
    void setUp() {
        movieId = UUID.randomUUID();
        sampleMovie = new Movie("Interstellar", "Sci-Fi", 169, "U/A", "https://poster.jpg", "Synopsis", "Cast");
        sampleMovie.setId(movieId);
    }

    @Test
    @DisplayName("GetMovies - Return all movies when no filters")
    void getMovies_noFilters() {
        when(movieRepository.findAll()).thenReturn(List.of(sampleMovie));

        List<MovieResponse> result = movieService.getMovies(null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Interstellar", result.get(0).getTitle());
    }

    @Test
    @DisplayName("GetMovies - Search with genre and query")
    void getMovies_withFilter() {
        when(movieRepository.searchMovies("Sci-Fi", "Inter")).thenReturn(List.of(sampleMovie));

        List<MovieResponse> result = movieService.getMovies("Sci-Fi", "Inter");

        assertEquals(1, result.size());
        assertEquals("Interstellar", result.get(0).getTitle());
    }

    @Test
    @DisplayName("GetMovieDetail - Return movie with its showtimes")
    void getMovieDetail_success() {
        Showtime st = new Showtime(sampleMovie, "PVR", LocalDate.now(), LocalTime.of(18, 0), BigDecimal.valueOf(200));
        st.setId(UUID.randomUUID());

        when(movieRepository.findById(movieId)).thenReturn(Optional.of(sampleMovie));
        when(showtimeRepository.findByMovieIdOrderByShowDateAscShowTimeAsc(movieId)).thenReturn(List.of(st));

        MovieDetailResponse detail = movieService.getMovieDetail(movieId);

        assertNotNull(detail);
        assertEquals("Interstellar", detail.getTitle());
        assertEquals(1, detail.getShowtimes().size());
        assertEquals("PVR", detail.getShowtimes().get(0).getTheatreName());
    }

    @Test
    @DisplayName("GetMovieDetail - Throws when movie not found")
    void getMovieDetail_notFound() {
        when(movieRepository.findById(movieId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> movieService.getMovieDetail(movieId));
    }

    @Test
    @DisplayName("CreateMovie - Admin creates new movie successfully")
    void createMovie_success() {
        MovieRequest req = new MovieRequest("Avatar", "Sci-Fi", 162, "U/A", "https://avatar.jpg", "Pandora", "Sam Worthington");
        when(movieRepository.save(any(Movie.class))).thenReturn(sampleMovie);

        MovieResponse resp = movieService.createMovie(req);

        assertNotNull(resp);
        verify(movieRepository).save(any(Movie.class));
    }

    @Test
    @DisplayName("DeleteMovie - Deletes existing movie")
    void deleteMovie_success() {
        when(movieRepository.existsById(movieId)).thenReturn(true);

        movieService.deleteMovie(movieId);

        verify(movieRepository).deleteById(movieId);
    }
}
