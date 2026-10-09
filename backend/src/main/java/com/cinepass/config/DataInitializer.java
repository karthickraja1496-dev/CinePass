package com.cinepass.config;

import com.cinepass.entity.*;
import com.cinepass.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MovieRepository movieRepository,
                           ShowtimeRepository showtimeRepository,
                           BookingRepository bookingRepository,
                           BookingSeatRepository bookingSeatRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Seed Users
        User admin = new User(
                "admin@cinepass.com",
                passwordEncoder.encode("admin123"),
                "Admin User",
                true
        );
        userRepository.save(admin);

        User regularUser = new User(
                "user@cinepass.com",
                passwordEncoder.encode("user123"),
                "John Doe",
                false
        );
        userRepository.save(regularUser);

        // 2. Seed Movies (6 high quality movies)
        Movie m1 = new Movie(
                "Interstellar",
                "Sci-Fi",
                169,
                "U/A",
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
                "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces ecological collapse.",
                "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine"
        );

        Movie m2 = new Movie(
                "The Lion King",
                "Animation",
                118,
                "U",
                "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80",
                "A young lion prince flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.",
                "Donald Glover, Beyoncé, Seth Rogen, Chiwetel Ejiofor"
        );

        Movie m3 = new Movie(
                "The Dark Knight",
                "Action",
                152,
                "U/A",
                "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
                "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine"
        );

        Movie m4 = new Movie(
                "Inception",
                "Sci-Fi",
                148,
                "U/A",
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy"
        );

        Movie m5 = new Movie(
                "Oppenheimer",
                "Biography",
                180,
                "A",
                "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
                "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
                "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr."
        );

        Movie m6 = new Movie(
                "Spider-Man: Across the Spider-Verse",
                "Animation",
                140,
                "U",
                "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
                "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
                "Shameik Moore, Hailee Steinfeld, Oscar Isaac, Daniel Kaluuya"
        );

        movieRepository.saveAll(List.of(m1, m2, m3, m4, m5, m6));

        // 3. Seed Showtimes
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate dayAfter = today.plusDays(2);

        Showtime s1 = new Showtime(m1, "PVR Cinemas IMAX, Forum Mall", today, LocalTime.of(18, 30), new BigDecimal("250.00"));
        Showtime s2 = new Showtime(m1, "INOX Multiplex, Phoenix Marketcity", tomorrow, LocalTime.of(21, 0), new BigDecimal("220.00"));
        Showtime s3 = new Showtime(m2, "INOX Multiplex, Phoenix Marketcity", today, LocalTime.of(15, 0), new BigDecimal("200.00"));
        Showtime s4 = new Showtime(m2, "Cinepolis Grand, Nexus Mall", tomorrow, LocalTime.of(11, 30), new BigDecimal("180.00"));
        Showtime s5 = new Showtime(m3, "PVR Cinemas IMAX, Forum Mall", today, LocalTime.of(19, 45), new BigDecimal("260.00"));
        Showtime s6 = new Showtime(m3, "Cinepolis Grand, Nexus Mall", dayAfter, LocalTime.of(22, 15), new BigDecimal("240.00"));
        Showtime s7 = new Showtime(m4, "INOX Multiplex, Phoenix Marketcity", tomorrow, LocalTime.of(17, 15), new BigDecimal("210.00"));
        Showtime s8 = new Showtime(m5, "PVR Cinemas IMAX, Forum Mall", today, LocalTime.of(20, 0), new BigDecimal("280.00"));
        Showtime s9 = new Showtime(m6, "Cinepolis Grand, Nexus Mall", today, LocalTime.of(14, 0), new BigDecimal("200.00"));

        showtimeRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8, s9));

        // 4. Seed initial bookings for s1 so some seats are red/booked
        Booking b1 = new Booking(regularUser, s1, new BigDecimal("500.00"), "CONFIRMED");
        bookingRepository.save(b1);

        BookingSeat seat1 = new BookingSeat(b1, "C4");
        BookingSeat seat2 = new BookingSeat(b1, "C5");
        bookingSeatRepository.saveAll(List.of(seat1, seat2));
        b1.setSeats(List.of(seat1, seat2));

        Booking b2 = new Booking(regularUser, s3, new BigDecimal("400.00"), "CONFIRMED");
        bookingRepository.save(b2);

        BookingSeat seat3 = new BookingSeat(b2, "B7");
        BookingSeat seat4 = new BookingSeat(b2, "B8");
        bookingSeatRepository.saveAll(List.of(seat3, seat4));
        b2.setSeats(List.of(seat3, seat4));
    }
}
