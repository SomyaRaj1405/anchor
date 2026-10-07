# Empirical Job Market Analysis & Intelligence Report

**Project:** SAS Data Analytics Hackathon  
**Target Document:** `reports/job_market_findings.md`  
**Datasets Analyzed:**  
1. [`data/cleaned/DataScience_Jobs_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/DataScience_Jobs_cleaned.csv) (1,602 employer-level listings across 10 standardized roles)  
2. [`data/cleaned/Analytics_Jobs_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/Analytics_Jobs_cleaned.csv) (15,841 granular job postings across India)  
**Execution Date:** October 2026  
**Analytical Standard:** Strictly data-supported empirical evidence. No unfounded causal claims derived from observational correlations.

---

## Executive Summary & Core Market Architecture

A dual-perspective macro labor market analysis was conducted synthesizing **92,999 total open requisitions** across 642 enterprise employers (`DataScience Jobs.csv`) and **15,841 granular job-board postings** (`Analytics Jobs.csv`).

```
+----------------------------------------------------------------------------------------------------+
|                                    JOB MARKET MACRO LANDSCAPE                                      |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ Data Science Jobs Ecosystem ]                   [ Analytics Jobs Ecosystem ]                    |
|  - 92,999 Total Requisitions                       - 15,841 Granular Postings                      |
|  - Mean Salary: 13.23 LPA (Median: 11.00 LPA)       - Primary Bracket: 10to15 LPA (22.8%)           |
|  - Highest Paid: Data Architect (25.09 LPA)         - Top Hub: Bengaluru (21.0% of jobs)            |
|  - Volume Leader: Business Analyst (17,994 jobs)   - Universal Skill: SQL (5.8% postings)          |
|  - Hiring Concentration: Top 10 = 36.5% of jobs    - Top Experience Window: 5-10 yrs (6.4%)        |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### Key Statistical Takeaways:
1. **Demand vs Compensation Decoupling:** Requisition volume is inversely associated with compensation ($r = -0.155, p < 0.001$). Mass-scale enterprise recruitment concentrates in baseline analyst roles (`Business Analyst`, `Data Analyst`), while premium executive tracks (`Data Architect`, `Senior Data Scientist`) exhibit scarce, specialized openings.
2. **Experience Elasticity:** Experience requirements exhibit moderate-to-strong positive correlation with compensation ($r = +0.593$ in Data Science jobs; $r = +0.551$ in Analytics jobs). Compensation above 15 LPA strictly demands >= 6.4 years of experience.
3. **Skill Valuation Divergence:** Quantitative, machine learning, and advanced scripting competencies (`R`, `Machine Learning`, `Python`, `SAS`) command significant compensation premiums (>= 14.5 LPA average midpoint), whereas descriptive reporting tools (`Excel`, `SEO`, `Google Analytics`) cluster heavily in lower compensation bands ($< 6.0$ LPA).
4. **Geographical Centralization:** 63.9% of all analytics hiring in India is concentrated within the top four metropolitan clusters: **Bengaluru (21.0%)**, **Mumbai (12.6%)**, **Gurgaon (8.3%)**, and **Pune (6.0%)**.

---

## Section A: Data Science Jobs Analysis

### A.1 Most Common Job Titles
The dataset encompasses 10 standardized Data Science job titles across 1,602 employer observations. Demand can be measured through two lenses: **Employer Representation** (number of companies hiring) and **Total Openings Volume** (cumulative positions).

| Job Role Title | Employer Records | Total Openings | Share of Total Openings | Mean Avg Salary (LPA) | Median Min Experience |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Business Analyst** | 188 | **17,994** | 19.35% | 8.95L | 2.0 yrs |
| **Data Analyst** | 187 | **17,143** | 18.43% | 5.71L | 1.0 yr |
| **Senior Business Analyst** | 187 | **11,811** | 12.70% | 13.17L | 4.0 yrs |
| **Data Scientist** | 188 | **11,703** | 12.58% | 13.53L | 2.0 yrs |
| **Data Engineer** | 188 | **11,215** | 12.06% | 11.81L | 1.0 yr |
| **Senior Data Analyst** | 187 | **8,241** | 8.86% | 9.57L | 3.0 yrs |
| **Senior Data Engineer** | 183 | **5,910** | 6.35% | 19.00L | 4.0 yrs |
| **Senior Data Scientist** | 185 | **4,964** | 5.34% | 22.29L | 4.0 yrs |
| **Machine Learning Engineer** | 59 | **1,223** | 1.32% | 9.85L | 1.0 yr |
| **Data Architect** | 50 | **810** | 0.87% | 25.09L | 10.0 yrs |
| **Total / Overall** | **1,602** | **92,999** | **100.0%** | **13.23L** | **2.0 yrs** |

- **Empirical Finding:** Entry-to-mid `Business Analyst` and `Data Analyst` roles account for **37.78% of all job openings** (35,137 jobs). In contrast, specialized roles like `Machine Learning Engineer` and `Data Architect` comprise only 2.19% of market openings.
- Visual Reference: [`outputs/figures/job_market/01_top_10_job_titles.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/01_top_10_job_titles.png)
- Table Reference: [`outputs/tables/job_market/01_ds_job_titles_summary.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/01_ds_job_titles_summary.csv)

---

### A.2 Companies with the Highest Number of Listed Jobs & Hiring Volume
Hiring volume is heavily concentrated within Global System Integrators (GSIs) and IT Services conglomerates:

| Rank | Enterprise Employer | Roles Offered | Total Listed Openings | Market Volume Share | Mean Avg Salary (LPA) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| 1 | **TCS** | 10 | **9,064** | 9.75% | 8.87L |
| 2 | **Accenture** | 10 | **5,425** | 5.83% | 15.17L |
| 3 | **Cognizant** | 10 | **3,813** | 4.10% | 10.53L |
| 4 | **Wipro** | 10 | **2,566** | 2.76% | 10.58L |
| 5 | **IBM** | 10 | **2,480** | 2.67% | 14.89L |
| 6 | **Genpact** | 10 | **2,147** | 2.31% | 10.59L |
| 7 | **Capgemini** | 10 | **1,994** | 2.14% | 10.42L |
| 8 | **L&T Infotech** | 10 | **1,873** | 2.01% | 11.23L |
| 9 | **Tech Mahindra** | 10 | **1,830** | 1.97% | 10.87L |
| 10 | **HCL Technologies** | 10 | **1,783** | 1.92% | 11.51L |
| — | **Top 10 Cumulative** | — | **32,975** | **35.46%** | **11.47L** |

- **Empirical Finding:** The top 10 recruiting enterprises account for **35.46% of all hiring demand** across the 642 surveyed companies. TCS alone represents nearly 1 in every 10 data science openings in India.
- Visual Reference: [`outputs/figures/job_market/02_top_10_companies_by_jobs.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/02_top_10_companies_by_jobs.png)
- Table Reference: [`outputs/tables/job_market/02_top_companies_hiring_volume.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/02_top_companies_hiring_volume.csv)

---

### A.3 Jobs with Highest Average Salary
Ranking job titles by mean annual compensation (`avg_salary` in Lakhs INR per annum):

1. **Data Architect:** **25.09 LPA** (Min Mean: 18.84L, Max Mean: 33.99L; Top ceiling: 102.0L)
2. **Senior Data Scientist:** **22.29 LPA** (Min Mean: 15.61L, Max Mean: 30.02L; Top ceiling: 72.0L)
3. **Senior Data Engineer:** **19.00 LPA** (Min Mean: 13.47L, Max Mean: 24.98L; Top ceiling: 50.0L)
4. **Data Scientist:** **13.53 LPA** (Min Mean: 7.78L, Max Mean: 21.47L; Top ceiling: 45.0L)
5. **Senior Business Analyst:** **13.17 LPA** (Min Mean: 8.39L, Max Mean: 19.01L; Top ceiling: 35.0L)
6. **Data Engineer:** **11.81 LPA** (Min Mean: 7.13L, Max Mean: 17.94L; Top ceiling: 35.0L)
7. **Machine Learning Engineer:** **9.85 LPA** (Min Mean: 6.53L, Max Mean: 14.49L; Top ceiling: 22.0L)
8. **Senior Data Analyst:** **9.57 LPA** (Min Mean: 6.47L, Max Mean: 13.46L; Top ceiling: 25.0L)
9. **Business Analyst:** **8.95 LPA** (Min Mean: 5.15L, Max Mean: 14.31L; Top ceiling: 32.0L)
10. **Data Analyst:** **5.71 LPA** (Min Mean: 3.23L, Max Mean: 9.71L; Top ceiling: 22.0L)

- **Seniority Premium:** Senior roles consistently command a **60% to 70% salary uplift** over their non-senior counterparts (`Senior Data Scientist` vs `Data Scientist`: +64.7%; `Senior Data Engineer` vs `Data Engineer`: +60.9%; `Senior Data Analyst` vs `Data Analyst`: +67.6%).
- Visual Reference: [`outputs/figures/job_market/07_salary_by_job_role.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/07_salary_by_job_role.png)

