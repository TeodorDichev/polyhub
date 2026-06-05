package bg.fmi.polyhub.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "parties")
@Getter
@Setter
@NoArgsConstructor
public class Party {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String motto;

    @Column(nullable = false)
    private String description;

    @Column(name = "rejection_comment")
    private String rejectionComment;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "founded_on")
    private LocalDate foundedOn;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    private PartyStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "self_economic_axis")
    private Double selfEconomicAxis;

    @Column(name = "self_social_axis")
    private Double selfSocialAxis;

    @Column(name = "spec_economic_axis")
    private Double specEconomicAxis;

    @Column(name = "spec_social_axis")
    private Double specSocialAxis;

    // because hibernate changes it to null??? and we insert null...
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
