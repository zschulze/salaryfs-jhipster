package com.zachschulze.salaryfs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.zachschulze.salaryfs.domain.MsfGame;
import com.zachschulze.salaryfs.repository.MsfGameRepository;
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
 * REST controller for managing MsfGame.
 */
@RestController
@RequestMapping("/api")
public class MsfGameResource {

    private final Logger log = LoggerFactory.getLogger(MsfGameResource.class);

    private static final String ENTITY_NAME = "msfGame";

    private final MsfGameRepository msfGameRepository;

    public MsfGameResource(MsfGameRepository msfGameRepository) {
        this.msfGameRepository = msfGameRepository;
    }

    /**
     * POST  /msf-games : Create a new msfGame.
     *
     * @param msfGame the msfGame to create
     * @return the ResponseEntity with status 201 (Created) and with body the new msfGame, or with status 400 (Bad Request) if the msfGame has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/msf-games")
    @Timed
    public ResponseEntity<MsfGame> createMsfGame(@RequestBody MsfGame msfGame) throws URISyntaxException {
        log.debug("REST request to save MsfGame : {}", msfGame);
        if (msfGame.getId() != null) {
            throw new BadRequestAlertException("A new msfGame cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MsfGame result = msfGameRepository.save(msfGame);
        return ResponseEntity.created(new URI("/api/msf-games/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /msf-games : Updates an existing msfGame.
     *
     * @param msfGame the msfGame to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated msfGame,
     * or with status 400 (Bad Request) if the msfGame is not valid,
     * or with status 500 (Internal Server Error) if the msfGame couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/msf-games")
    @Timed
    public ResponseEntity<MsfGame> updateMsfGame(@RequestBody MsfGame msfGame) throws URISyntaxException {
        log.debug("REST request to update MsfGame : {}", msfGame);
        if (msfGame.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MsfGame result = msfGameRepository.save(msfGame);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, msfGame.getId().toString()))
            .body(result);
    }

    /**
     * GET  /msf-games : get all the msfGames.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of msfGames in body
     */
    @GetMapping("/msf-games")
    @Timed
    public List<MsfGame> getAllMsfGames() {
        log.debug("REST request to get all MsfGames");
        return msfGameRepository.findAll();
    }

    /**
     * GET  /msf-games/:id : get the "id" msfGame.
     *
     * @param id the id of the msfGame to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the msfGame, or with status 404 (Not Found)
     */
    @GetMapping("/msf-games/{id}")
    @Timed
    public ResponseEntity<MsfGame> getMsfGame(@PathVariable Long id) {
        log.debug("REST request to get MsfGame : {}", id);
        Optional<MsfGame> msfGame = msfGameRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(msfGame);
    }

    /**
     * DELETE  /msf-games/:id : delete the "id" msfGame.
     *
     * @param id the id of the msfGame to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/msf-games/{id}")
    @Timed
    public ResponseEntity<Void> deleteMsfGame(@PathVariable Long id) {
        log.debug("REST request to delete MsfGame : {}", id);

        msfGameRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
