package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.ElectionType;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.ElectionMapper;
import bg.fmi.polyhub.mappers.PartyMapper;
import bg.fmi.polyhub.repositories.ElectionRepository;
import bg.fmi.polyhub.repositories.ElectionTypeRepository;
import bg.fmi.polyhub.repositories.PartyParticipationRepository;
import bg.fmi.polyhub.repositories.PartyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import bg.fmi.polyhub.dto.election.ElectionDetailsResponse;
import bg.fmi.polyhub.dto.election.ElectionPartyResultResponse;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.repositories.ProgramRepository;
import java.time.LocalDate;
import java.util.List;

import static bg.fmi.polyhub.utils.ElectionStatusUtils.getStatus;
import static bg.fmi.polyhub.utils.ElectionStatusUtils.isFinished;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final ElectionTypeRepository electionTypeRepository;
    private final PartyParticipationRepository partyParticipationRepository;
    private final ElectionMapper electionMapper;
    private final ProgramRepository programRepository;
    private final PartyRepository partyRepository;
    private final PartyMapper partyMapper;

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

    public List<PartyResponse> getPartiesForElection(Long id) {
        List<PartyParticipation> pp = partyParticipationRepository.findAllByElection_Id(id);

        return pp.stream().map(partyParticipation ->
            toPartyResponse(partyRepository.findById(partyParticipation.getId())
                    .orElseThrow())
        ).toList();
    }

    public ElectionDetailsResponse getById(Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        return toDetailsResponse(election);
    }

    private ElectionDetailsResponse toDetailsResponse(Election election) {
        PartyParticipation winner = null;

        if (isFinished(election)) {
            winner = partyParticipationRepository
                    .findWinnerByElectionId(election.getId())
                    .orElse(null);
        }

        List<ElectionPartyResultResponse> parties = partyParticipationRepository
                .findAllByElection_Id(election.getId())
                .stream()
                .filter(p -> {
                    User owner = p.getParty().getCreatedBy();
                    return owner.getDeletedAt() == null && owner.getSuspendedOn() == null;
                })
                .sorted(this::compareByVotePercentageDesc)
                .map(participation -> toPartyResultResponse(participation, election))
                .toList();

        return electionMapper.toDetailsResponse(
                election,
                getStatus(election),
                winner != null ? winner.getParty().getName() : null,
                winner != null ? winner.getVotePercentage() : null,
                parties
        );
    }

    private ElectionPartyResultResponse toPartyResultResponse(PartyParticipation participation, Election election) {
        Program program = programRepository
                .findByPartyAndElection(participation.getParty(), election)
                .orElse(null);

        return electionMapper.toPartyResultResponse(participation, program);
    }

    private int compareByVotePercentageDesc(PartyParticipation first, PartyParticipation second) {
        if (first.getVotePercentage() == null && second.getVotePercentage() == null) {
            return 0;
        }

        if (first.getVotePercentage() == null) {
            return 1;
        }

        if (second.getVotePercentage() == null) {
            return -1;
        }

        return second.getVotePercentage().compareTo(first.getVotePercentage());
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

    private PartyResponse toPartyResponse(Party party) {
        PartyResponse dto;
        return partyMapper.toResponse(party);
    }
}