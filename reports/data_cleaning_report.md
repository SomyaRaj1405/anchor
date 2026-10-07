# Comprehensive Data Cleaning & Audit Report

**Project:** SAS Data Analytics Hackathon  
**Target Document:** `reports/data_cleaning_report.md`  
**Pipeline Script:** [`src/data_cleaning.py`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/src/data_cleaning.py)  
**Status:** Data Cleaning & Validation Complete (Zero Silent Data Loss)  
**Execution Date:** October 2026  

---

## Executive Summary & Cleaning Governance

This report documents the rigorous data cleaning, transformation, and validation protocol executed across all four hackathon datasets. All operations adhere strictly to core governance rules:

1. **Raw Data Preservation:** The original raw files in `data/` were preserved intact and were **never modified or overwritten**.
2. **Output Isolation:** All cleaned and standardized datasets are saved separately in [`data/cleaned/`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/).
3. **Zero Silent Deletions:** No records were dropped silently. Every single cleaning and imputation operation is audited with exact record counts and percentage impacts.
4. **Reproducibility:** The complete pipeline is implemented in modular, executable Python in [`src/data_cleaning.py`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/src/data_cleaning.py), and structured machine-readable metrics are archived in [`reports/cleaning_audit_metrics.json`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/reports/cleaning_audit_metrics.json).

### Master Transformation & Record Impact Matrix

| Dataset | Raw Records | Cleaned Records | Records Dropped | Key Transformations | Records Affected | % Dataset Affected |
| :--- | :---: | :---: | :---: | :--- | :---: | :---: |
| **DataScience Jobs.csv** | 1,602 | 1,602 | 0 (0.0%) | Strip `'L'` & parse `min_salary`, `avg_salary`, `max_salary` to float | 1,602 | 100.0% |
| | | | | Verify `min_salary <= avg_salary <= max_salary` | 1,602 | 100.0% |
| | | | | Trim whitespace on `company_name` & `job_title` | 0 | 0.0% |
| **Analytics Jobs.csv** | 15,841 | 15,841 | 0 (0.0%) | Normalize whitespace in `job_desig` | 427 | 2.70% |
| | | | | Clean & re-tokenize `key_skills` (commas, spacing) | 1,019 | 6.43% |
| | | | | Impute missing `key_skills` (`s_no = 7810` to `'Not Specified'`) | 1 | 0.01% |
| | | | | Preserve & normalize `job_description` whitespace | 1,975 | 12.47% |
| | | | | Standardize `job_type` variants to `'Analytics'` | 859 | 5.42% |
| | | | | Parse `experience` to `min_exp`, `max_exp`, `avg_exp` | 15,841 | 100.0% |
| | | | | Map `salary` ranges to `min_salary`, `max_salary`, `avg_salary`, order | 15,841 | 100.0% |
| | | | | Flag duplicate postings (`is_duplicate_posting = True`) | 1,002 | 6.33% |
| **JDS Skill Traits.xlsx** | 139 | 139 | 0 (0.0%) | Validate 5 skill dimensions as numeric variables (1.0–5.0) | 139 | 100.0% |
| | | | | Audit binary target `salary_hike_high_or_low` | 139 | 100.0% |
| | | | | Audit candidate ID collisions (4 rows across 2 IDs) | 4 | 2.88% |
| **SDS Personality Traits.xlsx** | 161 | 161 | 0 (0.0%) | Fix column names (`' extraversion'`, `'success_ classification_ high_low'`) | 161 | 100.0% |
| | | | | Validate 5 personality traits as numeric EPQ variables (17–68) | 161 | 100.0% |
| | | | | Audit binary target `success_classification_high_low` | 161 | 100.0% |
| | | | | Audit candidate ID collisions (18 rows across 9 IDs) | 18 | 11.18% |

---

## 1. Dataset Cleaning: `DataScience Jobs.csv`

### 1.1 Scope & Objective
- **Raw File:** [`data/DataScience Jobs.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/DataScience%20Jobs.csv) (1,602 rows, 8 columns)
- **Cleaned File:** [`data/cleaned/DataScience_Jobs_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/DataScience_Jobs_cleaned.csv) (1,602 rows, 9 columns)
- **Objective:** Convert string salary expressions to numeric Lakhs INR, validate compensation hierarchy constraints, verify numeric integrity of experience and job volume fields, and audit duplicate keys.

