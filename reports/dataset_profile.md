# Comprehensive Dataset Profiling Report

**Project:** SAS Data Analytics Hackathon  
**Target File:** `reports/dataset_profile.md`  
**Generated Date:** October 2026  
**Status:** Data Profiling Complete (Source Datasets Untouched & Preserved)

---

## Executive Summary & Overview

An exhaustive exploratory audit and profiling was conducted across all four hackathon datasets stored in the `data/` directory:
1. `DataScience Jobs.csv` — Macro-level hiring, compensation, and volume metrics across 642 leading enterprise employers for 10 standardized Data Science roles (2024–2025).
2. `Analytics Jobs.csv` — Granular job-board posting data spanning 15,841 listings in the analytics landscape, detailing job designations, required experience windows, unstructured skill keywords, locations, and salary bands (2024–2025).
3. `JDS Skill Traits.xlsx` — Micro-level competency evaluations of Junior / Entry-Level Data Scientists across five technical domains (scale 1–5), benchmarked against performance salary hike outcomes (`0` = Low, `1` = High).
4. `SDS Personality Traits.xlsx` — Micro-level psychometric trait profiling of Senior / Customer-Facing Data Scientists based on the Big Five Personality Model & EPQ, mapped to workplace success classifications (`0` = Low, `1` = High).

### Comparative Dataset Dimension Matrix

| Dataset | File Format | Rows | Columns | Missing Values (Total Cells) | Duplicate Full Rows | Non-Unique ID Rows | Primary Target Variable |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **DataScience Jobs.csv** | CSV | 1,602 | 8 | 0 (0.00%) | 0 | 276 rows (134 IDs) | *None (Aggregated market data)* |
| **Analytics Jobs.csv** | CSV | 15,841 | 8 | 15,520 (12.25%) | 0 | 0 (`s_no` is unique) | `salary` (Binned brackets) |
| **JDS Skill Traits.xlsx** | XLSX | 139 | 7 | 0 (0.00%) | 0 | 4 rows (2 IDs) | `salary_hike_high_or_low` (Binary) |
| **SDS Personality Traits.xlsx** | XLSX | 161 | 7 | 0 (0.00%) | 0 | 18 rows (9 IDs) | `success_ classification_ high_low` (Binary) |

---

## 1. Dataset Profile: `DataScience Jobs.csv`

### 1.1 Dimensions
- **Number of Rows:** 1,602
- **Number of Columns:** 8

### 1.2 Exact Column Inventory & Data Types
The columns below are listed **exactly** as they appear in the dataset:

| # | Actual Column Name | Pandas Dtype | Inferred / Semantic Type | Description & Role |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `reference_no` | `int64` | Identifier / Discrete Numerical | Batch reference key from scraping/aggregation; non-unique |
| 2 | `company_name` | `object` (`string`) | Nominal Categorical | Recruiting company name (642 distinct entities) |
| 3 | `job_title` | `object` (`string`) | Nominal Categorical | Standardized job role title (10 unique roles) |
| 4 | `min_experience` | `int64` | Discrete Numerical (Ratio) | Minimum years of experience required (range: 0–21 yrs) |
| 5 | `avg_salary` | `object` (`string`) | Continuous Numerical (Currency) | Average salary in Lakhs INR (e.g., `'7.8L'`); stored with `'L'` suffix |
| 6 | `min_salary` | `object` (`string`) | Continuous Numerical (Currency) | Minimum salary in Lakhs INR (e.g., `'4.5L'`); stored with `'L'` suffix |
| 7 | `max_salary` | `object` (`string`) | Continuous Numerical (Currency) | Maximum salary in Lakhs INR (e.g., `'16.0L'`); stored with `'L'` suffix |
| 8 | `num_of_jobs` | `int64` | Discrete Numerical (Count) | Number of job postings by the company for that role |

### 1.3 Missing Values Analysis
- **Total Missing Cells:** 0 out of 12,816 total cells (0.00%).
- All columns have 100% completeness. No nulls, blanks, or hidden sentinel strings (`'NA'`, `'None'`, `'null'`) detected.

| Column Name | Missing Count | Missing Percentage |
| :--- | :---: | :---: |
| `reference_no` | 0 | 0.00% |
| `company_name` | 0 | 0.00% |
| `job_title` | 0 | 0.00% |
| `min_experience` | 0 | 0.00% |
| `avg_salary` | 0 | 0.00% |
| `min_salary` | 0 | 0.00% |
| `max_salary` | 0 | 0.00% |
| `num_of_jobs` | 0 | 0.00% |

