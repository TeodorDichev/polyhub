package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.ElectionType;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.ElectionMapper;
import bg.fmi.polyhub.repositories.ElectionRepository;
import bg.fmi.polyhub.repositories.ElectionTypeRepository;
import bg.fmi.polyhub.repositories.PartyParticipationRepository;
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
import bg.fmi.polyhub.dto.election.ElectionPageResponse;
import bg.fmi.polyhub.dto.specialist.ElectionResultsRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final ElectionTypeRepository electionTypeRepository;
    private final PartyParticipationRepository partyParticipationRepository;
    private final ElectionMapper electionMapper;
    private final ProgramRepository programRepository;

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

    public ElectionPageResponse getAllPaged(int page, int size, String search) {
        int safePage = Math.max(page, 0);
        int safeSize = normalizePageSize(size);
        Pageable pageable = PageRequest.of(safePage, safeSize);
        String normalizedSearch = search == null ? "" : search.trim();

        Page<Election> electionsPage = normalizedSearch.isBlank()
                ? electionRepository.findAllByOrderByElectionDateDesc(pageable)
                : electionRepository.findAllByNameContainingIgnoreCaseOrderByElectionDateDesc(normalizedSearch, pageable);

        return new ElectionPageResponse(
                electionsPage.getContent().stream().map(this::toResponse).toList(),
                electionsPage.getNumber(),
                electionsPage.getSize(),
                electionsPage.getTotalElements(),
                electionsPage.getTotalPages(),
                electionsPage.isFirst(),
                electionsPage.isLast()
        );
    }

    public ElectionPageResponse getPublicElectionsPage(
            String search,
            int page,
            int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = normalizePageSize(size);

        Pageable pageable = PageRequest.of(safePage, safeSize);

        String normalizedSearch = search == null ? "" : search.trim();

        Page<Election> electionsPage;

        if (normalizedSearch.isBlank()) {
            electionsPage = electionRepository.findAllByOrderByElectionDateDesc(pageable);
        } else {
            electionsPage = electionRepository.findAllByNameContainingIgnoreCaseOrderByElectionDateDesc(
                    normalizedSearch,
                    pageable
            );
        }

        return new ElectionPageResponse(
                electionsPage.getContent()
                        .stream()
                        .map(this::toResponse)
                        .toList(),
                electionsPage.getNumber(),
                electionsPage.getSize(),
                electionsPage.getTotalElements(),
                electionsPage.getTotalPages(),
                electionsPage.isFirst(),
                electionsPage.isLast()
        );
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

    public void setResults(Long electionId, ElectionResultsRequest request) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        LocalDate dayAfter = election.getElectionDate().plusDays(1);
        if (!dayAfter.isEqual(LocalDate.now())) {
            throw new RuntimeException("Results can only be set on the day after the election");
        }

        request.results().forEach(entry -> {
            PartyParticipation participation = partyParticipationRepository
                    .findByElection_IdAndParty_Id(electionId, entry.partyId())
                    .orElseThrow(() -> new RuntimeException("Party not participating in this election"));
            participation.setVotesCount(entry.votesCount());
            participation.setVotePercentage(entry.votePercentage());
            partyParticipationRepository.save(participation);
        });
    }

    private int normalizePageSize(int size) {
        if (size == 10 || size == 15) {
            return size;
        }

        return 5;
    }

}