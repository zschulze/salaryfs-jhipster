package com.zachschulze.salaryfs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.zachschulze.salaryfs.domain.MsfGameQuarter;
import com.zachschulze.salaryfs.repository.MsfGameQuarterRepository;
import com.zachschulze.salaryfs.web.rest.errors.BadRequestAlertException;
import com.zachschulze.salaryfs.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing MsfGameQuarter.
 */
@RestController
@RequestMapping("/api")
public class MsfGameQuarterResource {

    private final Logger log = LoggerFactory.getLogger(MsfGameQuarterResource.class);

    private static final String ENTITY_NAME = "msfGameQuarter";

    private final MsfGameQuarterRepository msfGameQuarterRepository;

    public MsfGameQuarterResource(MsfGameQuarterRepository msfGameQuarterRepository) {
        this.msfGameQuarterRepository = msfGameQuarterRepository;
    }

    /**
     * POST  /msf-game-quarters : Create a new msfGameQuarter.
     *
     * @param msfGameQuarter the msfGameQuarter to create
     * @return the ResponseEntity with status 201 (Created) and with body the new msfGameQuarter, or with status 400 (Bad Request) if the msfGameQuarter has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/msf-game-quarters")
    @Timed
    public ResponseEntity<MsfGameQuarter> createMsfGameQuarter(@RequestBody MsfGameQuarter msfGameQuarter) throws URISyntaxException {
        log.debug("REST request to save MsfGameQuarter : {}", msfGameQuarter);
        if (msfGameQuarter.getId() != null) {
            throw new BadRequestAlertException("A new msfGameQuarter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MsfGameQuarter result = msfGameQuarterRepository.save(msfGameQuarter);
        return ResponseEntity.created(new URI("/api/msf-game-quarters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /msf-game-quarters : Updates an existing msfGameQuarter.
     *
     * @param msfGameQuarter the msfGameQuarter to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated msfGameQuarter,
     * or with status 400 (Bad Request) if the msfGameQuarter is not valid,
     * or with status 500 (Internal Server Error) if the msfGameQuarter couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/msf-game-quarters")
    @Timed
    public ResponseEntity<MsfGameQuarter> updateMsfGameQuarter(@RequestBody MsfGameQuarter msfGameQuarter) throws URISyntaxException {
        log.debug("REST request to update MsfGameQuarter : {}", msfGameQuarter);
        if (msfGameQuarter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MsfGameQuarter result = msfGameQuarterRepository.save(msfGameQuarter);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, msfGameQuarter.getId().toString()))
            .body(result);
    }

    /**
     * GET  /msf-game-quarters : get all the msfGameQuarters.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of msfGameQuarters in body
     */
    @GetMapping("/msf-game-quarters")
    @Timed
    public List<MsfGameQuarter> getAllMsfGameQuarters() {
        log.debug("REST request to get all MsfGameQuarters");
        return msfGameQuarterRepository.findAll();
    }

    /**
     * GET  /msf-game-quarters/:id : get the "id" msfGameQuarter.
     *
     * @param id the id of the msfGameQuarter to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the msfGameQuarter, or with status 404 (Not Found)
     */
    @GetMapping("/msf-game-quarters/{id}")
    @Timed
    public ResponseEntity<MsfGameQuarter> getMsfGameQuarter(@PathVariable Long id) {
        log.debug("REST request to get MsfGameQuarter : {}", id);
        Optional<MsfGameQuarter> msfGameQuarter = msfGameQuarterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(msfGameQuarter);
    }

    /**
     * DELETE  /msf-game-quarters/:id : delete the "id" msfGameQuarter.
     *
     * @param id the id of the msfGameQuarter to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/msf-game-quarters/{id}")
    @Timed
    public ResponseEntity<Void> deleteMsfGameQuarter(@PathVariable Long id) {
        log.debug("REST request to delete MsfGameQuarter : {}", id);

        msfGameQuarterRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
