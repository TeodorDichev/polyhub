package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    List<Program> findByPartyId(Long partyId);

    List<Program> findByElectionId(Long electionId);
}
