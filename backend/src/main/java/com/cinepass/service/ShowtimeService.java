package com.cinepass.service;

import com.cinepass.dto.ShowtimeRequest;
import com.cinepass.dto.ShowtimeResponse;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.repository.BookingSeatRepository;
import com.cinepass.repository.MovieRepository;
import com.cinepass.repository.ShowtimeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public ShowtimeService(ShowtimeRepository showtimeRepository,
                           MovieRepository movieRepository,
                           BookingSeatRepository bookingSeatRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesForMovie(UUID movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("Movie not found with id: " + movieId);
        }
        return showtimeRepository.findByMovieIdOrderByShowDateAscShowTimeAsc(movieId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAllByOrderByShowDateAscShowTimeAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ShowtimeResponse getShowtimeById(UUID id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));
        return toResponse(showtime);
    }

    @Transactional(readOnly = true)
    public List<String> getBookedSeats(UUID showtimeId) {
        if (!showtimeRepository.existsById(showtimeId)) {
            throw new ResourceNotFoundException("Showtime not found with id: " + showtimeId);
        }
        return bookingSeatRepository.findBookedSeatCodesByShowtimeId(showtimeId);
    }

    @Transactional
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));

        Showtime showtime = new Showtime(
                movie,
                request.getTheatreName().trim(),
                request.getShowDate(),
                request.getShowTime(),
                request.getTicketPrice()
        );

        Showtime saved = showtimeRepository.save(showtime);
        return toResponse(saved);
    }

    @Transactional
    public ShowtimeResponse updateShowtime(UUID id, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));

        showtime.setMovie(movie);
        showtime.setTheatreName(request.getTheatreName().trim());
        showtime.setShowDate(request.getShowDate());
        showtime.setShowTime(request.getShowTime());
        showtime.setTicketPrice(request.getTicketPrice());

        return toResponse(showtimeRepository.save(showtime));
    }

    @Transactional
    public void deleteShowtime(UUID id) {
        if (!showtimeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Showtime not found with id: " + id);
        }
        showtimeRepository.deleteById(id);
    }

    public ShowtimeResponse toResponse(Showtime showtime) {
        return new ShowtimeResponse(
                showtime.getId(),
                showtime.getMovie().getId(),
                showtime.getMovie().getTitle(),
                showtime.getMovie().getPosterUrl(),
                showtime.getTheatreName(),
                showtime.getShowDate(),
                showtime.getShowTime(),
                showtime.getTicketPrice(),
                showtime.getCreatedAt()
        );
    }
}