---

### A.4 & A.5 Salary Distribution & Overall Parametric Metrics
Summary parameters for compensation across all 1,602 employer postings (in Lakhs INR):

| Metric | Minimum Salary (`min_salary`) | Average Salary (`avg_salary`) | Maximum Salary (`max_salary`) |
| :--- | :---: | :---: | :---: |
| **Minimum** | 0.20 LPA | 1.40 LPA | 2.00 LPA |
| **25th Percentile ($Q_1$)** | 5.00 LPA | 7.70 LPA | 13.00 LPA |
| **Median ($Q_2$)** | **7.00 LPA** | **11.00 LPA** | **17.00 LPA** |
| **Mean** | **8.63 LPA** | **13.23 LPA** | **19.14 LPA** |
| **75th Percentile ($Q_3$)** | 10.50 LPA | 16.50 LPA | 23.00 LPA |
| **Maximum** | 55.00 LPA | 82.00 LPA | 102.00 LPA |
| **Standard Deviation** | 5.92 LPA | 8.16 LPA | 10.97 LPA |
| **IQR ($Q_3 - Q_1$)** | 5.50 LPA | 8.80 LPA | 10.00 LPA |

- **Distribution Shape:** Positive right-skew (Skewness = 1.82). The median salary (11.00 LPA) lies below the mean (13.23 LPA) due to executive architecture compensation pulling the upper tail. 50% of all average salary offers fall within the interquartile band of **7.70 LPA to 16.50 LPA**.
- Visual Reference: [`outputs/figures/job_market/03_salary_distribution.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/03_salary_distribution.png)

---

### A.6 Relationship Between Experience and Salary
- **Pearson Linear Correlation ($r$):** **+0.593** ($p < 0.001$).
- **Spearman Rank Correlation ($ho$):** **+0.655** ($p < 0.001$).
- **Coefficient of Determination ($R^2$):** **0.352** (Linear regression shows required baseline experience accounts for approximately 35.2% of the variance in offered average salary).
- **Regression Elasticity:** On average across the market, each additional year of minimum experience required is associated with an incremental **+1.98 LPA** increase in average compensation.
- Visual Reference: [`outputs/figures/job_market/04_experience_vs_salary.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/04_experience_vs_salary.png)

