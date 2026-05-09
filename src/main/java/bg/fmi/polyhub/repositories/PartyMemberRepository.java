package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {

    List<PartyMember> findByPartyId(Long partyId);

    List<PartyMember> findByRoleName(String roleName);

    List<PartyMember> findByPartyIdAndRoleName(Long partyId, String roleName);
}
