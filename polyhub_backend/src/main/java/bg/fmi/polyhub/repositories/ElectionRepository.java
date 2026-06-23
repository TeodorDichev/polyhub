package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Election;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findAllByOrderByElectionDateDesc();

    List<Election> findByTypeName(String type);

    List<Election> findByElectionDateAfter(LocalDate date);

    Page<Election> findAllByOrderByElectionDateDesc(Pageable pageable);

    Page<Election> findAllByNameContainingIgnoreCaseOrderByElectionDateDesc(
            String name,
            Pageable pageable
    );
}
