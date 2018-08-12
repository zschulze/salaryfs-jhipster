package com.zachschulze.salaryfs.web.rest;

import com.zachschulze.salaryfs.SalaryfsApp;

import com.zachschulze.salaryfs.domain.MsfGameScore;
import com.zachschulze.salaryfs.repository.MsfGameScoreRepository;
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
 * Test class for the MsfGameScoreResource REST controller.
 *
 * @see MsfGameScoreResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SalaryfsApp.class)
public class MsfGameScoreResourceIntTest {

    private static final Long DEFAULT_CURRENT_QUARTER = 1L;
    private static final Long UPDATED_CURRENT_QUARTER = 2L;

    private static final Long DEFAULT_SECONDS = 1L;
    private static final Long UPDATED_SECONDS = 2L;

    @Autowired
    private MsfGameScoreRepository msfGameScoreRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMsfGameScoreMockMvc;

    private MsfGameScore msfGameScore;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MsfGameScoreResource msfGameScoreResource = new MsfGameScoreResource(msfGameScoreRepository);
        this.restMsfGameScoreMockMvc = MockMvcBuilders.standaloneSetup(msfGameScoreResource)
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
    public static MsfGameScore createEntity(EntityManager em) {
        MsfGameScore msfGameScore = new MsfGameScore()
            .currentQuarter(DEFAULT_CURRENT_QUARTER)
            .seconds(DEFAULT_SECONDS);
        return msfGameScore;
    }

    @Before
    public void initTest() {
        msfGameScore = createEntity(em);
    }

    @Test
    @Transactional
    public void createMsfGameScore() throws Exception {
        int databaseSizeBeforeCreate = msfGameScoreRepository.findAll().size();

        // Create the MsfGameScore
        restMsfGameScoreMockMvc.perform(post("/api/msf-game-scores")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGameScore)))
            .andExpect(status().isCreated());

        // Validate the MsfGameScore in the database
        List<MsfGameScore> msfGameScoreList = msfGameScoreRepository.findAll();
        assertThat(msfGameScoreList).hasSize(databaseSizeBeforeCreate + 1);
        MsfGameScore testMsfGameScore = msfGameScoreList.get(msfGameScoreList.size() - 1);
        assertThat(testMsfGameScore.getCurrentQuarter()).isEqualTo(DEFAULT_CURRENT_QUARTER);
        assertThat(testMsfGameScore.getSeconds()).isEqualTo(DEFAULT_SECONDS);
    }

    @Test
    @Transactional
    public void createMsfGameScoreWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = msfGameScoreRepository.findAll().size();

        // Create the MsfGameScore with an existing ID
        msfGameScore.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMsfGameScoreMockMvc.perform(post("/api/msf-game-scores")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGameScore)))
            .andExpect(status().isBadRequest());

        // Validate the MsfGameScore in the database
        List<MsfGameScore> msfGameScoreList = msfGameScoreRepository.findAll();
        assertThat(msfGameScoreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMsfGameScores() throws Exception {
        // Initialize the database
        msfGameScoreRepository.saveAndFlush(msfGameScore);

        // Get all the msfGameScoreList
        restMsfGameScoreMockMvc.perform(get("/api/msf-game-scores?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(msfGameScore.getId().intValue())))
            .andExpect(jsonPath("$.[*].currentQuarter").value(hasItem(DEFAULT_CURRENT_QUARTER.intValue())))
            .andExpect(jsonPath("$.[*].seconds").value(hasItem(DEFAULT_SECONDS.intValue())));
    }
    

    @Test
    @Transactional
    public void getMsfGameScore() throws Exception {
        // Initialize the database
        msfGameScoreRepository.saveAndFlush(msfGameScore);

        // Get the msfGameScore
        restMsfGameScoreMockMvc.perform(get("/api/msf-game-scores/{id}", msfGameScore.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(msfGameScore.getId().intValue()))
            .andExpect(jsonPath("$.currentQuarter").value(DEFAULT_CURRENT_QUARTER.intValue()))
            .andExpect(jsonPath("$.seconds").value(DEFAULT_SECONDS.intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingMsfGameScore() throws Exception {
        // Get the msfGameScore
        restMsfGameScoreMockMvc.perform(get("/api/msf-game-scores/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMsfGameScore() throws Exception {
        // Initialize the database
        msfGameScoreRepository.saveAndFlush(msfGameScore);

        int databaseSizeBeforeUpdate = msfGameScoreRepository.findAll().size();

        // Update the msfGameScore
        MsfGameScore updatedMsfGameScore = msfGameScoreRepository.findById(msfGameScore.getId()).get();
        // Disconnect from session so that the updates on updatedMsfGameScore are not directly saved in db
        em.detach(updatedMsfGameScore);
        updatedMsfGameScore
            .currentQuarter(UPDATED_CURRENT_QUARTER)
            .seconds(UPDATED_SECONDS);

        restMsfGameScoreMockMvc.perform(put("/api/msf-game-scores")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMsfGameScore)))
            .andExpect(status().isOk());

        // Validate the MsfGameScore in the database
        List<MsfGameScore> msfGameScoreList = msfGameScoreRepository.findAll();
        assertThat(msfGameScoreList).hasSize(databaseSizeBeforeUpdate);
        MsfGameScore testMsfGameScore = msfGameScoreList.get(msfGameScoreList.size() - 1);
        assertThat(testMsfGameScore.getCurrentQuarter()).isEqualTo(UPDATED_CURRENT_QUARTER);
        assertThat(testMsfGameScore.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    public void updateNonExistingMsfGameScore() throws Exception {
        int databaseSizeBeforeUpdate = msfGameScoreRepository.findAll().size();

        // Create the MsfGameScore

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMsfGameScoreMockMvc.perform(put("/api/msf-game-scores")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGameScore)))
            .andExpect(status().isBadRequest());

        // Validate the MsfGameScore in the database
        List<MsfGameScore> msfGameScoreList = msfGameScoreRepository.findAll();
        assertThat(msfGameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMsfGameScore() throws Exception {
        // Initialize the database
        msfGameScoreRepository.saveAndFlush(msfGameScore);

        int databaseSizeBeforeDelete = msfGameScoreRepository.findAll().size();

        // Get the msfGameScore
        restMsfGameScoreMockMvc.perform(delete("/api/msf-game-scores/{id}", msfGameScore.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MsfGameScore> msfGameScoreList = msfGameScoreRepository.findAll();
        assertThat(msfGameScoreList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MsfGameScore.class);
        MsfGameScore msfGameScore1 = new MsfGameScore();
        msfGameScore1.setId(1L);
        MsfGameScore msfGameScore2 = new MsfGameScore();
        msfGameScore2.setId(msfGameScore1.getId());
        assertThat(msfGameScore1).isEqualTo(msfGameScore2);
        msfGameScore2.setId(2L);
        assertThat(msfGameScore1).isNotEqualTo(msfGameScore2);
        msfGameScore1.setId(null);
        assertThat(msfGameScore1).isNotEqualTo(msfGameScore2);
    }
}
