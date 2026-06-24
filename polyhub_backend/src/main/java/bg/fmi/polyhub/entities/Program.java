package bg.fmi.polyhub.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "programs")
@Getter
@Setter
@NoArgsConstructor
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(name = "last_edit_at")
    private LocalDateTime lastEditAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "self_economic_axis")
    private Double selfEconomicAxis;

    @Column(name = "self_social_axis")
    private Double selfSocialAxis;

    @Column(name = "spec_economic_axis")
    private Double specEconomicAxis;

    @Column(name = "spec_social_axis")
    private Double specSocialAxis;

    @ManyToOne(optional = false)
    @JoinColumn(name = "party_id", nullable = false)
    private Party party;

    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;
}
