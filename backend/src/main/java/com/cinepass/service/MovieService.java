package com.cinepass.service;

import com.cinepass.dto.MovieDetailResponse;
import com.cinepass.dto.MovieRequest;
import com.cinepass.dto.MovieResponse;
import com.cinepass.dto.ShowtimeResponse;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.repository.MovieRepository;
import com.cinepass.repository.ShowtimeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;

    public MovieService(MovieRepository movieRepository, ShowtimeRepository showtimeRepository) {
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getMovies(String genre, String search) {
        String cleanGenre = (genre != null && !genre.isBlank() && !genre.equalsIgnoreCase("All")) ? genre.trim() : null;
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        List<Movie> movies;
        if (cleanGenre != null || cleanSearch != null) {
            movies = movieRepository.searchMovies(cleanGenre, cleanSearch);
        } else {
            movies = movieRepository.findAll();
        }

        return movies.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MovieDetailResponse getMovieDetail(UUID id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        List<Showtime> showtimes = showtimeRepository.findByMovieIdOrderByShowDateAscShowTimeAsc(id);
        List<ShowtimeResponse> showtimeResponses = showtimes.stream()
                .map(this::toShowtimeResponse)
                .collect(Collectors.toList());

        return new MovieDetailResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getGenre(),
                movie.getDurationMins(),
                movie.getRating(),
                movie.getPosterUrl(),
                movie.getSynopsis(),
                movie.getCastMembers(),
                movie.getCreatedAt(),
                showtimeResponses
        );
    }

    @Transactional
    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = new Movie(
                request.getTitle().trim(),
                request.getGenre().trim(),
                request.getDurationMins(),
                request.getRating().trim(),
                request.getPosterUrl() != null ? request.getPosterUrl().trim() : null,
                request.getSynopsis() != null ? request.getSynopsis().trim() : null,
                request.getCastMembers() != null ? request.getCastMembers().trim() : null
        );

        Movie saved = movieRepository.save(movie);
        return toResponse(saved);
    }

    @Transactional
    public MovieResponse updateMovie(UUID id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        movie.setTitle(request.getTitle().trim());
        movie.setGenre(request.getGenre().trim());
        movie.setDurationMins(request.getDurationMins());
        movie.setRating(request.getRating().trim());
        movie.setPosterUrl(request.getPosterUrl() != null ? request.getPosterUrl().trim() : null);
        movie.setSynopsis(request.getSynopsis() != null ? request.getSynopsis().trim() : null);
        movie.setCastMembers(request.getCastMembers() != null ? request.getCastMembers().trim() : null);

        Movie updated = movieRepository.save(movie);
        return toResponse(updated);
    }

    @Transactional
    public void deleteMovie(UUID id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie not found with id: " + id);
        }
        movieRepository.deleteById(id);
    }

    public MovieResponse toResponse(Movie movie) {
        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getGenre(),
                movie.getDurationMins(),
                movie.getRating(),
                movie.getPosterUrl(),
                movie.getSynopsis(),
                movie.getCastMembers(),
                movie.getCreatedAt()
        );
    }

    public ShowtimeResponse toShowtimeResponse(Showtime showtime) {
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
