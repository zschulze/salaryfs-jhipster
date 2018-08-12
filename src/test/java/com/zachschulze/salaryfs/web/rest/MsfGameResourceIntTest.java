package com.zachschulze.salaryfs.web.rest;

import com.zachschulze.salaryfs.SalaryfsApp;

import com.zachschulze.salaryfs.domain.MsfGame;
import com.zachschulze.salaryfs.repository.MsfGameRepository;
import com.zachschulze.salaryfs.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.zachschulze.salaryfs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MsfGameResource REST controller.
 *
 * @see MsfGameResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SalaryfsApp.class)
public class MsfGameResourceIntTest {

    private static final String DEFAULT_WEEK = "AAAAAAAAAA";
    private static final String UPDATED_WEEK = "BBBBBBBBBB";

    private static final String DEFAULT_START_TIME = "AAAAAAAAAA";
    private static final String UPDATED_START_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_VENUE_ALLEGIANCE = "AAAAAAAAAA";
    private static final String UPDATED_VENUE_ALLEGIANCE = "BBBBBBBBBB";

    @Autowired
    private MsfGameRepository msfGameRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMsfGameMockMvc;

    private MsfGame msfGame;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MsfGameResource msfGameResource = new MsfGameResource(msfGameRepository);
        this.restMsfGameMockMvc = MockMvcBuilders.standaloneSetup(msfGameResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MsfGame createEntity(EntityManager em) {
        MsfGame msfGame = new MsfGame()
            .week(DEFAULT_WEEK)
            .startTime(DEFAULT_START_TIME)
            .venueAllegiance(DEFAULT_VENUE_ALLEGIANCE);
        return msfGame;
    }

    @Before
    public void initTest() {
        msfGame = createEntity(em);
    }

    @Test
    @Transactional
    public void createMsfGame() throws Exception {
        int databaseSizeBeforeCreate = msfGameRepository.findAll().size();

        // Create the MsfGame
        restMsfGameMockMvc.perform(post("/api/msf-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGame)))
            .andExpect(status().isCreated());

        // Validate the MsfGame in the database
        List<MsfGame> msfGameList = msfGameRepository.findAll();
        assertThat(msfGameList).hasSize(databaseSizeBeforeCreate + 1);
        MsfGame testMsfGame = msfGameList.get(msfGameList.size() - 1);
        assertThat(testMsfGame.getWeek()).isEqualTo(DEFAULT_WEEK);
        assertThat(testMsfGame.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testMsfGame.getVenueAllegiance()).isEqualTo(DEFAULT_VENUE_ALLEGIANCE);
    }

    @Test
    @Transactional
    public void createMsfGameWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = msfGameRepository.findAll().size();

        // Create the MsfGame with an existing ID
        msfGame.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMsfGameMockMvc.perform(post("/api/msf-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGame)))
            .andExpect(status().isBadRequest());

        // Validate the MsfGame in the database
        List<MsfGame> msfGameList = msfGameRepository.findAll();
        assertThat(msfGameList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMsfGames() throws Exception {
        // Initialize the database
        msfGameRepository.saveAndFlush(msfGame);

        // Get all the msfGameList
        restMsfGameMockMvc.perform(get("/api/msf-games?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(msfGame.getId().intValue())))
            .andExpect(jsonPath("$.[*].week").value(hasItem(DEFAULT_WEEK.toString())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].venueAllegiance").value(hasItem(DEFAULT_VENUE_ALLEGIANCE.toString())));
    }
    

    @Test
    @Transactional
    public void getMsfGame() throws Exception {
        // Initialize the database
        msfGameRepository.saveAndFlush(msfGame);

        // Get the msfGame
        restMsfGameMockMvc.perform(get("/api/msf-games/{id}", msfGame.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(msfGame.getId().intValue()))
            .andExpect(jsonPath("$.week").value(DEFAULT_WEEK.toString()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.venueAllegiance").value(DEFAULT_VENUE_ALLEGIANCE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingMsfGame() throws Exception {
        // Get the msfGame
        restMsfGameMockMvc.perform(get("/api/msf-games/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMsfGame() throws Exception {
        // Initialize the database
        msfGameRepository.saveAndFlush(msfGame);

        int databaseSizeBeforeUpdate = msfGameRepository.findAll().size();

        // Update the msfGame
        MsfGame updatedMsfGame = msfGameRepository.findById(msfGame.getId()).get();
        // Disconnect from session so that the updates on updatedMsfGame are not directly saved in db
        em.detach(updatedMsfGame);
        updatedMsfGame
            .week(UPDATED_WEEK)
            .startTime(UPDATED_START_TIME)
            .venueAllegiance(UPDATED_VENUE_ALLEGIANCE);

        restMsfGameMockMvc.perform(put("/api/msf-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMsfGame)))
            .andExpect(status().isOk());

        // Validate the MsfGame in the database
        List<MsfGame> msfGameList = msfGameRepository.findAll();
        assertThat(msfGameList).hasSize(databaseSizeBeforeUpdate);
        MsfGame testMsfGame = msfGameList.get(msfGameList.size() - 1);
        assertThat(testMsfGame.getWeek()).isEqualTo(UPDATED_WEEK);
        assertThat(testMsfGame.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testMsfGame.getVenueAllegiance()).isEqualTo(UPDATED_VENUE_ALLEGIANCE);
    }

    @Test
    @Transactional
    public void updateNonExistingMsfGame() throws Exception {
        int databaseSizeBeforeUpdate = msfGameRepository.findAll().size();

        // Create the MsfGame

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMsfGameMockMvc.perform(put("/api/msf-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGame)))
            .andExpect(status().isBadRequest());

        // Validate the MsfGame in the database
        List<MsfGame> msfGameList = msfGameRepository.findAll();
        assertThat(msfGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMsfGame() throws Exception {
        // Initialize the database
        msfGameRepository.saveAndFlush(msfGame);

        int databaseSizeBeforeDelete = msfGameRepository.findAll().size();

        // Get the msfGame
        restMsfGameMockMvc.perform(delete("/api/msf-games/{id}", msfGame.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MsfGame> msfGameList = msfGameRepository.findAll();
        assertThat(msfGameList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MsfGame.class);
        MsfGame msfGame1 = new MsfGame();
        msfGame1.setId(1L);
        MsfGame msfGame2 = new MsfGame();
        msfGame2.setId(msfGame1.getId());
        assertThat(msfGame1).isEqualTo(msfGame2);
        msfGame2.setId(2L);
        assertThat(msfGame1).isNotEqualTo(msfGame2);
        msfGame1.setId(null);
        assertThat(msfGame1).isNotEqualTo(msfGame2);
    }
}