### 1.4 Duplicate Rows Analysis
- **Full Row Duplicates:** **0** (Every single row has a unique combination of attributes across the table).
- **ID Duplicates (`reference_no`):** **276 rows** share non-unique `reference_no` values across **134 unique IDs**. 
  - Eight IDs appear 3 times (e.g., `reference_no = 2744` appears for Oracle, Colgate Palmolive, and Ericsson).
  - *Key Finding:* `reference_no` is **not a valid primary key**.
- **Natural Composite Key:** The composite pair `(company_name, job_title)` is **100% unique** across all 1,602 rows (0 duplicates). Every record represents an employer offering a specific role.

### 1.5 Unique Value Counts
| Column Name | Unique Value Count | Min Observed | Max Observed | Top / Dominant Value (Frequency) |
| :--- | :---: | :---: | :---: | :--- |
| `reference_no` | 1,460 | 1003 | 9993 | 2744 (3 occurrences), 5007 (3 occurrences) |
| `company_name` | 642 | — | — | Top recruiters: Infosys (10), TCS (10), Accenture (10), IBM (10) |
| `job_title` | 10 | — | — | `Data Scientist` (188), `Business Analyst` (188), `Data Engineer` (188) |
| `min_experience` | 18 | 0 yrs | 21 yrs | 2 yrs (618 rows, 38.58%), 5 yrs (258 rows, 16.10%) |
| `avg_salary` | 305 | 1.4L | 82.0L | 10.0L (32 rows), 12.0L (28 rows) |
| `min_salary` | 197 | 0.2L | 55.0L | 5.0L (62 rows), 6.0L (61 rows) |
| `max_salary` | 304 | 2.0L | 102.0L | 15.0L (48 rows), 20.0L (45 rows) |
| `num_of_jobs` | 220 | 3 | 4,200 | 7 postings (74 rows), 8 postings (69 rows) |

### 1.6 Five Sample Records
| reference_no | company_name | job_title | min_experience | avg_salary | min_salary | max_salary | num_of_jobs |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 7834 | TCS | Data Scientist | 2 | 7.8L | 4.5L | 16.0L | 841 |
| 7862 | Accenture | Data Scientist | 2 | 12.8L | 5.8L | 23.0L | 501 |
| 5925 | IBM | Data Scientist | 2 | 13.4L | 5.3L | 25.0L | 394 |
| 7578 | Cognizant | Data Scientist | 2 | 9.8L | 5.0L | 18.0L | 318 |
| 7177 | Capgemini | Data Scientist | 2 | 8.6L | 4.8L | 14.6L | 300 |

### 1.7 Suspicious, Inconsistent, & Anomalous Values
1. **String Format in Numeric Currency Fields:** `avg_salary`, `min_salary`, and `max_salary` are encoded as strings with an appended `'L'` character (standing for Lakhs INR: 1L = 100,000 INR). These must be stripped and cast to float before statistical modeling.
2. **Mathematical Consistency Confirmed:** Across all 1,602 rows, the logical rule `min_salary <= avg_salary <= max_salary` holds without a single violation (0 anomalies).
3. **Severe Right Skew & Outliers in `num_of_jobs`:** Median is 22 jobs, but the maximum reaches **4,200 jobs** (TCS Data Analyst). 164 rows exceed the $Q_3 + 1.5 \times \text{IQR}$ outlier fence.
4. **Outliers in Salary:** Maximum salary reaches **102.0L** (Max) and **82.0L** (Avg) for executive architect positions.
5. **Non-Unique `reference_no`:** 276 rows have collided IDs originating from batch concatenation.

### 1.8 Categorical and Numerical Breakdown
- **Categorical Columns (2):** `company_name` (Nominal), `job_title` (Nominal).
- **Numerical Columns (6):** `reference_no` (Discrete ID), `min_experience` (Discrete), `num_of_jobs` (Discrete Count), plus `avg_salary`, `min_salary`, `max_salary` (Continuous monetary values once `'L'` suffix is parsed).

