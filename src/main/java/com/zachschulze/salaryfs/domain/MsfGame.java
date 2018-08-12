package com.zachschulze.salaryfs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A MsfGame.
 */
@Entity
@Table(name = "msf_game")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class MsfGame implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "week")
    private String week;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "venue_allegiance")
    private String venueAllegiance;

    @OneToOne
    @JoinColumn(unique = true)
    private MsfGameScore msfGame;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWeek() {
        return week;
    }

    public MsfGame week(String week) {
        this.week = week;
        return this;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getStartTime() {
        return startTime;
    }

    public MsfGame startTime(String startTime) {
        this.startTime = startTime;
        return this;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getVenueAllegiance() {
        return venueAllegiance;
    }

    public MsfGame venueAllegiance(String venueAllegiance) {
        this.venueAllegiance = venueAllegiance;
        return this;
    }

    public void setVenueAllegiance(String venueAllegiance) {
        this.venueAllegiance = venueAllegiance;
    }

    public MsfGameScore getMsfGame() {
        return msfGame;
    }

    public MsfGame msfGame(MsfGameScore msfGameScore) {
        this.msfGame = msfGameScore;
        return this;
    }

    public void setMsfGame(MsfGameScore msfGameScore) {
        this.msfGame = msfGameScore;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MsfGame msfGame = (MsfGame) o;
        if (msfGame.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), msfGame.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MsfGame{" +
            "id=" + getId() +
            ", week='" + getWeek() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", venueAllegiance='" + getVenueAllegiance() + "'" +
            "}";
    }
}
