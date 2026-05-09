package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Party;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartyRepository extends JpaRepository<Party, Long> {

    List<Party> findByStatusName(String status);

    List<Party> findByName(String party);

    boolean existsByName(String name);
}