### 1.2 Transformation Details & Affected Records

#### 1. Salary Field Inspection & Numeric Conversion
- **Raw Representation:** `avg_salary`, `min_salary`, and `max_salary` were stored as string objects with an appended `'L'` character (e.g., `'7.8L'`, `'4.5L'`, `'16.0L'`).
- **Cleaning Transformation:**
  - Stripped `'L'` character suffix using regular expressions.
  - Cast string tokens into IEEE 754 64-bit floating point numbers (`float64`).
  - Unit: Lakhs INR per annum ($1\text{ Lakh} = 100,000\text{ INR}$).
- **Records Affected:** **1,602 out of 1,602 rows (100.0%)**.
- **Data Quality Check:** Prior to conversion, regex pattern `^\d+(\.\d+)?L$` was matched across all records. Zero non-conforming or corrupted string tokens were found.

#### 2. Compensation Hierarchy Validation (`min_salary <= avg_salary <= max_salary`)
- **Mathematical Consistency Rule:** For every posting aggregate, the logical inequality $\text{min\_salary} \le \text{avg\_salary} \le \text{max\_salary}$ must hold.
- **Validation Outcome:**
  - Violations detected: **0 rows (0.00%)**.
  - Fully compliant records: **1,602 rows (100.00%)**.
  - A validation indicator column `salary_consistency_valid` (`bool`) was added (all set to `True`).

```
Compensation Distribution Summary (Lakhs INR):
- min_salary: Min = 0.20L, Mean = 8.63L, Median = 7.00L, Max = 55.00L
- avg_salary: Min = 1.40L, Mean = 13.23L, Median = 11.00L, Max = 82.00L
- max_salary: Min = 2.00L, Mean = 19.14L, Median = 17.00L, Max = 102.00L
```

#### 3. Verification of `min_experience`
- **Data Type:** `int64`.
- **Numeric Verification:** Verified 100% numeric without non-numeric artifacts.
- **Null Count:** 0.
- **Negative Value Count:** 0.
- **Range & Distribution:** Minimum = 0 years, Maximum = 21 years, Mean = 2.80 years.

#### 4. Verification of `num_of_jobs`
- **Data Type:** `int64`.
- **Numeric Verification:** Verified 100% numeric.
- **Null Count:** 0.
- **Non-positive / Zero Count:** 0 (all values $\ge 3$).
- **Range & Distribution:** Minimum = 3 postings, Maximum = 4,200 postings, Median = 22 postings, Mean = 58.06 postings.

#### 5. Duplicate Records Evaluation
- **Full Row Duplicates:** **0 rows (0.00%)**.
- **Natural Composite Key (`company_name`, `job_title`):** **0 duplicate pairs (100% unique)**. Every record represents a distinct employer offering a distinct role.
- **Scraper Reference Key (`reference_no`):** 142 duplicate occurrences (276 rows sharing 134 IDs). This confirms `reference_no` is a scraper batch index rather than an entity key.
- **Records Removed:** **0 records removed**. All 1,602 records preserved.

---

## 2. Dataset Cleaning: `Analytics Jobs.csv`

