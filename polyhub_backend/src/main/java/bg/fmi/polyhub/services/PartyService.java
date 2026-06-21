package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.PartyAdminResponse;
import bg.fmi.polyhub.dto.admin.RejectPartyRequest;
import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.dto.specialist.PartyForRatingResponse;
import bg.fmi.polyhub.dto.specialist.PartyRatingRequest;
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

    // ── Party Admin actions ──────────────────────────────────────

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

    // ── Admin actions ─────────────────────────────────────────────

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

    // ── Specialist actions ────────────────────────────────────────

    public List<PartyForRatingResponse> getAllApprovedParties() {
        return partyRepository.findAllByDeletedAtIsNull()
                .stream()
                .filter(p -> p.getStatus().getName() == PartyStatusType.APPROVED)
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

    // ── Shared helpers ─────────────────────────────────────────────

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
        return partyMapper.toRatingResponseBase(party)
                .toBuilder()
                .rated(rated)
                .build();
    }
}