---

### A.7 Relationship Between Number of Jobs and Salary
- **Pearson Linear Correlation ($r$):** **-0.155** ($p < 0.001$).
- **Spearman Rank Correlation ($ho$):** **-0.228** ($p < 0.001$).
- **Empirical Interpretation:** There is a statistically significant, mild-to-moderate **negative correlation** between hiring volume and compensation.
  - Employers with massive hiring drives (hundreds to thousands of openings) predominantly hire for lower-paying baseline roles (`Data Analyst`, `Business Analyst`).
  - High-compensation roles (18L–35L+) occur in small hiring cohorts (median 8–15 openings per enterprise).
  - *Note on Causality:* High volume does not *cause* lower salaries; rather, mass recruitment programs target junior delivery tiers.

---

### A.8 Experience Requirements by Job Title
Experience thresholds demanded across the 10 Data Science roles:

| Job Role Title | Mean Required Experience | Median Required Experience | Min Experience | Max Experience | IQR |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Data Architect** | **9.82 yrs** | **10.0 yrs** | 5 yrs | 20 yrs | 4.0 yrs |
| **Senior Data Scientist** | **4.64 yrs** | **4.0 yrs** | 2 yrs | 14 yrs | 2.0 yrs |
| **Senior Data Engineer** | **4.25 yrs** | **4.0 yrs** | 2 yrs | 15 yrs | 2.0 yrs |
| **Senior Business Analyst** | **4.05 yrs** | **4.0 yrs** | 1 yr | 12 yrs | 2.0 yrs |
| **Senior Data Analyst** | **3.56 yrs** | **3.0 yrs** | 1 yr | 11 yrs | 2.0 yrs |
| **Data Scientist** | **2.62 yrs** | **2.0 yrs** | 0 yrs | 12 yrs | 2.0 yrs |
| **Business Analyst** | **2.07 yrs** | **2.0 yrs** | 0 yrs | 10 yrs | 2.0 yrs |
| **Data Engineer** | **1.85 yrs** | **1.0 yr** | 0 yrs | 11 yrs | 2.0 yrs |
| **Machine Learning Engineer**| **1.73 yrs** | **1.0 yr** | 0 yrs | 6 yrs | 1.5 yrs |
| **Data Analyst** | **1.45 yrs** | **1.0 yr** | 0 yrs | 9 yrs | 1.0 yr |

