package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.PartyParticipation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartyParticipationRepository extends JpaRepository<PartyParticipation, Long> {

    Optional<PartyParticipation> findFirstByElection_IdAndVotePercentageIsNotNullOrderByVotePercentageDesc(Long electionId);
}