### 1.9 Column Interpretations
- `reference_no`: Source row identifier from original web scrapers or database batch extracts.
- `company_name`: The hiring organization or enterprise seeking analytics talent.
- `job_title`: Standardized role taxonomy representing the primary job specialization.
- `min_experience`: Minimum baseline career experience (in years) needed to qualify for the position.
- `avg_salary`: Weighted mean annual compensation offered for the role by that employer (in Lakhs INR).
- `min_salary`: Floor/entry annual compensation offered for the role (in Lakhs INR).
- `max_salary`: Ceiling/top-tier annual compensation offered for the role (in Lakhs INR).
- `num_of_jobs`: Aggregated count of active job openings posted by the enterprise for this specific title.

---

## 2. Dataset Profile: `Analytics Jobs.csv`

### 2.1 Dimensions
- **Number of Rows:** 15,841
- **Number of Columns:** 8

### 2.2 Exact Column Inventory & Data Types
The columns below are listed **exactly** as they appear in the dataset:

| # | Actual Column Name | Pandas Dtype | Inferred / Semantic Type | Description & Role |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `s_no` | `int64` | Identifier / Sequence | Serial primary key ranging from 1 to 15,841 |
| 2 | `experience` | `object` (`string`) | Binned Interval Categorical | Experience range required (e.g., `'5-10 yrs'`, `'0-0 yrs'`) |
| 3 | `job_description` | `object` (`string`) | Unstructured Free Text | Extended narrative of responsibilities, duties, requirements |
| 4 | `job_desig` | `object` (`string`) | Nominal Text / Categorical | Job title or designation as posted by the employer |
| 5 | `job_type` | `object` (`string`) | Sparse Nominal Categorical | Job classification tag; 75.82% missing, single-domain variants |
| 6 | `key_skills` | `object` (`string`) | Multi-label Comma-Separated Text | Delimited list of technical skills, platforms, tools |
| 7 | `location` | `object` (`string`) | Multi-label Geographic Text | One or more metro locations where the job is based |
| 8 | `salary` | `object` (`string`) | Ordinal Binned Categorical | Annual salary bracket in Lakhs INR (e.g., `'10to15'`) |

### 2.3 Missing Values Analysis
- **Total Missing Cells:** 15,520 out of 126,728 total cells (12.25%).

| Column Name | Missing Count | Missing Percentage | Impact & Remarks |
| :--- | :---: | :---: | :--- |
| `s_no` | 0 | 0.00% | Complete (100%) |
| `experience` | 0 | 0.00% | Complete (100%) |
| `job_description` | 3,508 | 22.15% | Moderate sparsity; 3,508 listings lack full narrative description |
| `job_desig` | 0 | 0.00% | Complete (100%) |
| `job_type` | 12,011 | 75.82% | Severe sparsity; more than three quarters of rows are null |
| `key_skills` | 1 | 0.01% | Single missing record at `s_no = 7810` |
| `location` | 0 | 0.00% | Complete (100%) |
| `salary` | 0 | 0.00% | Complete (100%) |

### 2.4 Duplicate Rows Analysis
- **Full Row Duplicates (including `s_no`):** **0** (`s_no` increments sequentially from 1 to 15,841).
- **Duplicate Job Postings (excluding `s_no`):** **1,001 redundant postings** (1,597 total rows belong to duplicate clusters).
  - Identical listings were ingested multiple times with differing sequential `s_no` values.
  - For example, identical listings for Oracle EBS Consultants or Servicenow Developers appear 2 to 4 times.

### 2.5 Unique Value Counts
| Column Name | Unique Value Count | Top / Dominant Value | Frequency (Share %) |
| :--- | :---: | :--- | :--- |
| `s_no` | 15,841 | Sequential integers 1 to 15,841 | 1 each (100%) |
| `experience` | 128 | `'5-10 yrs'` (1,010), `'2-5 yrs'` (964), `'3-8 yrs'` (750) | Top 3 = 17.20% |
| `job_description` | 7,859 (excl. null) | Varied corporate job briefs | Most common repeated description: 46 times |
| `job_desig` | 10,097 | `'Data Analyst'`, `'Business Analyst'`, `'Data Engineer'` | Highly granular titles |
| `job_type` | 5 (excl. null) | `'Analytics'` | 2,971 rows (77.55% of non-null) |
| `key_skills` | 11,155 (excl. null)| Multi-skill token lists | Distinct skill sets |
| `location` | 1,355 | `'Bengaluru'` (3,333), `'Mumbai'` (1,992), `'Gurgaon'` (1,313) | Top 3 cities = 41.90% |
| `salary` | 6 | `'10to15'` (3,608), `'15to25'` (3,281), `'6to10'` (2,876) | Binned compensation bands |

