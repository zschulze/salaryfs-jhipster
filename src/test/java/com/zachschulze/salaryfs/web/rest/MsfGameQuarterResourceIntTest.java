package com.zachschulze.salaryfs.web.rest;

import com.zachschulze.salaryfs.SalaryfsApp;

import com.zachschulze.salaryfs.domain.MsfGameQuarter;
import com.zachschulze.salaryfs.repository.MsfGameQuarterRepository;
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
 * Test class for the MsfGameQuarterResource REST controller.
 *
 * @see MsfGameQuarterResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SalaryfsApp.class)
public class MsfGameQuarterResourceIntTest {

    private static final String DEFAULT_QUARTER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_QUARTER_NAME = "BBBBBBBBBB";

    @Autowired
    private MsfGameQuarterRepository msfGameQuarterRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMsfGameQuarterMockMvc;

    private MsfGameQuarter msfGameQuarter;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MsfGameQuarterResource msfGameQuarterResource = new MsfGameQuarterResource(msfGameQuarterRepository);
        this.restMsfGameQuarterMockMvc = MockMvcBuilders.standaloneSetup(msfGameQuarterResource)
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
    public static MsfGameQuarter createEntity(EntityManager em) {
        MsfGameQuarter msfGameQuarter = new MsfGameQuarter()
            .quarterName(DEFAULT_QUARTER_NAME);
        return msfGameQuarter;
    }

    @Before
    public void initTest() {
        msfGameQuarter = createEntity(em);
    }

    @Test
    @Transactional
    public void createMsfGameQuarter() throws Exception {
        int databaseSizeBeforeCreate = msfGameQuarterRepository.findAll().size();

        // Create the MsfGameQuarter
        restMsfGameQuarterMockMvc.perform(post("/api/msf-game-quarters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGameQuarter)))
            .andExpect(status().isCreated());

        // Validate the MsfGameQuarter in the database
        List<MsfGameQuarter> msfGameQuarterList = msfGameQuarterRepository.findAll();
        assertThat(msfGameQuarterList).hasSize(databaseSizeBeforeCreate + 1);
        MsfGameQuarter testMsfGameQuarter = msfGameQuarterList.get(msfGameQuarterList.size() - 1);
        assertThat(testMsfGameQuarter.getQuarterName()).isEqualTo(DEFAULT_QUARTER_NAME);
    }

    @Test
    @Transactional
    public void createMsfGameQuarterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = msfGameQuarterRepository.findAll().size();

        // Create the MsfGameQuarter with an existing ID
        msfGameQuarter.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMsfGameQuarterMockMvc.perform(post("/api/msf-game-quarters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGameQuarter)))
            .andExpect(status().isBadRequest());

        // Validate the MsfGameQuarter in the database
        List<MsfGameQuarter> msfGameQuarterList = msfGameQuarterRepository.findAll();
        assertThat(msfGameQuarterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMsfGameQuarters() throws Exception {
        // Initialize the database
        msfGameQuarterRepository.saveAndFlush(msfGameQuarter);

        // Get all the msfGameQuarterList
        restMsfGameQuarterMockMvc.perform(get("/api/msf-game-quarters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(msfGameQuarter.getId().intValue())))
            .andExpect(jsonPath("$.[*].quarterName").value(hasItem(DEFAULT_QUARTER_NAME.toString())));
    }
    

    @Test
    @Transactional
    public void getMsfGameQuarter() throws Exception {
        // Initialize the database
        msfGameQuarterRepository.saveAndFlush(msfGameQuarter);

        // Get the msfGameQuarter
        restMsfGameQuarterMockMvc.perform(get("/api/msf-game-quarters/{id}", msfGameQuarter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(msfGameQuarter.getId().intValue()))
            .andExpect(jsonPath("$.quarterName").value(DEFAULT_QUARTER_NAME.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingMsfGameQuarter() throws Exception {
        // Get the msfGameQuarter
        restMsfGameQuarterMockMvc.perform(get("/api/msf-game-quarters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMsfGameQuarter() throws Exception {
        // Initialize the database
        msfGameQuarterRepository.saveAndFlush(msfGameQuarter);

        int databaseSizeBeforeUpdate = msfGameQuarterRepository.findAll().size();

        // Update the msfGameQuarter
        MsfGameQuarter updatedMsfGameQuarter = msfGameQuarterRepository.findById(msfGameQuarter.getId()).get();
        // Disconnect from session so that the updates on updatedMsfGameQuarter are not directly saved in db
        em.detach(updatedMsfGameQuarter);
        updatedMsfGameQuarter
            .quarterName(UPDATED_QUARTER_NAME);

        restMsfGameQuarterMockMvc.perform(put("/api/msf-game-quarters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMsfGameQuarter)))
            .andExpect(status().isOk());

        // Validate the MsfGameQuarter in the database
        List<MsfGameQuarter> msfGameQuarterList = msfGameQuarterRepository.findAll();
        assertThat(msfGameQuarterList).hasSize(databaseSizeBeforeUpdate);
        MsfGameQuarter testMsfGameQuarter = msfGameQuarterList.get(msfGameQuarterList.size() - 1);
        assertThat(testMsfGameQuarter.getQuarterName()).isEqualTo(UPDATED_QUARTER_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingMsfGameQuarter() throws Exception {
        int databaseSizeBeforeUpdate = msfGameQuarterRepository.findAll().size();

        // Create the MsfGameQuarter

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMsfGameQuarterMockMvc.perform(put("/api/msf-game-quarters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(msfGameQuarter)))
            .andExpect(status().isBadRequest());

        // Validate the MsfGameQuarter in the database
        List<MsfGameQuarter> msfGameQuarterList = msfGameQuarterRepository.findAll();
        assertThat(msfGameQuarterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMsfGameQuarter() throws Exception {
        // Initialize the database
        msfGameQuarterRepository.saveAndFlush(msfGameQuarter);

        int databaseSizeBeforeDelete = msfGameQuarterRepository.findAll().size();

        // Get the msfGameQuarter
        restMsfGameQuarterMockMvc.perform(delete("/api/msf-game-quarters/{id}", msfGameQuarter.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MsfGameQuarter> msfGameQuarterList = msfGameQuarterRepository.findAll();
        assertThat(msfGameQuarterList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MsfGameQuarter.class);
        MsfGameQuarter msfGameQuarter1 = new MsfGameQuarter();
        msfGameQuarter1.setId(1L);
        MsfGameQuarter msfGameQuarter2 = new MsfGameQuarter();
        msfGameQuarter2.setId(msfGameQuarter1.getId());
        assertThat(msfGameQuarter1).isEqualTo(msfGameQuarter2);
        msfGameQuarter2.setId(2L);
        assertThat(msfGameQuarter1).isNotEqualTo(msfGameQuarter2);
        msfGameQuarter1.setId(null);
        assertThat(msfGameQuarter1).isNotEqualTo(msfGameQuarter2);
    }
}
