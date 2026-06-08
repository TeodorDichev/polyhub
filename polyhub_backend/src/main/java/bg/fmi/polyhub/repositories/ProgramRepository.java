package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    List<Program> findByPartyId(Long partyId);

    List<Program> findByElectionId(Long electionId);

    Optional<Program> findByPartyAndElection(Party party, Election election);

    List<Program> findAllByPartyOrderByCreatedAtDesc(Party party);
}