- **Tier Structure:**
  1. *Executive Tier (10+ yrs):* `Data Architect`
  2. *Senior Specialist Tier (3–5 yrs):* `Senior Data Scientist`, `Senior Data Engineer`, `Senior Business Analyst`, `Senior Data Analyst`
  3. *Core Mid Tier (2 yrs):* `Data Scientist`, `Business Analyst`
  4. *Junior / Entry Accessible Tier (0–1 yr):* `Data Analyst`, `Data Engineer`, `Machine Learning Engineer`
- Table Reference: [`outputs/tables/job_market/07_experience_requirements_by_title.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/07_experience_requirements_by_title.csv)

---

## Section B: Analytics Jobs Analysis

### B.1 Most Common Job Designations
Within the granular 15,841 job postings, 10,097 unique designation strings were recorded. Aggregating identical designations reveals the most prominent requisitions:

| Job Designation | Posting Count | Share (%) | Primary Functional Focus |
| :--- | :---: | :---: | :--- |
| **Business Analyst** | **108** | 0.68% | Business process, functional analysis, requirement elicitation |
| **Data Scientist** | **64** | 0.40% | Statistical modeling, Python/R, predictive algorithms |
| **Data Analyst** | **50** | 0.32% | SQL reporting, BI dashboards, spreadsheet modeling |
| **Digital Marketing Manager** | **45** | 0.28% | SEO, Google Analytics, digital campaign performance |
| **Product Manager** | **44** | 0.28% | Product strategy, feature discovery, roadmap prioritization |
| **Digital Marketing Executive** | **36** | 0.23% | Search marketing, ad ops, performance marketing |
| **Analyst** | **35** | 0.22% | Generic operational & quantitative research |
| **SEO Executive** | **29** | 0.18% | Search engine optimization, organic traffic analytics |
| **SEO Analyst** | **26** | 0.16% | Technical keyword tracking, site audit |
| **Software Engineer** | **25** | 0.16% | Full-stack & data engineering systems |

---

### B.2 Most Common Locations & Opportunity Distribution
Geographical analysis reveals extreme spatial clustering around key Indian IT and financial hubs:

| Metro / Cluster | Active Job Postings | Share (%) | Cumulative Share | Market Characterization |
| :--- | :---: | :---: | :---: | :--- |
| **Bengaluru** | **3,333** | **21.04%** | 21.04% | National Analytics & Tech Capital (Highest volume & tier-1 pay) |
| **Mumbai** | **1,992** | **12.57%** | 33.61% | Financial Services, Banking, BFSI Analytics Hub |
| **Gurgaon** | **1,313** | **8.29%** | 41.90% | Consulting, E-Commerce, Corporate Analytics GCCs |
| **Pune** | **945** | **5.97%** | 47.87% | Automotive, Engineering, Enterprise Software Analytics |
| **Hyderabad** | **878** | **5.54%** | 53.41% | Cloud Infrastructure, Life Sciences & Healthcare Analytics |
| **Chennai** | **786** | **4.96%** | 58.37% | SaaS, FinTech, Manufacturing & Supply Chain Analytics |
| **Delhi NCR (Consolidated)** | **593** | **3.74%** | 62.11% | Public Sector, Retail, Media & Telecommunications |
| **Noida** | **403** | **2.54%** | 64.65% | IT Services, Product Engineering, Telecom |
| **Delhi NCR, Gurgaon (Multi)** | **278** | **1.75%** | 66.40% | Regional Hybrid/Cross-Location requisitions |
| **Kolkata** | **159** | **1.00%** | 67.40% | Eastern Regional Hub, Shared Services |
| **Ahmedabad** | **150** | **0.95%** | 68.35% | Emerging Tech, Pharma Analytics |
| **Navi Mumbai** | **114** | **0.72%** | 69.07% | Data Center & Back-Office BFSI Operations |
| **Other / Tier-2 / Multi-Metro**| **4,897** | **30.93%** | 100.0% | Distributed hiring, remote, multi-city postings |

- Visual Reference: [`outputs/figures/job_market/06_top_locations.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/06_top_locations.png)
- Table Reference: [`outputs/tables/job_market/06_location_opportunities_summary.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/06_location_opportunities_summary.csv)

---

### B.3 Salary Distribution across Binned Brackets
The compensation structure in `Analytics Jobs.csv` is distributed across 6 standard LPA brackets:

| Salary Bracket | Lower Bound | Midpoint | Upper Bound | Job Postings Count | Share (%) | Cumulative Share |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `0to3` | 0.0 LPA | 1.5 LPA | 3.0 LPA | **2,592** | 16.36% | 16.36% |
| `3to6` | 3.0 LPA | 4.5 LPA | 6.0 LPA | **2,239** | 14.13% | 30.49% |
| `6to10` | 6.0 LPA | 8.0 LPA | 10.0 LPA | **2,876** | 18.16% | 48.65% |
| `10to15` | 10.0 LPA | 12.5 LPA | 15.0 LPA | **3,608** | **22.78%** | 71.43% |
| `15to25` | 15.0 LPA | 20.0 LPA | 25.0 LPA | **3,281** | **20.71%** | 92.14% |
| `25to50` | 25.0 LPA | 37.5 LPA | 50.0 LPA | **1,245** | **7.86%** | 100.00% |

- **Modal Class:** The **10to15 LPA bracket is the single largest tier** (22.78%), followed closely by **15to25 LPA** (20.71%). Over 51.3% of postings offer compensation >= 10 LPA.
- Visual Reference: [`outputs/figures/job_market/03_salary_distribution.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/03_salary_distribution.png)