### 2.6 Five Sample Records
*(Note: `job_description` and `key_skills` are truncated for clean tabular display)*

| s_no | experience | job_description (truncated) | job_desig | job_type | key_skills (truncated) | location | salary |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- | :---: |
| 1 | 6-10 yrs | Must be knowledgeable and experienced in relational database... | Oracle EBS Technical Consultant | *NaN* | Oracle SQL, PLSQL, PL, Oracle Forms, Oracle Reports... | Bengaluru, Chennai | 6to10 |
| 2 | 8-12 yrs | - Experience in building scalable and highly available distr... | Staff Software Engineer - Object Oriented Analysis & Design | *NaN* | Javascript, HTML, JQuery, Web Development, Play Fr... | Bengaluru | 10to15 |
| 3 | 3-8 yrs | *NaN* | Servicenow Developer | *NaN* | SNOW, Servicenow, Servicenow Developer | Hyderabad, Pune | 0to3 |
| 4 | 3-6 yrs | Our software engineers at Fiserv bring an open and crea... | Software Development Engineering, Analyst | *NaN* | QTP, Flex, LAN, Application support, Performance t... | Pune | 6to10 |
| 5 | 5-10 yrs | - More than 5 years experience in Hypermesh for Finite Eleme... | NVH Engineer - Nastran/ Ls-dyna | *NaN* | HyperMesh, LS - DYNA, NASTRAN, Abaqus, Fatigue, Du... | Mumbai, Bengaluru, Hyderabad, Pune, Delhi | 10to15 |

### 2.7 Suspicious, Inconsistent, & Anomalous Values
1. **Severe Inconsistency and Redundancy in `job_type`:**
   - 75.82% of values are missing (`NaN`).
   - The remaining 3,830 non-null values consist **entirely** of 5 case/spelling variants of the single word "Analytics":
     - `'Analytics'`: 2,971 (77.57%)
     - `'analytics'`: 746 (19.48%)
     - `'ANALYTICS'`: 64 (1.67%)
     - `'analytic'`: 30 (0.78%)
     - `'Analytic'`: 19 (0.50%)
   - *Conclusion:* This column contains 0 true classification diversity. It carries near-zero predictive information unless imputed or unified as an indicator flag.
2. **Whitespace Padding:**
   - Leading/trailing whitespace found in:
     - `job_description`: 578 records
     - `job_desig`: 50 records
     - `key_skills`: 6 records
3. **Compound Multi-City Values in `location`:**
   - 1,355 unique strings include compound entries such as `'Mumbai, Bengaluru, Hyderabad, Pune, Delhi'`. Requires tokenization / one-hot multi-label parsing.
4. **Salary Distribution is Strictly Binned:**
   - The `salary` column is not numeric; it contains exactly 6 discrete ordinal brackets in Lakhs INR:
     - `'0to3'`: 2,592 (16.36%)
     - `'3to6'`: 2,239 (14.13%)
     - `'6to10'`: 2,876 (18.16%)
     - `'10to15'`: 3,608 (22.78%)
     - `'15to25'`: 3,281 (20.71%)
     - `'25to50'`: 1,245 (7.86%)
5. **Zero-Experience Formatting (`0-0 yrs`):**
   - 124 records have `'0-0 yrs'` indicating fresher roles. Experience values span from 0 to 30 years (`23-30 yrs`).

### 2.8 Categorical and Numerical Breakdown
- **Categorical Columns (7):**
  - `experience` (Ordinal interval strings)
  - `job_description` (Unstructured text)
  - `job_desig` (High-cardinality nominal text)
  - `job_type` (Sparse nominal categorical)
  - `key_skills` (Multi-label token strings)
  - `location` (Multi-label geographic categorical)
  - `salary` (Ordinal binned categorical)
- **Numerical Columns (1):**
  - `s_no` (Sequential integer index)
  *(Note: Numerical features such as `min_exp`, `max_exp`, `avg_exp`, and skill counts can be engineered from `experience` and `key_skills`).*

