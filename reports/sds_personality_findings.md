# Empirical SDS Personality Traits Analysis & Findings Report

**Project:** SAS Data Analytics Hackathon  
**Target Document:** `reports/sds_personality_findings.md`  
**Dataset Analyzed:** [`data/cleaned/SDS_Personality_Traits_cleaned.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/data/cleaned/SDS_Personality_Traits_cleaned.csv) (161 Senior / Customer-Facing Data Scientists)  
**Target Variable:** `success_classification_high_low` (Binary: `1` = High Workplace Success, `0` = Low Workplace Success)  
**Execution Date:** October 2026  
**Analytical Standard:** Strictly empirical, evidence-supported associations (no causal claims).

---

## 1. Executive Summary

This study analyzed psychometric evaluations across the Big Five / EPQ personality traits for 161 Senior and Customer-Facing Data Scientists to identify which psychological dimensions are most strongly predictive of and associated with classified organizational workplace success (`success_classification_high_low`).

### Core Findings:
1. **The Twin Pillars of Senior Success:** **`conscientiousness`** ($r = +0.680$, RF Importance = **0.360**) and **`openness_to_experience`** ($r = +0.671$, RF Importance = **0.310**) together account for **67.0% of all predictive power** in determining senior data scientist success.
2. **Social Engagement Premium:** **`extraversion`** is moderately positively associated with success ($r = +0.494$, RF Importance = **0.146**), reflecting the client-facing, consultative nature of senior data roles.
3. **Collaborative Trust:** **`agreeableness`** displays a mild positive correlation ($r = +0.293$, RF Importance = **0.153**), facilitating cross-functional team execution.
4. **Emotional Stability Orthogonality:** **`neuroticism`** exhibits effectively zero linear correlation with success ($r = -0.006$, RF Importance = **0.031**), indicating that emotional reactivity is not a primary discriminator of career delivery at the senior level within this cohort.
5. **High Classification Efficacy:** A 5-fold cross-validated Random Forest model achieves **94.4% Accuracy** (ROC-AUC: **0.942**), and Logistic Regression achieves **90.7% Accuracy** (ROC-AUC: **0.906**).

---

## 2. Dataset Profile & Descriptive Statistics

Traits are measured on standardized normalized inventory scores ranging from 17 to 68:

| Personality Trait Dimension | Mean | Median | Std Dev | Min | Max | IQR | Psychological Interpretation |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`conscientiousness`** | 45.21 | 49.00 | 13.21 | 18 | 66 | 21.0 | Diligence, goal-directed delivery, organizational discipline |
| **`agreeableness`** | 44.60 | 46.00 | 11.29 | 17 | 68 | 16.0 | Interpersonal trust, cooperation, empathy |
| **`extraversion`** | 43.20 | 45.00 | 12.13 | 17 | 67 | 18.0 | Assertiveness, communicative energy, social confidence |
| **`openness_to_experience`** | 41.33 | 44.00 | 11.32 | 18 | 65 | 16.0 | Creative problem-solving, intellectual curiosity, innovation |
| **`neuroticism`** | 36.19 | 34.00 | 11.27 | 17 | 68 | 16.0 | Emotional vulnerability, tendency toward stress/anxiety |

- **Target Distribution:**
  - **High Success (`1`):** **85 Senior Scientists (52.80%)**
  - **Low Success (`0`):** **76 Senior Scientists (47.20%)**
- Visual Reference: [`outputs/figures/sds_personality/01_sds_target_distribution.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/sds_personality/01_sds_target_distribution.png)
- Table Reference: [`outputs/tables/sds_personality/01_sds_descriptive_stats.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/sds_personality/01_sds_descriptive_stats.csv)

---

## 3. Group Comparison: High Success vs Low Success

Contrasting mean personality trait scores between High-Success and Low-Success senior practitioners:

| Personality Trait | Mean (Low Success: 0) | Mean (High Success: 1) | Absolute Delta | Percentage Gain | Association Strength |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`conscientiousness`** | **35.79** | **53.64** | **+17.85** | **+49.87%** | **Strongest Positive Delta** |
| **`openness_to_experience`** | **33.32** | **48.49** | **+15.18** | **+45.56%** | **Second Strongest Delta** |
| **`extraversion`** | **36.88** | **48.85** | **+11.96** | **+32.43%** | Substantial Delta |
| **`agreeableness`** | **41.09** | **47.74** | **+6.65** | **+16.18%** | Moderate Delta |
| **`neuroticism`** | **36.26** | **36.13** | **-0.13** | **-0.36%** | Negligible / Neutral |

- **Key Takeaway:** High-success senior practitioners exhibit a **+49.87% surge in Conscientiousness** and a **+45.56% surge in Openness to Experience**. High success is characterized by the combination of relentless structured execution (*Conscientiousness*) and intellectual flexibility (*Openness*).
- Visual Reference: [`outputs/figures/sds_personality/03_sds_group_comparison.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/sds_personality/03_sds_group_comparison.png)
- Table Reference: [`outputs/tables/sds_personality/02_sds_group_comparison.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/sds_personality/02_sds_group_comparison.csv)

---

## 4. Correlation & Multivariate Modeling

### 4.1 Linear Correlations with Target
- `conscientiousness`: **r = +0.680** ($p < 0.001$)
- `openness_to_experience`: **r = +0.671** ($p < 0.001$)
- `extraversion`: **r = +0.494** ($p < 0.001$)
- `agreeableness`: **r = +0.293** ($p < 0.001$)
- `neuroticism`: **r = -0.006** ($p = 0.942$, not statistically significant)

### 4.2 Machine Learning Classifier Benchmark (5-Fold Cross-Validation)

| Model Architecture | Cross-Val Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest** | **94.4%** | **94.2%** | **95.3%** | **0.947** | **0.942** |
| **Logistic Regression** | **90.7%** | **89.8%** | **92.9%** | **0.913** | **0.906** |
| **Decision Tree** | **88.2%** | **87.5%** | **90.6%** | **0.890** | **0.880** |

- Visual Reference: [`outputs/figures/sds_personality/05_sds_confusion_matrix.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/sds_personality/05_sds_confusion_matrix.png)
- Table Reference: [`outputs/tables/sds_personality/04_sds_model_performance.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/sds_personality/04_sds_model_performance.csv)

### 4.3 Feature Importance Breakdown

| Personality Trait | Random Forest Gini Importance | Logistic Regression Coef | Empirical Impact |
| :--- | :---: | :---: | :--- |
| **`conscientiousness`** | **0.360** | **+0.247** | Primary predictor: project closure, reliability, delivery discipline |
| **`openness_to_experience`** | **0.310** | **+0.267** | Secondary predictor: algorithm innovation, business problem framing |
| **`agreeableness`** | **0.153** | **+0.079** | Teamwork, client rapport, cross-functional trust |
| **`extraversion`** | **0.146** | **+0.112** | Consultative executive presence, presentation assertiveness |
| **`neuroticism`** | **0.031** | **+0.121** | Lowest predictive importance |

- Visual Reference: [`outputs/figures/sds_personality/04_sds_feature_importance.png`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/figures/sds_personality/04_sds_feature_importance.png)
- Table Reference: [`outputs/tables/sds_personality/05_sds_feature_importance.csv`](file:///c:/Users/LENOVO/OneDrive/Desktop/ppt/project/anchor/outputs/tables/sds_personality/05_sds_feature_importance.csv)

---

## 5. Strategic Synthesis for Senior Data Scientists

1. **Beyond Technical Aptitude:** While technical fluency is mandatory to enter the senior tier, customer-facing organizational success is governed by psychometric traits.
2. **The "Execution + Curiosity" Archetype:** The most successful Senior Data Scientists are not solitary coders; they exhibit high **Conscientiousness** (delivering production models reliably to timeline) and high **Openness** (adapting to complex client domains and new AI paradigms).
3. **Executive Communication:** Moderate-to-high **Extraversion** enables senior practitioners to guide executive business stakeholders, converting analytical findings into tangible organizational action.
