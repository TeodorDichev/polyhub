package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyParticipation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartyParticipationRepository extends JpaRepository<PartyParticipation, Long> {

    Optional<PartyParticipation> findFirstByElection_IdAndVotePercentageIsNotNullOrderByVotePercentageDesc(Long electionId);
    List<PartyParticipation> findAllByElection_Id(Long electionId);
    List<PartyParticipation> findAllByParty_Id(Long partyId);

    Optional<PartyParticipation> findTopByElectionOrderByVotePercentageDesc(Election election);
    default Optional<PartyParticipation> findWinnerByElectionId(Long electionId) {
        return findFirstByElection_IdAndVotePercentageIsNotNullOrderByVotePercentageDesc(electionId);
    }

    boolean existsByPartyAndElection(Party party, Election election);

    Optional<PartyParticipation> findByElection_IdAndParty_Id(Long electionId, Long partyId);
}