### 2.9 Column Interpretations
- `s_no`: Unique sequential serial row index for each job posting.
- `experience`: Required experience range (e.g., `'3-6 yrs'`) demanded by the recruiter.
- `job_description`: Narrative text detailing roles, responsibilities, prerequisites, and organizational summary.
- `job_desig`: Official job designation title assigned to the requisition.
- `job_type`: High-level domain taxonomy tag (consistently "Analytics" across all labeled instances).
- `key_skills`: Comma-delimited technical tags, programming languages, and industry toolsets.
- `location`: Metros/cities where the position is located or available for remote/hybrid hiring.
- `salary`: Target compensation bracket in Lakhs INR per annum (LPA).

---

## 3. Dataset Profile: `JDS Skill Traits.xlsx`

### 3.1 Dimensions
- **Number of Rows:** 139
- **Number of Columns:** 7

### 3.2 Exact Column Inventory & Data Types
The columns below are listed **exactly** as they appear in the dataset:

| # | Actual Column Name | Pandas Dtype | Inferred / Semantic Type | Description & Role |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `id` | `int64` | Identifier | Junior Data Scientist Employee / Candidate ID |
| 2 | `big_data_skills` | `float64` | Continuous Numerical Rating | Big data competence score (Scale 1.0–5.0) |
| 3 | `maths-stats_skills` | `float64` | Continuous Numerical Rating | Quantitative, math & statistics score (Scale 1.0–5.0; note hyphen) |
| 4 | `coding_skills` | `float64` | Continuous Numerical Rating | Programming score (SAS, Python, SQL; Scale 1.0–5.0) |
| 5 | `ai_and_ml_skills` | `float64` | Continuous Numerical Rating | Machine Learning & AI score (Scale 1.0–5.0) |
| 6 | `dashboard_and_storytelling_skills` | `float64` | Continuous Numerical Rating | BI reporting, visualization & communication score (Scale 1.0–5.0) |
| 7 | `salary_hike_high_or_low` | `int64` | Binary Categorical Indicator | Target variable: `1` = High salary hike, `0` = Low salary hike |

### 3.3 Missing Values Analysis
- **Total Missing Cells:** 0 out of 973 total cells (0.00%).
- 100% complete dataset. Zero nulls or blank cells.

### 3.4 Duplicate Rows Analysis
- **Full Row Duplicates:** **0** (All 139 rows are distinct across the 7 columns).
- **Duplicate ID Collisions:** **2 IDs appear twice (4 rows total)**:
  - **ID `2223`:** Row 58 vs. Row 101:
    - Row 58: `big_data`: 2.4, `maths`: 3.4, `coding`: 3.1, `ai_ml`: 4.3, `storytelling`: 2.5 | Target: `0`
    - Row 101: `big_data`: 3.3, `maths`: 3.8, `coding`: 5.0, `ai_ml`: 3.4, `storytelling`: 2.5 | Target: `0`
    - *Observation:* Different evaluations for same employee ID, but consistent outcome (`0`).
  - **ID `3291` (CRITICAL CONTRADICTION):** Row 3 vs. Row 29:
    - Row 3: `big_data`: 4.4, `maths`: 3.0, `coding`: 3.3, `ai_ml`: 4.6, `storytelling`: 2.3 | **Target: `0`**
    - Row 29: `big_data`: 4.8, `maths`: 4.5, `coding`: 5.0, `ai_ml`: 4.8, `storytelling`: 5.0 | **Target: `1`**
    - *Observation:* Identical ID assigned to two radically different skill profiles and **contradicting hike outcomes (0 vs 1)**!

### 3.5 Unique Value Counts & Descriptive Statistics
| Column Name | Unique Count | Mean | Std Dev | Min | Median | Max |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `id` | 137 | 2958.46 | 604.54 | 2007 | 2963 | 4000 |
| `big_data_skills` | 28 | 3.85 | 0.85 | 2.30 | 3.80 | 5.00 |
| `maths-stats_skills` | 27 | 4.29 | 0.84 | 2.20 | 4.60 | 5.00 |
| `coding_skills` | 22 | 4.27 | 0.89 | 2.20 | 4.60 | 5.00 |
| `ai_and_ml_skills` | 22 | 4.57 | 0.67 | 2.20 | 4.90 | 5.00 |
| `dashboard_and_storytelling_skills` | 21 | 4.36 | 0.93 | 2.30 | 5.00 | 5.00 |
| `salary_hike_high_or_low` | 2 | 0.53 | 0.50 | 0 | 1 | 1 |

