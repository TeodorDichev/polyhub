package bg.fmi.polyhub.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "program_policies")
@Getter
@Setter
@NoArgsConstructor
public class ProgramPolicy {

    // This tells the code what the composite key is
    @EmbeddedId
    private ProgramPolicyId id;

    @MapsId("programId") // Mapped to a field in the composite key
    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @MapsId("policyId") // Mapped to a field in the composite key
    @ManyToOne(optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;
}