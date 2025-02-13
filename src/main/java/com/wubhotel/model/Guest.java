package com.wubhotel.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "guests")
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "membership_status")
    @Enumerated(EnumType.STRING)
    private MembershipStatus membershipStatus = MembershipStatus.REGULAR;

    public enum MembershipStatus {
        REGULAR, SILVER, GOLD, PLATINUM
    }
}
