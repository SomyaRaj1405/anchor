# Empirical JDS Skill Traits Analysis & Findings Report

**Project:** SAS Data Analytics Hackathon  
**Target Document:** `reports/jds_skill_findings.md`  
**Dataset Analyzed:** [`data/cleaned/JDS_Skill_Traits_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/JDS_Skill_Traits_cleaned.csv) (139 Junior Data Scientists)  
**Target Variable:** `salary_hike_high_or_low` (Binary: `1` = High Salary Hike, `0` = Low Salary Hike)  
**Execution Date:** October 2026  
**Analytical Standard:** Strictly empirical, evidence-supported associations (no causal claims).

---

## 1. Executive Summary

This study analyzed competency evaluations across five technical dimensions for 139 Junior / Entry-Level Data Scientists to determine which skill dimensions are most strongly associated with merit-based high salary hike outcomes (`salary_hike_high_or_low`).

### Core Findings:
1. **The Executive Storytelling Premium:** **`dashboard_and_storytelling_skills`** is the single strongest linear correlate with high salary hike outcomes (**$r = +0.554$**) and the top feature in Random Forest importance (**0.297**).
2. **Quantitative Foundations:** **`maths-stats_skills`** is the second strongest driver (**$r = +0.524$**, Logistic Regression log-odds coefficient = **+1.451**).
3. **Coding & AI/ML are Necessary but Insufficient:** While `coding_skills` ($r = +0.444$) and `ai_and_ml_skills` ($r = +0.405$) are positively associated with high hikes, they exhibit lower marginal discriminative power because baseline proficiency is already high across all junior data scientists.
4. **Big Data is Least Differentiating:** `big_data_skills` shows the weakest association (**$r = +0.112$**), indicating that distributed data architecture is secondary for junior-level salary advancement.
5. **Classification Efficacy:** A 5-fold cross-validated Logistic Regression model achieves **81.3% Accuracy** (ROC-AUC: **0.811**), and Random Forest achieves **79.2% Accuracy** (ROC-AUC: **0.789**).

---

## 2. Dataset Profile & Descriptive Statistics

Evaluations are recorded on a standardized continuous scale from 1.0 to 5.0 across five competencies:

| Skill Dimension | Mean | Median | Std Dev | Min | Max | IQR | Ceiling Rate (=5.0) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`dashboard_and_storytelling_skills`** | 4.36 | 5.00 | 0.93 | 2.30 | 5.00 | 1.00 | 38.1% |
| **`maths-stats_skills`** | 4.29 | 4.60 | 0.84 | 2.20 | 5.00 | 1.10 | 25.9% |
| **`coding_skills`** | 4.27 | 4.60 | 0.89 | 2.20 | 5.00 | 1.20 | 29.5% |
| **`ai_and_ml_skills`** | 4.57 | 4.90 | 0.67 | 2.20 | 5.00 | 0.70 | 48.2% |
| **`big_data_skills`** | 3.85 | 3.80 | 0.85 | 2.30 | 5.00 | 1.30 | 14.4% |

- **Target Balance:** The target variable `salary_hike_high_or_low` is well-balanced:
  - **High Hike (`1`):** **73 employees (52.52%)**
  - **Low Hike (`0`):** **66 employees (47.48%)**
- Visual Reference: [`outputs/figures/jds_skills/01_jds_target_distribution.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/jds_skills/01_jds_target_distribution.png)
- Table Reference: [`outputs/tables/jds_skills/02_jds_descriptive_stats.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/jds_skills/02_jds_descriptive_stats.csv)

---

## 3. Group Comparison: High vs Low Salary Hike

Comparing the mean competency ratings of Junior Data Scientists who achieved high salary hikes versus those who received low adjustments:

| Skill Dimension | Mean (Low Hike: 0) | Mean (High Hike: 1) | Absolute Delta | Percentage Gain | Association Strength |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`dashboard_and_storytelling_skills`** | **3.84** | **4.83** | **+0.99** | **+25.78%** | **Strongest Positive Delta** |
| **`maths-stats_skills`** | **3.85** | **4.69** | **+0.84** | **+21.82%** | **Second Strongest Delta** |
| **`coding_skills`** | **3.87** | **4.62** | **+0.75** | **+19.38%** | Moderate Delta |
| **`ai_and_ml_skills`** | **4.29** | **4.82** | **+0.53** | **+12.35%** | Moderate Delta |
| **`big_data_skills`** | **3.75** | **3.94** | **+0.19** | **+5.07%** | Negligible Delta |

- **Key Takeaway:** Employees achieving high salary hikes score an average of **4.83 / 5.00 in Storytelling** (vs 3.84 for low-hike peers) and **4.69 in Maths/Stats** (vs 3.85). In contrast, `big_data_skills` shows only a 0.19 point difference (+5.07%).
- Visual Reference: [`outputs/figures/jds_skills/03_jds_group_comparison.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/jds_skills/03_jds_group_comparison.png)
- Table Reference: [`outputs/tables/jds_skills/04_jds_group_comparison.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/jds_skills/04_jds_group_comparison.csv)

---

## 4. Correlation & Multivariate Modeling

### 4.1 Linear Correlations with Target
- `dashboard_and_storytelling_skills`: **r = +0.554** ($p < 0.001$)
- `maths-stats_skills`: **r = +0.524** ($p < 0.001$)
- `coding_skills`: **r = +0.444** ($p < 0.001$)
- `ai_and_ml_skills`: **r = +0.405** ($p < 0.001$)
- `big_data_skills`: **r = +0.112** ($p = 0.188$, statistically insignificant at $lpha = 0.05$)

### 4.2 Machine Learning Classifier Benchmark (5-Fold Cross-Validation)

| Model Architecture | Cross-Val Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **81.3%** | **80.5%** | **84.9%** | **0.827** | **0.811** |
| **Random Forest** | **79.2%** | **78.5%** | **83.6%** | **0.808** | **0.789** |
| **Decision Tree** | **75.5%** | **74.1%** | **82.2%** | **0.779** | **0.752** |

- Visual Reference: [`outputs/figures/jds_skills/05_jds_confusion_matrix.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/jds_skills/05_jds_confusion_matrix.png)
- Table Reference: [`outputs/tables/jds_skills/05_jds_model_performance.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/jds_skills/05_jds_model_performance.csv)

### 4.3 Feature Importance & Odds Ratios

| Skill Dimension | Random Forest Gini Importance | Logistic Regression Coef | Odds Ratio ($\exp(eta)$) | Empirical Impact |
| :--- | :---: | :---: | :---: | :--- |
| **`dashboard_and_storytelling_skills`** | **0.297** | **+1.186** | **3.27** | Top predictor; 1-unit increase associated with 3.27x higher odds of hike |
| **`maths-stats_skills`** | **0.247** | **+1.451** | **4.27** | Highest per-unit odds multiplier (4.27x) |
| **`coding_skills`** | **0.164** | **+0.590** | **1.80** | Moderate predictor |
| **`ai_and_ml_skills`** | **0.151** | **+1.042** | **2.83** | Moderate predictor |
| **`big_data_skills`** | **0.141** | **+0.753** | **2.12** | Lowest overall importance |

- Visual Reference: [`outputs/figures/jds_skills/04_jds_feature_importance.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/jds_skills/04_jds_feature_importance.png)
- Table Reference: [`outputs/tables/jds_skills/06_jds_feature_importance.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/jds_skills/06_jds_feature_importance.csv)

---

## 5. Strategic Implications for Junior Talent

1. **The Translation Gap:** In enterprise settings, junior practitioners frequently over-index on raw coding and model complexity while neglecting stakeholder translation. The data demonstrates that candidates who pair statistical rigor with visual storytelling outperform pure technical coders in annual salary increments.
2. **Prioritization Roadmap for Beginners:**
   - *Phase 1 (Foundations):* Solidify `maths-stats_skills` and baseline `coding_skills` (Python, SQL).
   - *Phase 2 (Differentiation):* Cultivate `dashboard_and_storytelling_skills` (Power BI, Tableau, executive presentation).
   - *Phase 3 (Scaling):* Expand `big_data_skills` only when transitioning toward data engineering or senior architecture tracks.