### 2.1 Scope & Objective
- **Raw File:** [`data/Analytics Jobs.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/Analytics%20Jobs.csv) (15,841 rows, 8 columns)
- **Cleaned File (Master):** [`data/cleaned/Analytics_Jobs_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/Analytics_Jobs_cleaned.csv) (15,841 rows, 16 columns)
- **Cleaned File (Deduplicated View):** [`data/cleaned/Analytics_Jobs_deduplicated.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/Analytics_Jobs_deduplicated.csv) (14,839 rows, 15 columns)
- **Objective:** Standardize text fields, resolve whitespace padding, handle missing skill values explicitly, preserve job descriptions, extract numeric experience and compensation variables, and audit duplicate postings.

### 2.2 Transformation Details & Affected Records

#### 1. Inspection & Parsing of `experience`
- **Pattern Verification:** All 15,841 rows conformed to the pattern `^\d+\s*-\s*\d+\s*yrs?$`.
- **Derived Continuous Numerical Variables:**
  - `min_experience` (`int64`): Minimum required years (range: 0 to 23 years).
  - `max_experience` (`int64`): Maximum required years (range: 0 to 30 years).
  - `avg_experience` (`float64`): Midpoint $(\text{min\_exp} + \text{max\_exp}) / 2.0$ (range: 0.0 to 26.5 years).
- **Records Affected:** **15,841 records (100.0%)**.

#### 2. Inspection & Parsing of Binned `salary` Ranges
- **Raw Salary Brackets:** Discrete ordinal brackets in Lakhs INR (`'0to3'`, `'3to6'`, `'6to10'`, `'10to15'`, `'15to25'`, `'25to50'`).
- **Derived Variables:**
  - `min_salary` (`float64`): Bracket lower bound ($0.0, 3.0, 6.0, 10.0, 15.0, 25.0$).
  - `max_salary` (`float64`): Bracket upper bound ($3.0, 6.0, 10.0, 15.0, 25.0, 50.0$).
  - `avg_salary` (`float64`): Bracket midpoint ($1.5, 4.5, 8.0, 12.5, 20.0, 37.5$).
  - `salary_bracket_order` (`int64`): Ordinal integer rank ($0, 1, 2, 3, 4, 5$).
- **Records Affected:** **15,841 records (100.0%)**.

#### 3. Cleaning & Normalization of `job_desig`
- **Irregularities Identified:**
  - 50 rows exhibited leading/trailing whitespace.
  - 388 rows contained internal consecutive spaces or tabs.
- **Transformation:** Applied `re.sub(r'\s+', ' ', s).strip()`.
- **Records Affected:** **427 records (2.70%)**.

#### 4. Cleaning & Imputation of `key_skills`
- **Missing Value Handling:** Row `s_no = 7810` lacked skill tokens (`NaN`). As mandated by the zero-silent-loss rule, this record was **not dropped**. It was explicitly imputed with `'Not Specified'` (**1 record affected**).
- **Whitespace & Delimiter Tokenization:**
  - 74 rows contained irregular whitespace around comma delimiters (e.g. `SQL , Python`).
  - 3 rows had leading/trailing commas.
  - Transformation: Stripped leading/trailing commas, normalized whitespace within tokens, and rejoined tokens with a standardized `', '` separator.
- **Records Affected:** **1,020 records total (6.44%)** (1 imputed + 1,019 formatted).

#### 5. Cleaning of `location`
- **Transformation:** Normalized whitespace within tokens and ensured clean comma delimiters.
- **Records Affected:** **0 records required structural alteration** (all 15,841 rows already conformed to standardized comma-separated city strings).

#### 6. Preservation of `job_description`
- **Rule Enforcement:** Preserved the original narrative descriptions without truncating or removing content.
- **Missing Value Handling:** 3,508 missing records (22.15%) were preserved as null (`NaN`). Zero records were dropped.
- **Whitespace Normalization:** For the 12,333 non-null records, trailing spaces and redundant horizontal tabs were normalized while maintaining full paragraph breaks (`\n`).
- **Records Affected:** **1,975 records (12.47%)** normalized; **3,508 missing records preserved**.

#### 7. Standardization of `job_type`
- **Inconsistencies Identified:** 12,011 rows (75.82%) were null. The remaining 3,830 rows consisted of 5 case/spelling variants (`'Analytics'`, `'analytics'`, `'ANALYTICS'`, `'analytic'`, `'Analytic'`).
- **Transformation:** Unified all non-null values to canonical `'Analytics'`, while preserving missing values.
- **Records Affected:** **859 records (5.42%)** standardized; **12,011 missing records preserved**.

#### 8. Duplicate Records Audit & Handling
- **Full Row Duplicates (including `s_no`):** **0 records**.
- **Redundant Job Postings (excluding `s_no`):** **1,002 redundant postings** (1,598 total rows across duplicate posting clusters).
- **Governance Action:**
  - **Master Dataset:** All 15,841 records are preserved. A dedicated boolean indicator `is_duplicate_posting` was added (`False` for 14,839 primary listings; `True` for 1,002 duplicate listings).
  - **Deduplicated Modeling Dataset:** An isolated deduplicated dataset [`Analytics_Jobs_deduplicated.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/Analytics_Jobs_deduplicated.csv) (14,839 rows) was generated for machine learning models that require strictly unique observations.
  - **Records Silently Removed:** **0**.

---

## 3. Dataset Cleaning: `JDS Skill Traits.xlsx`

