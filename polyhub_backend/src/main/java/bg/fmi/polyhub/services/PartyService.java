package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.PartyAdminResponse;
import bg.fmi.polyhub.dto.admin.RejectPartyRequest;
import bg.fmi.polyhub.dto.party.PartyDetailsResponse;
import bg.fmi.polyhub.dto.party.PartyElectionParticipationResponse;
import bg.fmi.polyhub.dto.party.PartyProgramSummaryResponse;
import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.dto.specialist.PartyForRatingResponse;
import bg.fmi.polyhub.dto.specialist.PartyRatingRequest;
import bg.fmi.polyhub.dto.PoliticalPositionType;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.PartyStatus;
import bg.fmi.polyhub.entities.PartyStatusType;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.PartyMapper;
import bg.fmi.polyhub.repositories.PartyParticipationRepository;
import bg.fmi.polyhub.repositories.PartyRepository;
import bg.fmi.polyhub.repositories.PartyStatusRepository;
import bg.fmi.polyhub.repositories.ProgramRepository;
import bg.fmi.polyhub.repositories.UserRepository;
import bg.fmi.polyhub.utils.ElectionStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartyService {

    private final PartyRepository partyRepository;
    private final PartyStatusRepository partyStatusRepository;
    private final UserRepository userRepository;
    private final PartyMapper partyMapper;
    private final ProgramRepository programRepository;
    private final PartyParticipationRepository partyParticipationRepository;

    // move setting fields to a mapper or a private method
    public PartyResponse submit(SubmitPartyRequest request, String email) {
        User user = getActiveUser(email);
        ensureNotSuspended(user);

        partyRepository.findByCreatedByAndDeletedAtIsNull(user).ifPresent(existing -> {
            PartyStatusType status = existing.getStatus().getName();
            if (status == PartyStatusType.PENDING || status == PartyStatusType.APPROVED) {
                throw new RuntimeException("You already have an active or pending party");
            }
        });

        if (partyRepository.existsByNameAndDeletedAtIsNull(request.name())) {
            throw new RuntimeException("Party name already exists");
        }

        ensureFoundedOnNotInFuture(request.foundedOn());

        PartyStatus pendingStatus = getStatus(PartyStatusType.PENDING);

        Party party = partyMapper.toEntity(request);
        party.setStatus(pendingStatus);
        party.setCreatedBy(user);

        return partyMapper.toResponse(partyRepository.save(party));
    }

    public PartyResponse resubmit(SubmitPartyRequest request, String email) {
        User user = getActiveUser(email);
        ensureNotSuspended(user);

        Party existing = partyRepository
                .findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found to resubmit"));

        if (existing.getStatus().getName() != PartyStatusType.REJECTED) {
            throw new RuntimeException("Only rejected parties can be resubmitted");
        }

        ensureFoundedOnNotInFuture(request.foundedOn());

        existing.setName(request.name());
        existing.setDescription(request.description());
        existing.setMotto(request.motto());
        existing.setLogoUrl(request.logoUrl());
        existing.setFoundedOn(request.foundedOn());
        existing.setStatus(getStatus(PartyStatusType.PENDING));
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

    public void selfRateParty(Double selfEconomicAxis, Double selfSocialAxis, String email) {
        User user = getActiveUser(email);
        ensureNotSuspended(user);

        Party party = partyRepository
                .findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found"));

        if (party.getStatus().getName() != PartyStatusType.APPROVED) {
            throw new RuntimeException("Only approved parties can be self-rated");
        }

        party.setSelfEconomicAxis(selfEconomicAxis);
        party.setSelfSocialAxis(selfSocialAxis);
        partyRepository.save(party);
    }

    public PartyDetailsResponse getDetails(Long id) {
        Party party = findActiveParty(id);

        if (party.getStatus().getName() != PartyStatusType.APPROVED) {
            throw new RuntimeException("Party is not approved");
        }

        User owner = party.getCreatedBy();
        boolean ownerActive = owner.getDeletedAt() == null && owner.getSuspendedOn() == null;

        List<PartyProgramSummaryResponse> programs;
        List<PartyElectionParticipationResponse> participations;

        if (ownerActive) {
            programs = programRepository
                    .findAllByPartyOrderByCreatedAtDesc(party)
                    .stream()
                    .map(partyMapper::toProgramSummary)
                    .toList();

            participations = partyParticipationRepository
                    .findAllByParty_Id(party.getId())
                    .stream()
                    .sorted(this::compareByElectionDateDesc)
                    .map(this::toParticipationResponse)
                    .toList();
        } else {
            programs = List.of();
            participations = List.of();
        }

        String label = PoliticalPositionType.toSimpleLabel(party.getSpecEconomicAxis(), party.getSpecSocialAxis());

        return partyMapper.toDetailsResponse(party, programs, participations)
                .toBuilder()
                .politicalLabel(label)
                .build();
    }

    public List<PartyAdminResponse> getAllParties() {
        return partyRepository.findAllByDeletedAtIsNull()
                .stream()
                .map(partyMapper::toAdminPartyResponse)
                .toList();
    }

    public PartyAdminResponse getParty(Long id) {
        return partyMapper.toAdminPartyResponse(findActiveParty(id));
    }

    public PartyAdminResponse approveParty(Long id) {
        Party party = findActiveParty(id);

        if (party.getStatus().getName() != PartyStatusType.PENDING) {
            throw new RuntimeException("Only pending parties can be approved");
        }

        party.setStatus(getStatus(PartyStatusType.APPROVED));
        party.setRejectionComment(null);
        return partyMapper.toAdminPartyResponse(partyRepository.save(party));
    }

    public PartyAdminResponse rejectParty(Long id, RejectPartyRequest request) {
        Party party = findActiveParty(id);

        if (party.getStatus().getName() != PartyStatusType.PENDING) {
            throw new RuntimeException("Only pending parties can be rejected");
        }

        party.setStatus(getStatus(PartyStatusType.REJECTED));
        party.setRejectionComment(request.comment());
        return partyMapper.toAdminPartyResponse(partyRepository.save(party));
    }

    public void deleteParty(Long id) {
        Party party = findActiveParty(id);
        party.setDeletedAt(LocalDateTime.now());
        partyRepository.save(party);
    }

    public List<PartyForRatingResponse> getAllApprovedParties() {
        return partyRepository.findAllByDeletedAtIsNull()
                .stream()
                .filter(p -> p.getStatus().getName() == PartyStatusType.APPROVED)
                .filter(p -> {
                    User owner = p.getCreatedBy();
                    return owner.getDeletedAt() == null && owner.getSuspendedOn() == null;
                })
                .map(this::toRatingResponse)
                .toList();
    }

    public PartyForRatingResponse rateParty(Long id, PartyRatingRequest request) {
        Party party = findActiveParty(id);

        if (party.getStatus().getName() != PartyStatusType.APPROVED) {
            throw new RuntimeException("Only approved parties can be rated");
        }

        party.setSpecEconomicAxis(request.specEconomicAxis());
        party.setSpecSocialAxis(request.specSocialAxis());

        return toRatingResponse(partyRepository.save(party));
    }

    private Party findActiveParty(Long id) {
        return partyRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Party not found"));
    }

    private PartyStatus getStatus(PartyStatusType type) {
        return partyStatusRepository.findByName(type)
                .orElseThrow(() -> new RuntimeException("Status not found"));
    }

    private User getActiveUser(String email) {
        return userRepository
                .findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void ensureNotSuspended(User user) {
        if (user.getSuspendedOn() != null) {
            throw new RuntimeException("Your account has been suspended");
        }
    }

    private void ensureFoundedOnNotInFuture(LocalDate foundedOn) {
        if (foundedOn.isAfter(LocalDate.now())) {
            throw new RuntimeException("Party cannot be created on this date");
        }
    }

    private PartyForRatingResponse toRatingResponse(Party party) {
        boolean rated = party.getSpecEconomicAxis() != null && party.getSpecSocialAxis() != null;
        String label = PoliticalPositionType.toSimpleLabel(party.getSpecEconomicAxis(), party.getSpecSocialAxis());

        return partyMapper.toRatingResponseBase(party)
                .toBuilder()
                .rated(rated)
                .politicalLabel(label)
                .build();
    }

    private PartyElectionParticipationResponse toParticipationResponse(PartyParticipation participation) {
        Election election = participation.getElection();

        Program program = programRepository
                .findByPartyAndElection(participation.getParty(), election)
                .orElse(null);

        return partyMapper.toParticipationResponse(participation, program)
                .toBuilder()
                .electionStatus(ElectionStatusUtils.getStatus(election))
                .build();
    }

    private int compareByElectionDateDesc(PartyParticipation first, PartyParticipation second) {
        return second.getElection().getElectionDate()
                .compareTo(first.getElection().getElectionDate());
    }
}