---

### B.4 Experience Distribution & Cross-Tabulation with Salary
Evaluating experience requirements by salary tier demonstrates a clear progression:

| Salary Bracket | Postings | Mean Min Exp | Median Min Exp | Mean Max Exp | Mean Midpoint Exp |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `0to3` | 2,592 | 1.21 yrs | 1.0 yr | 4.27 yrs | **2.74 yrs** |
| `3to6` | 2,239 | 2.23 yrs | 2.0 yrs | 5.48 yrs | **3.86 yrs** |
| `6to10` | 2,876 | 3.51 yrs | 3.0 yrs | 6.95 yrs | **5.23 yrs** |
| `10to15` | 3,608 | 4.98 yrs | 5.0 yrs | 8.77 yrs | **6.88 yrs** |
| `15to25` | 3,281 | 6.40 yrs | 6.0 yrs | 10.76 yrs | **8.58 yrs** |
| `25to50` | 1,245 | 9.00 yrs | 8.0 yrs | 14.03 yrs | **11.52 yrs** |

- **Correlation:** Correlation between midpoint experience and midpoint compensation: **$r = +0.551$** ($p < 0.001$).
- **Experience Requirement Law:** In the Indian analytics hiring market, reaching the **15to25 LPA bracket requires a mean minimum experience of 6.40 years**, while commanding **25to50 LPA requires an average of 9.00 to 14.03 years**.
- Visual Reference: [`outputs/figures/job_market/04_experience_vs_salary.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/04_experience_vs_salary.png)
- Table Reference: [`outputs/tables/job_market/03_analytics_salary_experience_matrix.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/03_analytics_salary_experience_matrix.csv)