### 3.6 Five Sample Records
| id | big_data_skills | maths-stats_skills | coding_skills | ai_and_ml_skills | dashboard_and_storytelling_skills | salary_hike_high_or_low |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 2809 | 3.6 | 4.0 | 4.5 | 4.8 | 5.0 | 1 |
| 2231 | 5.0 | 3.8 | 3.3 | 5.0 | 4.4 | 0 |
| 3522 | 4.1 | 3.8 | 4.4 | 4.2 | 5.0 | 1 |
| 3291 | 4.4 | 3.0 | 3.3 | 4.6 | 2.3 | 0 |
| 3424 | 2.3 | 2.3 | 2.6 | 3.3 | 3.0 | 0 |

### 3.7 Suspicious, Inconsistent, & Anomalous Values
1. **Target Contradiction on ID Collision:** As documented, candidate ID `3291` has conflicting target outcomes (`0` in Row 3 and `1` in Row 29). This will cause label noise if `id` is treated as a unique subject.
2. **Column Naming Hyphen:** `maths-stats_skills` contains a hyphen (`-`) rather than standard underscore (`_`), requiring caution when referencing in SQL or Python dot notation.
3. **Truncated Skill Distribution (Ceiling Effect):** Minimum scores across all skill dimensions never drop below 2.2, while the 75th percentile is pinned at 5.0 across four skills. Distributions are moderately left-skewed (high performers predominate).
4. **Target Balance:** The target variable is well-balanced: 73 High hikes (52.52%) vs. 66 Low hikes (47.48%).

### 3.8 Feature-to-Target Linear Correlations
- `dashboard_and_storytelling_skills`: **+0.554** (Strongest driver of high salary hikes)
- `maths-stats_skills`: **+0.524** (Second strongest driver)
- `coding_skills`: **+0.444**
- `ai_and_ml_skills`: **+0.405**
- `big_data_skills`: **+0.112** (Weakest driver of high salary hikes)

### 3.9 Categorical and Numerical Breakdown
- **Categorical Columns (1):** `salary_hike_high_or_low` (Binary target: `0` = Low, `1` = High).
- **Numerical Columns (6):** `id` (Discrete ID), `big_data_skills`, `maths-stats_skills`, `coding_skills`, `ai_and_ml_skills`, `dashboard_and_storytelling_skills` (Continuous evaluation scores).

### 3.10 Column Interpretations
- `id`: Employee identification number assigned during evaluation.
- `big_data_skills`: Composite score (1.0–5.0) reflecting data ingestion, distributed storage, and big data architecture capability.
- `maths-stats_skills`: Composite score (1.0–5.0) evaluating mathematical foundations, hypothesis testing, probability, and statistical modeling.
- `coding_skills`: Composite score (1.0–5.0) evaluating software engineering and scripting in Python, SAS, SQL, and R.
- `ai_and_ml_skills`: Composite score (1.0–5.0) evaluating deep learning, modern machine learning algorithms, and AI problem framing.
- `dashboard_and_storytelling_skills`: Composite score (1.0–5.0) measuring business reporting, executive presentations, visualization, and storytelling.
- `salary_hike_high_or_low`: Binary annual appraisal outcome (`1` indicates merit-based high salary hike; `0` indicates low/standard adjustment).

---

## 4. Dataset Profile: `SDS Personality Traits.xlsx`

### 4.1 Dimensions
- **Number of Rows:** 161
- **Number of Columns:** 7

### 4.2 Exact Column Inventory & Data Types
The columns below are listed **exactly** as they appear in the dataset, including irregular whitespace:

| # | Actual Column Name | Pandas Dtype | Inferred / Semantic Type | Description & Role |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `id` | `int64` | Identifier | Senior Data Scientist Employee / Candidate ID |
| 2 | `neuroticism` | `int64` | Continuous / Integer Psychometric Score | Tendency toward anxiety/stress vulnerability (EPQ/Big 5) |
| 3 | ` extraversion` | `int64` | Continuous / Integer Psychometric Score | Social energy, assertiveness (*Note leading space in column name*) |
| 4 | `openness_to_experience` | `int64` | Continuous / Integer Psychometric Score | Intellectual curiosity, creativity, open-mindedness |
| 5 | `agreeableness` | `int64` | Continuous / Integer Psychometric Score | Compassion, cooperativeness, interpersonal trust |
| 6 | `conscientiousness` | `int64` | Continuous / Integer Psychometric Score | Goal-directed discipline, diligence, organization |
| 7 | `success_ classification_ high_low` | `int64` | Binary Categorical Indicator | Target variable (*Note spaces after underscores*): `1` = High, `0` = Low |

