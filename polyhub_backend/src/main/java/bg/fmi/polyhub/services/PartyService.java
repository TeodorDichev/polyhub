package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyStatus;
import bg.fmi.polyhub.entities.PartyStatusType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.PartyMapper;
import bg.fmi.polyhub.repositories.PartyRepository;
import bg.fmi.polyhub.repositories.PartyStatusRepository;
import bg.fmi.polyhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import bg.fmi.polyhub.dto.party.PartyDetailsResponse;
import bg.fmi.polyhub.dto.party.PartyElectionParticipationResponse;
import bg.fmi.polyhub.dto.party.PartyProgramSummaryResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.repositories.PartyParticipationRepository;
import bg.fmi.polyhub.repositories.ProgramRepository;

import java.util.List;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PartyService {

    private final PartyRepository partyRepository;
    private final PartyStatusRepository partyStatusRepository;
    private final UserRepository userRepository;
    private final PartyMapper partyMapper;
    private final ProgramRepository programRepository;
    private final PartyParticipationRepository partyParticipationRepository;

    public PartyResponse submit(SubmitPartyRequest request, String email) {
        User user = getActiveUser(email);

        if (user.getSuspendedOn() != null) { // could be moved on login ?
            throw new RuntimeException("Your account has been suspended");
        }

        partyRepository.findByCreatedByAndDeletedAtIsNull(user).ifPresent(existing -> {
            PartyStatusType status = existing.getStatus().getName();
            if (status == PartyStatusType.PENDING || status == PartyStatusType.APPROVED) {
                throw new RuntimeException("You already have an active or pending party");
            }
        });

        if (partyRepository.existsByNameAndDeletedAtIsNull(request.name())) {
            throw new RuntimeException("Party name already exists");
        }

        if (request.foundedOn().isAfter(LocalDate.now())) {
            throw new RuntimeException("Party cannot be created on this date");
        }

        PartyStatus pendingStatus = partyStatusRepository
                .findByName(PartyStatusType.PENDING)
                .orElseThrow(() -> new RuntimeException("Status PENDING not found"));

        Party party = partyMapper.toEntity(request);
        party.setStatus(pendingStatus);
        party.setCreatedBy(user);

        return partyMapper.toResponse(partyRepository.save(party));
    }

    public PartyResponse resubmit(SubmitPartyRequest request, String email) {
        User user = getActiveUser(email);

        if (user.getSuspendedOn() != null) {
            throw new RuntimeException("Your account has been suspended");
        }

        Party existing = partyRepository
                .findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found to resubmit"));

        if (existing.getStatus().getName() != PartyStatusType.REJECTED) {
            throw new RuntimeException("Only rejected parties can be resubmitted");
        }

        if (request.foundedOn().isAfter(LocalDate.now())) {
            throw new RuntimeException("Party cannot be created on this date");
        }

        PartyStatus pendingStatus = partyStatusRepository
                .findByName(PartyStatusType.PENDING)
                .orElseThrow(() -> new RuntimeException("Status PENDING not found"));

        existing.setName(request.name());
        existing.setDescription(request.description());
        existing.setMotto(request.motto());
        existing.setLogoUrl(request.logoUrl());
        existing.setFoundedOn(request.foundedOn());
        existing.setStatus(pendingStatus);
        existing.setRejectionComment(null);

        return partyMapper.toResponse(partyRepository.save(existing));
    }

    public PartyResponse getMyParty(String email) {
        User user = getActiveUser(email);

        Party party = partyRepository
                .findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found"));

        return partyMapper.toResponse(party);
    }

    public PartyDetailsResponse getDetails(Long id) {
        Party party = partyRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Party not found"));

        if (party.getStatus().getName() != PartyStatusType.APPROVED) {
            throw new RuntimeException("Party is not approved");
        }

        List<PartyProgramSummaryResponse> programs = programRepository
                .findAllByPartyOrderByCreatedAtDesc(party)
                .stream()
                .map(this::toProgramSummary)
                .toList();

        List<PartyElectionParticipationResponse> participations = partyParticipationRepository
                .findAllByParty_Id(party.getId())
                .stream()
                .sorted(this::compareByElectionDateDesc)
                .map(this::toParticipationResponse)
                .toList();

        return new PartyDetailsResponse(
                party.getId(),
                party.getName(),
                party.getDescription(),
                party.getMotto(),
                party.getLogoUrl(),
                party.getFoundedOn(),
                party.getCreatedAt(),

                party.getSelfEconomicAxis(),
                party.getSelfSocialAxis(),
                party.getSpecEconomicAxis(),
                party.getSpecSocialAxis(),

                programs,
                participations
        );
    }

    private PartyProgramSummaryResponse toProgramSummary(Program program) {
        return new PartyProgramSummaryResponse(
                program.getId(),
                program.getTitle(),

                program.getSelfEconomicAxis(),
                program.getSelfSocialAxis(),
                program.getSpecEconomicAxis(),
                program.getSpecSocialAxis(),

                program.getCreatedAt(),
                program.getLastEditAt(),

                program.getElection().getId(),
                program.getElection().getName(),
                program.getElection().getElectionDate()
        );
    }

    private PartyElectionParticipationResponse toParticipationResponse(
            PartyParticipation participation
    ) {
        Election election = participation.getElection();

        Program program = programRepository
                .findByPartyAndElection(participation.getParty(), election)
                .orElse(null);

        return new PartyElectionParticipationResponse(
                election.getId(),
                election.getName(),
                election.getElectionDate(),
                election.getType().getName().name(),
                getElectionStatus(election),

                participation.getVotesCount(),
                participation.getVotePercentage(),

                program != null ? program.getId() : null,
                program != null ? program.getTitle() : null
        );
    }

    private int compareByElectionDateDesc(
            PartyParticipation first,
            PartyParticipation second
    ) {
        return second.getElection().getElectionDate()
                .compareTo(first.getElection().getElectionDate());
    }

    private String getElectionStatus(Election election) {
        LocalDate today = LocalDate.now();

        if (election.getElectionDate().isBefore(today)) {
            return "FINISHED";
        }

        if (election.getElectionDate().isEqual(today)) {
            return "RUNNING";
        }

        return "UPCOMING";
    }

    private User getActiveUser(String email) {
        return userRepository
                .findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}