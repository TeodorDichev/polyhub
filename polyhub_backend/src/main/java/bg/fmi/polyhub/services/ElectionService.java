package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.ElectionType;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.mappers.ElectionMapper;
import bg.fmi.polyhub.repositories.ElectionRepository;
import bg.fmi.polyhub.repositories.ElectionTypeRepository;
import bg.fmi.polyhub.repositories.PartyParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final ElectionTypeRepository electionTypeRepository;
    private final PartyParticipationRepository partyParticipationRepository;
    private final ElectionMapper electionMapper;

    public ElectionResponse create(CreateElectionRequest request) {
        ElectionType type = electionTypeRepository
                .findByName(request.type())
                .orElseThrow(() -> new RuntimeException("Election type not found"));

        if (request.electionDate().isBefore(LocalDate.now()) || request.electionDate().isEqual(LocalDate.now())) {
            throw new RuntimeException("Election cannot be scheduled for past dates/today");
        }

        Election election = electionMapper.toEntity(request);
        election.setType(type);

        return toResponse(electionRepository.save(election));
    }

    public List<ElectionResponse> getAll() {
        return electionRepository.findAllByOrderByElectionDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ElectionResponse update(Long id, CreateElectionRequest request) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        ElectionType type = electionTypeRepository
                .findByName(request.type())
                .orElseThrow(() -> new RuntimeException("Election type not found"));

        if (request.electionDate().isBefore(LocalDate.now()) || request.electionDate().isEqual(LocalDate.now())) {
            throw new RuntimeException("Election cannot be scheduled for past dates/today");
        }

        election.setName(request.name());
        election.setElectionDate(request.electionDate());
        election.setDescription(request.description());
        election.setType(type);

        return toResponse(electionRepository.save(election));
    }

    public void delete(Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        electionRepository.delete(election);
    }

    private ElectionResponse toResponse(Election election) {
        PartyParticipation winner = null;

        if (isFinished(election)) {
            winner = partyParticipationRepository
                    .findFirstByElection_IdAndVotePercentageIsNotNullOrderByVotePercentageDesc(election.getId())
                    .orElse(null);
        }

        return electionMapper.toResponse(
                election,
                getStatus(election),
                winner != null ? winner.getParty().getName() : null,
                winner != null ? winner.getVotePercentage() : null
        );
    }

    private String getStatus(Election election) {
        LocalDate today = LocalDate.now();

        if (election.getElectionDate().isBefore(today)) {
            return "FINISHED";
        }

        if (election.getElectionDate().isEqual(today)) {
            return "RUNNING";
        }

        return "UPCOMING";
    }

    private boolean isFinished(Election election) {
        return election.getElectionDate().isBefore(LocalDate.now());
    }
}