### 4.3 Missing Values Analysis
- **Total Missing Cells:** 0 out of 1,127 total cells (0.00%).
- 100% complete dataset. Zero nulls or blank cells.

### 4.4 Duplicate Rows Analysis
- **Full Row Duplicates:** **0** (All 161 rows have distinct numeric profiles across the 7 columns).
- **Duplicate ID Collisions:** **9 IDs appear twice (18 rows total)**:
  - Colliding IDs: `8065`, `8198`, `8228`, `8301`, `8303`, `8308`, `8489`, `8656`, `8887`.
  - **Severe Target Contradictions:** In **7 of the 9 collisions**, the two rows have conflicting target outcomes (`0` vs `1`):
    - ID `8065`: targets = `[0, 1]` (Row 35 vs. Row 133)
    - ID `8198`: targets = `[0, 1]` (Row 16 vs. Row 86)
    - ID `8301`: targets = `[0, 1]` (Row 84 vs. Row 116)
    - ID `8303`: targets = `[0, 1]` (Row 11 vs. Row 137)
    - ID `8308`: targets = `[0, 1]` (Row 44 vs. Row 59)
    - ID `8489`: targets = `[1, 0]` (Row 55 vs. Row 149)
    - ID `8887`: targets = `[0, 1]` (Row 107 vs. Row 132)
    - *Only IDs `8228` (both `0`) and `8656` (both `1`) have consistent targets.*
  - *Root Cause Analysis:* These 18 rows represent repeated test-retest assessments over time where employee performance transitioned, or ID recycling. Deduplication or temporal reconciliation will be necessary.

### 4.5 Unique Value Counts & Descriptive Statistics
| Column Name | Unique Count | Mean | Std Dev | Min | Median | Max |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `id` | 152 | 8484.60 | 280.36 | 8001 | 8504 | 8979 |
| `neuroticism` | 45 | 36.19 | 11.27 | 17 | 34 | 68 |
| ` extraversion` | 47 | 43.20 | 12.13 | 17 | 45 | 67 |
| `openness_to_experience` | 46 | 41.33 | 11.32 | 18 | 44 | 65 |
| `agreeableness` | 47 | 44.60 | 11.29 | 17 | 46 | 68 |
| `conscientiousness` | 46 | 45.21 | 13.21 | 18 | 49 | 66 |
| `success_ classification_ high_low` | 2 | 0.53 | 0.50 | 0 | 1 | 1 |

### 4.6 Five Sample Records
| id | neuroticism |  extraversion | openness_to_experience | agreeableness | conscientiousness | success_ classification_ high_low |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 8120 | 33 | 34 | 39 | 45 | 51 | 1 |
| 8951 | 50 | 36 | 31 | 59 | 39 | 0 |
| 8656 | 38 | 35 | 42 | 39 | 49 | 1 |
| 8796 | 41 | 26 | 30 | 40 | 19 | 0 |
| 8470 | 20 | 17 | 21 | 31 | 26 | 0 |

### 4.7 Suspicious, Inconsistent, & Anomalous Values
1. **Malformed Column Names:**
   - `' extraversion'` has an unintentional **leading space**. Standard access via `df['extraversion']` will trigger a `KeyError`.
   - `'success_ classification_ high_low'` contains **spaces following underscores** (`success_[space]classification_[space]high_low`).
2. **Widespread Target Contradictions:** 7 out of 9 colliding ID pairs show conflicting success classifications (`0` vs. `1`), constituting serious label noise.
3. **EPQ / Big Five Normative Scale:** The trait measurements are not percentages (0–100) or Likert ratings (1–5); they are standardized T-scores/normative inventory totals ranging from **17 to 68**.
4. **Target Balance:** The target is well-balanced: 85 High success (52.80%) vs. 76 Low success (47.20%).

### 4.8 Feature-to-Target Linear Correlations
- `conscientiousness`: **+0.680** (Strongest predictor of Senior Data Scientist success)
- `openness_to_experience`: **+0.671** (Second strongest predictor)
- ` extraversion`: **+0.494** (Moderate positive correlation)
- `agreeableness`: **+0.293** (Mild positive correlation)
- `neuroticism`: **-0.006** (Effectively zero linear correlation with success)

