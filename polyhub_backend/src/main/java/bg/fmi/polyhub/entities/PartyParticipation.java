package bg.fmi.polyhub.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "party_participations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_party_election_participation",
                        columnNames = {"party_id", "election_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class PartyParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "party_id", nullable = false)
    private Party party;

    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Column(name = "votes_count")
    private Long votesCount;

    @Column(name = "vote_percentage", precision = 5, scale = 2)
    private BigDecimal votePercentage;
}