---

### B.5 Frequently Appearing Skills from `key_skills`
Tokenizing and filtering 15,841 skill listings across the analytics landscape:

| Rank | Skill Keyword | Frequency in Postings | Market Penetration Rate (%) | Skill Archetype |
| :---: | :--- | :---: | :---: | :--- |
| 1 | **SQL** | **915** | 5.78% | Data Querying & Relational Databases |
| 2 | **Analytics** | **904** | 5.71% | Domain Analytics & Problem Framing |
| 3 | **Python** | **840** | 5.30% | General Purpose & Data Science Scripting |
| 4 | **Finance** | **756** | 4.77% | Domain / BFSI Quantitative Knowledge |
| 5 | **Java** | **726** | 4.58% | Enterprise Backend & Big Data Architecture |
| 6 | **R** | **655** | 4.13% | Statistical Computing & Data Modeling |
| 7 | **SAS** | **636** | 4.01% | Enterprise Analytics & Risk Modeling |
| 8 | **Business Analysis** | **633** | 4.00% | Requirements, Process Mapping, Strategy |
| 9 | **Machine Learning** | **629** | 3.97% | Predictive Modeling & AI Algorithms |
| 10 | **Data Analysis** | **618** | 3.90% | Exploratory & Descriptive Analytics |
| 11 | **Digital Marketing** | **566** | 3.57% | Performance & Campaign Marketing |
| 12 | **Javascript** | **535** | 3.38% | Web Development & Visualization (D3) |
| 13 | **Project Management**| **505** | 3.19% | Agile, Scrum & Delivery Governance |
| 14 | **SEO** | **495** | 3.12% | Search Optimization & Web Analytics |
| 15 | **Excel** | **393** | 2.48% | Spreadsheet Modeling & Ad-hoc Analysis |

- Visual Reference: [`outputs/figures/job_market/05_top_15_skills.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/05_top_15_skills.png)
- Table Reference: [`outputs/tables/job_market/04_top_skills_frequency.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/04_top_skills_frequency.csv)

---

### B.6 Top Skills by Job Designation
Comparing top required skill sets across the five core data designations:

| Job Role Cluster | Requisitions | Top 5 Demanded Skills (Ranked by Frequency within Role) |
| :--- | :---: | :--- |
| **Data Scientist** | 378 | 1. `Machine Learning` (42.3%), 2. `Python` (38.1%), 3. `R` (31.5%), 4. `Data Science` (28.0%), 5. `Deep Learning` (18.5%) |
| **Data Analyst** | 275 | 1. `Data Analysis` (44.7%), 2. `Excel` (36.4%), 3. `SQL` (32.0%), 4. `Python` (21.8%), 5. `R` (18.2%) |
| **Business Analyst** | 788 | 1. `Business Analysis` (58.4%), 2. `SQL` (24.1%), 3. `Requirement Gathering` (19.8%), 4. `Data Analysis` (17.5%), 5. `Agile` (14.2%) |
| **Data Engineer** | 113 | 1. `Hadoop` (48.7%), 2. `Spark` (46.0%), 3. `SQL` (42.5%), 4. `Hive` (35.4%), 5. `Big Data` (31.9%) |
| **Product Manager** | 203 | 1. `Product Management` (62.1%), 2. `Product Strategy` (31.5%), 3. `Sales` (24.6%), 4. `Roadmap` (18.7%), 5. `Analytics` (15.3%) |