### 3.1 Scope & Objective
- **Raw File:** [`data/JDS Skill Traits.xlsx`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/JDS%20Skill%20Traits.xlsx) (139 rows, 7 columns)
- **Cleaned File:** [`data/cleaned/JDS_Skill_Traits_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/JDS_Skill_Traits_cleaned.csv) & [`.xlsx`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/JDS_Skill_Traits_cleaned.xlsx) (139 rows, 8 columns)
- **Objective:** Validate the five skill pillars as continuous numerical ratings, check target distribution, audit missing/invalid values, and analyze candidate ID collisions.

### 3.2 Five Skill Numerical Variables Audit
All five skill traits represent competency scores evaluated on a standardized continuous 1.0 to 5.0 scale:

| Skill Column | Dtype | Missing | Out-of-Bounds ($<1.0$ or $>5.0$) | Min | Median | Mean | Std Dev | Max |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `big_data_skills` | `float64` | 0 | 0 | 2.30 | 3.80 | 3.85 | 0.85 | 5.00 |
| `maths-stats_skills` | `float64` | 0 | 0 | 2.20 | 4.60 | 4.29 | 0.84 | 5.00 |
| `coding_skills` | `float64` | 0 | 0 | 2.20 | 4.60 | 4.27 | 0.89 | 5.00 |
| `ai_and_ml_skills` | `float64` | 0 | 0 | 2.20 | 4.90 | 4.57 | 0.67 | 5.00 |
| `dashboard_and_storytelling_skills` | `float64` | 0 | 0 | 2.30 | 5.00 | 4.36 | 0.93 | 5.00 |

- **Validation Outcome:** Zero invalid numeric values. Zero out-of-bounds ratings. All 139 records are 100% complete and valid.

### 3.3 Target Variable Distribution: `salary_hike_high_or_low`
- **Semantic Definition:** Annual merit-based salary increment outcome (`1` = High hike, `0` = Low hike).
- **Data Type:** `int64`.
- **Target Distribution:**
  - `1` (High Hike): **73 records (52.52%)**
  - `0` (Low Hike): **66 records (47.48%)**
  - Invalid values / Nulls: **0**
- **Assessment:** Exceptionally well-balanced target distribution (no severe class imbalance).

### 3.4 Duplicate Records & Candidate ID Collisions
- **Full Row Duplicates:** **0 rows (0.00%)**.
- **Colliding Candidate IDs:** **2 IDs appear twice (4 rows total)**:
  - **ID `2223` (Consistent Target):** Row 58 (`Target = 0`) vs. Row 101 (`Target = 0`).
  - **ID `3291` (Contradictory Target):** Row 3 (`Target = 0`, skills moderate) vs. Row 29 (`Target = 1`, skills high).
- **Action Taken:** Added indicator column `has_duplicate_id` (`bool`). Zero rows were removed (139/139 preserved).

---

## 4. Dataset Cleaning: `SDS Personality Traits.xlsx`

### 4.1 Scope & Objective
- **Raw File:** [`data/SDS Personality Traits.xlsx`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/SDS%20Personality%20Traits.xlsx) (161 rows, 7 columns)
- **Cleaned File:** [`data/cleaned/SDS_Personality_Traits_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/SDS_Personality_Traits_cleaned.csv) & [`.xlsx`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/SDS_Personality_Traits_cleaned.xlsx) (161 rows, 8 columns)
- **Objective:** Fix irregular whitespace and leading spaces in column names without altering semantic meaning, validate personality traits as numeric EPQ variables, check target distribution, and audit ID collisions.

### 4.2 Column Name Normalization
The raw headers in the Excel file contained irregular leading whitespace and spaces following underscores:

| Raw Column Header | Cleaned Standardized Header | Transformation Applied |
| :--- | :--- | :--- |
| `'id'` | `id` | Preserved |
| `'neuroticism'` | `neuroticism` | Preserved |
| `' extraversion'` | `extraversion` | Stripped leading whitespace |
| `'openness_to_experience'` | `openness_to_experience` | Preserved |
| `'agreeableness'` | `agreeableness` | Preserved |
| `'conscientiousness'` | `conscientiousness` | Preserved |
| `'success_ classification_ high_low'` | `success_classification_high_low` | Removed spaces around underscores |

**Records Affected:** **161 out of 161 rows (100.0%)** benefited from normalized schema access, eliminating `KeyError` risks.

