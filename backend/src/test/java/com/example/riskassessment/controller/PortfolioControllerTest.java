package com.example.riskassessment.controller;

import com.example.riskassessment.model.Portfolio;
import com.example.riskassessment.service.PortfolioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PortfolioController.class)
public class PortfolioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PortfolioService portfolioService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllPortfolios() throws Exception {
        Portfolio portfolio1 = new Portfolio("Client 1", "Description 1");
        Portfolio portfolio2 = new Portfolio("Client 2", "Description 2");
        List<Portfolio> portfolios = Arrays.asList(portfolio1, portfolio2);

        when(portfolioService.getAllPortfolios()).thenReturn(portfolios);

        mockMvc.perform(get("/api/portfolios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].clientName").value("Client 1"))
                .andExpect(jsonPath("$[1].clientName").value("Client 2"));
    }

    @Test
    public void testCreatePortfolio() throws Exception {
        Portfolio portfolio = new Portfolio("Client 1", "Description 1");

        when(portfolioService.createPortfolio(any(Portfolio.class))).thenReturn(portfolio);

        mockMvc.perform(post("/api/portfolios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(portfolio)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientName").value("Client 1"));
    }
}
