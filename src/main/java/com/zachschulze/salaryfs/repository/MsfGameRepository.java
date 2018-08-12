package com.zachschulze.salaryfs.repository;

import com.zachschulze.salaryfs.domain.MsfGame;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MsfGame entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MsfGameRepository extends JpaRepository<MsfGame, Long> {

}
