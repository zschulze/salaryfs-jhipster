package com.zachschulze.salaryfs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.zachschulze.salaryfs.domain.MsfGameScore;
import com.zachschulze.salaryfs.repository.MsfGameScoreRepository;
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
 * REST controller for managing MsfGameScore.
 */
@RestController
@RequestMapping("/api")
public class MsfGameScoreResource {

    private final Logger log = LoggerFactory.getLogger(MsfGameScoreResource.class);

    private static final String ENTITY_NAME = "msfGameScore";

    private final MsfGameScoreRepository msfGameScoreRepository;

    public MsfGameScoreResource(MsfGameScoreRepository msfGameScoreRepository) {
        this.msfGameScoreRepository = msfGameScoreRepository;
    }

    /**
     * POST  /msf-game-scores : Create a new msfGameScore.
     *
     * @param msfGameScore the msfGameScore to create
     * @return the ResponseEntity with status 201 (Created) and with body the new msfGameScore, or with status 400 (Bad Request) if the msfGameScore has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/msf-game-scores")
    @Timed
    public ResponseEntity<MsfGameScore> createMsfGameScore(@RequestBody MsfGameScore msfGameScore) throws URISyntaxException {
        log.debug("REST request to save MsfGameScore : {}", msfGameScore);
        if (msfGameScore.getId() != null) {
            throw new BadRequestAlertException("A new msfGameScore cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MsfGameScore result = msfGameScoreRepository.save(msfGameScore);
        return ResponseEntity.created(new URI("/api/msf-game-scores/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /msf-game-scores : Updates an existing msfGameScore.
     *
     * @param msfGameScore the msfGameScore to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated msfGameScore,
     * or with status 400 (Bad Request) if the msfGameScore is not valid,
     * or with status 500 (Internal Server Error) if the msfGameScore couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/msf-game-scores")
    @Timed
    public ResponseEntity<MsfGameScore> updateMsfGameScore(@RequestBody MsfGameScore msfGameScore) throws URISyntaxException {
        log.debug("REST request to update MsfGameScore : {}", msfGameScore);
        if (msfGameScore.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MsfGameScore result = msfGameScoreRepository.save(msfGameScore);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, msfGameScore.getId().toString()))
            .body(result);
    }

    /**
     * GET  /msf-game-scores : get all the msfGameScores.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of msfGameScores in body
     */
    @GetMapping("/msf-game-scores")
    @Timed
    public List<MsfGameScore> getAllMsfGameScores() {
        log.debug("REST request to get all MsfGameScores");
        return msfGameScoreRepository.findAll();
    }

    /**
     * GET  /msf-game-scores/:id : get the "id" msfGameScore.
     *
     * @param id the id of the msfGameScore to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the msfGameScore, or with status 404 (Not Found)
     */
    @GetMapping("/msf-game-scores/{id}")
    @Timed
    public ResponseEntity<MsfGameScore> getMsfGameScore(@PathVariable Long id) {
        log.debug("REST request to get MsfGameScore : {}", id);
        Optional<MsfGameScore> msfGameScore = msfGameScoreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(msfGameScore);
    }

    /**
     * DELETE  /msf-game-scores/:id : delete the "id" msfGameScore.
     *
     * @param id the id of the msfGameScore to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/msf-game-scores/{id}")
    @Timed
    public ResponseEntity<Void> deleteMsfGameScore(@PathVariable Long id) {
        log.debug("REST request to delete MsfGameScore : {}", id);

        msfGameScoreRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
