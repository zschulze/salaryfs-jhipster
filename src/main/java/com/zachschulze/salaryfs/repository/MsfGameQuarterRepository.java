package com.zachschulze.salaryfs.repository;

import com.zachschulze.salaryfs.domain.MsfGameQuarter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MsfGameQuarter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MsfGameQuarterRepository extends JpaRepository<MsfGameQuarter, Long> {

}