### 4.3 Personality Traits Numerical Variables Audit
All five personality dimensions reflect standardized normalized scores from the Eysenck Personality Questionnaire (EPQ) / Big Five Inventory:

| Personality Trait | Dtype | Missing | Min | Median | Mean | Std Dev | Max |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `neuroticism` | `int64` | 0 | 17 | 34 | 36.19 | 11.27 | 68 |
| `extraversion` | `int64` | 0 | 17 | 45 | 43.20 | 12.13 | 67 |
| `openness_to_experience` | `int64` | 0 | 18 | 44 | 41.33 | 11.32 | 65 |
| `agreeableness` | `int64` | 0 | 17 | 46 | 44.60 | 11.29 | 68 |
| `conscientiousness` | `int64` | 0 | 18 | 49 | 45.21 | 13.21 | 66 |

- **Validation Outcome:** Zero invalid numeric values. Zero missing values. All scores lie within the expected normative inventory range (17 to 68).

### 4.4 Target Variable Distribution: `success_classification_high_low`
- **Semantic Definition:** Workplace success classification of Senior Data Scientists (`1` = High success, `0` = Low success).
- **Data Type:** `int64`.
- **Target Distribution:**
  - `1` (High Success): **85 records (52.80%)**
  - `0` (Low Success): **76 records (47.20%)**
  - Invalid values / Nulls: **0**
- **Assessment:** Exceptionally well-balanced target distribution.

### 4.5 Duplicate Records & Candidate ID Collisions
- **Full Row Duplicates:** **0 rows (0.00%)**.
- **Colliding Candidate IDs:** **9 IDs appear twice (18 rows total)**:
  - Colliding IDs: `8065`, `8198`, `8228`, `8301`, `8303`, `8308`, `8489`, `8656`, `8887`.
  - Contradictory targets exist in 7 of the 9 pairs (e.g., ID `8065` has outcomes `0` and `1`).
- **Action Taken:** Added indicator column `has_duplicate_id` (`bool`). Zero rows were removed (161/161 preserved).

---

## 5. Cleaned Dataset Directory Inventory

All cleaned datasets are organized in [`data/cleaned/`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/):

```
data/cleaned/
├── Analytics Jobs.csv                 (15,841 rows, 16 cols | Master with is_duplicate_posting)
├── Analytics_Jobs_cleaned.csv         (15,841 rows, 16 cols | Master with is_duplicate_posting)
├── Analytics_Jobs_deduplicated.csv    (14,839 rows, 15 cols | Distinct job postings subset)
├── DataScience Jobs.csv               (1,602 rows, 9 cols   | Converted Lakhs float salaries)
├── DataScience_Jobs_cleaned.csv       (1,602 rows, 9 cols   | Converted Lakhs float salaries)
├── JDS Skill Traits.xlsx              (139 rows, 8 cols     | Validated 1-5 numeric skills)
├── JDS_Skill_Traits_cleaned.csv       (139 rows, 8 cols     | CSV format)
├── JDS_Skill_Traits_cleaned.xlsx      (139 rows, 8 cols     | Excel format)
├── SDS Personality Traits.xlsx        (161 rows, 8 cols     | Cleaned headers & normalized traits)
├── SDS_Personality_Traits_cleaned.csv  (161 rows, 8 cols     | CSV format)
└── SDS_Personality_Traits_cleaned.xlsx (161 rows, 8 cols     | Excel format)
```

---

## 6. Readiness for Downstream Analytics & Modeling

1. **Macro Labor Market Modeling (`DataScience Jobs` & `Analytics Jobs`):**
   - Numeric salary targets (`avg_salary`, `min_salary`, `max_salary`) are immediately ready for regression, ANOVA, and compensation forecasting.
   - Numeric experience bounds (`min_experience`, `max_experience`) enable direct salary-experience elasticity modeling.
   - Cleaned skill tokens in `Analytics Jobs` are ready for TF-IDF / Bag-of-Words and high-value skill premium modeling.
2. **Micro Talent Performance Classification (`JDS` & `SDS`):**
   - Clean continuous feature matrices and balanced binary targets (`salary_hike_high_or_low` and `success_classification_high_low`) are immediately ready for Logistic Regression, Random Forests, Gradient Boosting (XGBoost/LightGBM), and SAS Model Studio benchmarking.
