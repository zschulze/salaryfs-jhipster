package com.zachschulze.salaryfs.repository;

import com.zachschulze.salaryfs.domain.MsfGameScore;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MsfGameScore entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MsfGameScoreRepository extends JpaRepository<MsfGameScore, Long> {

}
