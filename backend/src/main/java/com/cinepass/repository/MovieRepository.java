package com.cinepass.repository;

import com.cinepass.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {

    List<Movie> findByGenreIgnoreCase(String genre);

    @Query("SELECT m FROM Movie m WHERE " +
           "(:genre IS NULL OR LOWER(m.genre) = LOWER(:genre)) AND " +
           "(:query IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.castMembers) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Movie> searchMovies(@Param("genre") String genre, @Param("query") String query);
}
