package com.cinepass.repository;

import com.cinepass.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, UUID> {

    @Query("SELECT bs.seatCode FROM BookingSeat bs " +
           "WHERE bs.booking.showtime.id = :showtimeId " +
           "AND bs.booking.bookingStatus = 'CONFIRMED'")
    List<String> findBookedSeatCodesByShowtimeId(@Param("showtimeId") UUID showtimeId);

    @Query("SELECT bs.seatCode FROM BookingSeat bs " +
           "WHERE bs.booking.showtime.id = :showtimeId " +
           "AND bs.booking.bookingStatus = 'CONFIRMED' " +
           "AND bs.seatCode IN :seatCodes")
    List<String> findConflictingSeats(@Param("showtimeId") UUID showtimeId, @Param("seatCodes") List<String> seatCodes);
}
