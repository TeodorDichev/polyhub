package bg.fmi.polyhub.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

// Enables composite keys. It means that these fields can be inserted into a table as one
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProgramPolicyId implements Serializable {
    private Long programId;
    private Long policyId;
}