### 4.9 Categorical and Numerical Breakdown
- **Categorical Columns (1):** `success_ classification_ high_low` (Binary target: `0` = Low success, `1` = High success).
- **Numerical Columns (6):** `id` (Discrete ID), `neuroticism`, ` extraversion`, `openness_to_experience`, `agreeableness`, `conscientiousness` (Continuous psychometric scores).

### 4.10 Column Interpretations
- `id`: Senior Data Scientist identification code.
- `neuroticism`: Score measuring emotional instability, tendency to experience distress, anxiety, and self-doubt.
- ` extraversion`: Score measuring social assertiveness, expressiveness, outgoing nature, and communicative confidence.
- `openness_to_experience`: Score measuring creative problem solving, intellectual curiosity, and willingness to adopt novel methodologies.
- `agreeableness`: Score measuring trust, empathy, teamwork orientation, and collaborative rapport.
- `conscientiousness`: Score measuring organizational diligence, perseverance, goal-directed delivery, and attention to detail.
- `success_ classification_ high_low`: Classified workplace success rating within the enterprise (`1` = High customer/organizational success; `0` = Low/standard).

---

## 5. Cross-Dataset Strategic Synthesis

```
+---------------------------------------------------------------------------------------------------+
|                                   DATASET ECOSYSTEM MAPPING                                       |
+---------------------------------------------------------------------------------------------------+
|  MACRO LABOR MARKET PERSPECTIVE (Macro Trends & Compensation)                                     |
|                                                                                                   |
|  [ DataScience Jobs.csv ]  <------------------------->  [ Analytics Jobs.csv ]                    |
|  - 1,602 employer-level aggregates                     - 15,841 granular job postings             |
|  - Salary in Lakhs (min, avg, max)                     - Salary brackets ('0to3' to '25to50')     |
|  - 10 standardized DS titles                           - 10,097 raw job designations              |
|  - Natural Key: (company_name, job_title)              - Key Skills & Narrative text              |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
|  MICRO TALENT & COMPETENCY PERSPECTIVE (Internal Performance & Retention)                        |
|                                                                                                   |
|  [ JDS Skill Traits.xlsx ]                              [ SDS Personality Traits.xlsx ]           |
|  - 139 Junior Data Scientists                           - 161 Senior Data Scientists              |
|  - 5 Hard/Technical Skill Dimensions                    - 5 Big Five / EPQ Psychometric Traits    |
|  - Primary Drivers: Storytelling (0.55), Maths (0.52)   - Primary Drivers: Conscientiousness      |
|  - Target: Salary Hike (0 vs 1)                           (0.68), Openness (0.67)                 |
|                                                         - Target: Success Classification (0 vs 1) |
+---------------------------------------------------------------------------------------------------+
```

### Essential Guidelines for Next Analytical Steps:
1. **String Cleaning & Normalization:**
   - In `DataScience Jobs.csv`: Parse `'avg_salary'`, `'min_salary'`, and `'max_salary'` by stripping `'L'` and converting to numeric float values.
   - In `Analytics Jobs.csv`: Strip trailing/leading whitespaces from text fields; standardize `job_type` case variations (`'Analytics'`).
   - In `SDS Personality Traits.xlsx`: Trim column headers to eliminate leading/trailing whitespace (e.g. `' extraversion'` -> `'extraversion'`, `'success_ classification_ high_low'` -> `'success_classification_high_low'`).
2. **Handling Duplicate IDs & Contradictions:**
   - Neither `reference_no` in `DataScience Jobs.csv` nor `id` in `JDS` and `SDS` should be used as unique database keys without disambiguation.
   - Resolve contradicting target labels in `SDS` (7 ID collisions) and `JDS` (ID `3291`) via temporal ordering or deduplication strategies.
3. **Feature Engineering Opportunities:**
   - Extract numerical experience bounds (`min_exp`, `max_exp`, `mid_exp`) from the `experience` string column in `Analytics Jobs.csv`.
   - Vectorize `key_skills` in `Analytics Jobs.csv` to map high-demand tools (Python, SAS, SQL, Cloud) directly to salary tiers and compare against the competency expectations evaluated in `JDS Skill Traits.xlsx`.