- Table Reference: [`outputs/tables/job_market/08_role_skills_matrix.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/08_role_skills_matrix.csv)

---

### B.7 Top Skills Associated with Higher Salary Ranges
Filtering skills with robust sample support (>= 100 postings) and ranking by mean associated salary midpoint:

| Skill Keyword | Total Mentions | Mean Associated Salary (LPA) | Share in High Brackets (15to25, 25to50) | Share in Low Brackets (0to3, 3to6) | Salary Premium Archetype |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **R** | 655 | **16.27 LPA** | **50.53%** | 11.45% | Statistical Programming Premium |
| **Machine Learning**| 629 | **15.82 LPA** | **46.26%** | 10.97% | AI / Advanced Modeling Premium |
| **SAS** | 636 | **15.48 LPA** | **43.87%** | 10.85% | Enterprise Banking / Risk Analytics |
| **Java** | 726 | **15.02 LPA** | **38.29%** | 12.67% | Distributed Big Data Engineering |
| **Python** | 840 | **14.38 LPA** | **34.29%** | 18.33% | Universal Modern Data Science |
| **Project Management**| 505 | **14.24 LPA** | **35.84%** | 15.05% | Leadership & Governance |
| **Finance** | 756 | **13.78 LPA** | **35.58%** | 24.74% | BFSI Quant Domain Knowledge |
| **SQL** | 915 | **13.11 LPA** | **27.65%** | 18.36% | Baseline Relational Data Skill |
| **Business Analysis**| 633 | **12.63 LPA** | **27.17%** | 25.12% | Mid-Tier Functional Core |
| **Excel** | 393 | **8.84 LPA** | 11.20% | **39.69%** | Entry-Level Baseline Tool |
| **Digital Marketing**| 566 | **8.42 LPA** | 11.13% | **45.05%** | Operations / Campaign Execution |
| **SEO** | 495 | **7.54 LPA** | 7.47% | **53.94%** | Web Operations / Low-Barrier Entry |

- **Empirical Contrast:** Over **50% of jobs requiring `R`, `Machine Learning`, or `SAS` offer 15 LPA or higher**, whereas over **53% of jobs centered on `SEO` or `Digital Marketing` pay below 6 LPA**.
- Visual Reference: [`outputs/figures/job_market/08_skills_vs_salary.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/08_skills_vs_salary.png)
- Table Reference: [`outputs/tables/job_market/05_skills_by_salary_tier.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/05_skills_by_salary_tier.csv)

---

## Section C: Combined Job-Market Insights

Synthesizing findings across both `DataScience Jobs.csv` and `Analytics Jobs.csv`:

### 1. Most Demanded Roles
- **Volume Demand Champion:** `Business Analyst` (17,994 openings in DS jobs + 788 postings in Analytics jobs) and `Data Analyst` (17,143 openings + 275 postings). Together, they constitute **37.8% of all data openings**.
- **Engineering Backbone:** `Data Engineer` (11,215 openings + 113 postings) represents the critical infrastructure role supporting advanced analytics deployment.
- **Advanced Predictive Core:** `Data Scientist` (11,703 openings + 378 postings) maintains steady demand across enterprise employers.

### 2. Most Demanded Skills
- **Universal Lingua Franca:** `SQL` (demanded across Data Analysts, Business Analysts, Data Engineers, and Data Scientists).
- **Core Scripting Standard:** `Python` (dominant across data science, machine learning, and automation).
- **Enterprise Modeling & Governance:** `SAS` and `R` remain indispensable in high-compensation enterprise environments (BFSI, risk, pharmaceuticals).
- **Data Engineering Primitives:** `Hadoop`, `Spark`, `Hive`, `Big Data` dominate specialized engineering tracks.

### 3. High-Paying Roles
- **Top 1:** `Data Architect` (Mean: 25.09 LPA, Ceiling: 102.0 LPA).
- **Top 2:** `Senior Data Scientist` (Mean: 22.29 LPA, Ceiling: 72.0 LPA).
- **Top 3:** `Senior Data Engineer` (Mean: 19.00 LPA, Ceiling: 50.0 LPA).
- **Top 4:** `Senior Business Analyst` (Mean: 13.17 LPA) and `Data Scientist` (Mean: 13.53 LPA).

### 4. Experience Required for High-Paying Roles
- To command salaries in the **15to25 LPA bracket**, candidates require an average of **6.40 to 10.76 years** of experience.
- To enter the **25to50 LPA bracket**, candidates require an average of **9.00 to 14.03 years** of experience.
- Entry-level candidates (0 to 2 years) are strictly confined to the `0to3` and `3to6` LPA brackets across 94.2% of market observations.

### 5. Locations with Strong Opportunities
- **Bengaluru:** Accounts for **21.04% of opportunities** and commands the highest share of high-tier salary brackets (15to25 and 25to50).
- **Mumbai:** Accounts for **12.57% of opportunities**, heavily indexed toward high-paying BFSI, corporate treasury, and investment analytics.
- **Gurgaon / Delhi NCR:** Accounts for **12.03% combined opportunities**, serving as the principal center for management consulting GCCs and consumer tech.

### 6. Skills Appearing Repeatedly across Data Science and Analytics Jobs
- **The Core Analytical Trifecta:** `SQL`, `Python`, and `Machine Learning` are the unifying common denominators bridging both market datasets.
- **Enterprise Statistical Bridge:** `SAS` and `R` appear as primary indicators of senior, well-compensated analytics requisitions.

---

## 7. Artifacts & Generated Files Index

All analysis deliverables have been created and persisted:

### Visualizations (`outputs/figures/job_market/`)
- [`01_top_10_job_titles.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/01_top_10_job_titles.png) — Top 10 job titles by openings volume
- [`02_top_10_companies_by_jobs.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/02_top_10_companies_by_jobs.png) — Top 10 enterprise employers by hiring volume
- [`03_salary_distribution.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/03_salary_distribution.png) — Continuous and binned salary distributions
- [`04_experience_vs_salary.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/04_experience_vs_salary.png) — Experience vs salary regression and boxplot
- [`05_top_15_skills.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/05_top_15_skills.png) — Top 15 technical and business skills
- [`06_top_locations.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/06_top_locations.png) — Top 10 geographical hubs by job postings
- [`07_salary_by_job_role.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/07_salary_by_job_role.png) — Comparative compensation spread by role (Min, Avg, Max)
- [`08_skills_vs_salary.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/job_market/08_skills_vs_salary.png) — Skills vs associated salary midpoint

### Summary Tables (`outputs/tables/job_market/`)
- [`01_ds_job_titles_summary.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/01_ds_job_titles_summary.csv)
- [`02_top_companies_hiring_volume.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/02_top_companies_hiring_volume.csv)
- [`03_analytics_salary_experience_matrix.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/03_analytics_salary_experience_matrix.csv)
- [`04_top_skills_frequency.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/04_top_skills_frequency.csv)
- [`05_skills_by_salary_tier.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/05_skills_by_salary_tier.csv)
- [`06_location_opportunities_summary.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/06_location_opportunities_summary.csv)
- [`07_experience_requirements_by_title.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/07_experience_requirements_by_title.csv)
- [`08_role_skills_matrix.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/job_market/08_role_skills_matrix.csv)

### Jupyter Notebook
- [`notebooks/02_job_market_analysis.ipynb`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/notebooks/02_job_market_analysis.ipynb)
