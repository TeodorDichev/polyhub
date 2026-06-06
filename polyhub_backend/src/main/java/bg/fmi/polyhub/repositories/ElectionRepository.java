package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Election;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findAllByOrderByElectionDateDesc();

    List<Election> findByTypeName(String type);

    List<Election> findByElectionDateAfter(LocalDate date);
}
