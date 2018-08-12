package com.zachschulze.salaryfs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A MsfGameScore.
 */
@Entity
@Table(name = "msf_game_score")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class MsfGameScore implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "current_quarter")
    private Long currentQuarter;

    @Column(name = "seconds")
    private Long seconds;

    @OneToMany(mappedBy = "msfGameScore")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<MsfGameQuarter> msfGameQuarters = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCurrentQuarter() {
        return currentQuarter;
    }

    public MsfGameScore currentQuarter(Long currentQuarter) {
        this.currentQuarter = currentQuarter;
        return this;
    }

    public void setCurrentQuarter(Long currentQuarter) {
        this.currentQuarter = currentQuarter;
    }

    public Long getSeconds() {
        return seconds;
    }

    public MsfGameScore seconds(Long seconds) {
        this.seconds = seconds;
        return this;
    }

    public void setSeconds(Long seconds) {
        this.seconds = seconds;
    }

    public Set<MsfGameQuarter> getMsfGameQuarters() {
        return msfGameQuarters;
    }

    public MsfGameScore msfGameQuarters(Set<MsfGameQuarter> msfGameQuarters) {
        this.msfGameQuarters = msfGameQuarters;
        return this;
    }

    public MsfGameScore addMsfGameQuarter(MsfGameQuarter msfGameQuarter) {
        this.msfGameQuarters.add(msfGameQuarter);
        msfGameQuarter.setMsfGameScore(this);
        return this;
    }

    public MsfGameScore removeMsfGameQuarter(MsfGameQuarter msfGameQuarter) {
        this.msfGameQuarters.remove(msfGameQuarter);
        msfGameQuarter.setMsfGameScore(null);
        return this;
    }

    public void setMsfGameQuarters(Set<MsfGameQuarter> msfGameQuarters) {
        this.msfGameQuarters = msfGameQuarters;
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
        MsfGameScore msfGameScore = (MsfGameScore) o;
        if (msfGameScore.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), msfGameScore.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MsfGameScore{" +
            "id=" + getId() +
            ", currentQuarter=" + getCurrentQuarter() +
            ", seconds=" + getSeconds() +
            "}";
    }
}
