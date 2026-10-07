"""
Anchor: Data Analytics Career & Labor Market Intelligence Platform
==================================================================
Streamlit Application: app.py
Project: SAS Data Analytics Hackathon - Evaluation Demo
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import streamlit as st

# Ensure src/ is in python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from src.recommendation_engine import evaluate_career_profile

# Page Configuration
st.set_page_config(
    page_title="Anchor | Analytics & Career Intelligence",
    page_icon="⚓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1f4e79;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #555555;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        border-left: 5px solid #1f4e79;
        margin-bottom: 10px;
    }
    .highlight-card {
        background-color: #eef5fc;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #b8daff;
        margin-bottom: 15px;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_data
def load_all_datasets():
    cleaned_dir = BASE_DIR / "data" / "cleaned"
    df_ds = pd.read_csv(cleaned_dir / "DataScience_Jobs_cleaned.csv")
    df_aj = pd.read_csv(cleaned_dir / "Analytics_Jobs_cleaned.csv")
    df_jds = pd.read_csv(cleaned_dir / "JDS_Skill_Traits_cleaned.csv")
    df_sds = pd.read_csv(cleaned_dir / "SDS_Personality_Traits_cleaned.csv")
    return df_ds, df_aj, df_jds, df_sds


# Load data
try:
    df_ds, df_aj, df_jds, df_sds = load_all_datasets()
except (FileNotFoundError, ValueError, OSError) as e:
    st.error(f"Error loading datasets: {e}")
    st.stop()
    raise SystemExit(1)

# Sidebar Navigation
st.sidebar.image("https://img.icons8.com/fluency/96/anchor.png", width=64)
st.sidebar.title("Anchor Platform")
st.sidebar.markdown("**Evaluation Demo System**")

nav_choice = st.sidebar.radio(
    "Select Analysis Module:",
    [
        "1. Project Overview",
        "2. Job Market Analysis",
        "3. Technical Skills (JDS)",
        "4. Personality Traits (SDS)",
        "5. Integrated Career Insights",
        "6. Career Recommendation Engine"
    ]
)

st.sidebar.markdown("---")
st.sidebar.markdown("🎯 **SAS Data Analytics Hackathon**")
st.sidebar.caption("Dual Macro Labor Market & Micro Talent Study")


# =====================================================================
# SECTION 1: PROJECT OVERVIEW
# =====================================================================
if nav_choice == "1. Project Overview":
    st.markdown('<div class="main-header">Project Overview & Architecture</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Data Analytics Hackathon: End-to-End Labor Market & Human Capital Intelligence</div>', unsafe_allow_html=True)

    col1, col2 = st.columns([2, 1])
    with col1:
        st.markdown("""
        ### Problem Statement & Context
        The modern Data Science and Analytics landscape exhibits significant disconnects between:
        - **Market Hiring Signals:** What technical skills and seniority thresholds enterprises demand in recruitment postings.
        - **Early Career Advancement:** What specific competency combinations actually drive internal promotions and performance salary hikes.
        - **Senior Leadership Delivery:** What psychometric and behavioral traits predict client-facing delivery success in complex enterprise projects.

        **Objective:** Build a unified, evidence-based analytics platform synthesizing macro labor market postings with micro-level talent evaluation datasets, enabling transparent career diagnostics without black-box causal leaps.
        """)

    with col2:
        st.markdown('<div class="highlight-card">', unsafe_allow_html=True)
        st.markdown("#### Governance Principles")
        st.markdown("""
        - **Raw Data Preservation:** Zero alterations to source files.
        - **Isolated Cleaned Outputs:** Structured schemas in `data/cleaned/`.
        - **No Silent Loss:** 100% record accounting.
        - **Empirical Language:** Strict association rather than causal attribution.
        """)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("### Four Required Datasets Inventory")
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("1. DataScience Jobs", f"{len(df_ds):,} Rows", f"{len(df_ds.columns)} Columns", delta_color="off")
        st.caption("Macro hiring across 642 enterprise employers for 10 standardized roles")
    with col2:
        st.metric("2. Analytics Jobs", f"{len(df_aj):,} Rows", f"{len(df_aj.columns)} Columns", delta_color="off")
        st.caption("Granular job postings detailing designations, skills, and salary bands")
    with col3:
        st.metric("3. JDS Skill Traits", f"{len(df_jds):,} Rows", f"{len(df_jds.columns)} Columns", delta_color="off")
        st.caption("Junior evaluations across 5 technical competencies vs salary hike")
    with col4:
        st.metric("4. SDS Personality Traits", f"{len(df_sds):,} Rows", f"{len(df_sds.columns)} Columns", delta_color="off")
        st.caption("Senior Big Five psychometrics vs classified workplace success")

    st.markdown("---")
    st.markdown("### Dataset Ecosystem Architecture")
    st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "03_salary_distribution.png"), caption="Salary Distributions across Macro and Micro Hiring Layers", width="stretch")


# =====================================================================
# SECTION 2: JOB MARKET
# =====================================================================
elif nav_choice == "2. Job Market Analysis":
    st.markdown('<div class="main-header">Macro Job Market Intelligence</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Synthesis of 92,999 Enterprise Requisitions and 15,841 Granular Postings</div>', unsafe_allow_html=True)

    # Top KPI metrics
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Enterprise Requisitions", f"{df_ds['num_of_jobs'].sum():,}")
    col2.metric("Mean Market Salary (DS)", f"{df_ds['avg_salary'].mean():.2f} LPA")
    exp_corr = float(np.corrcoef(df_ds['min_experience'].astype(float), df_ds['avg_salary'].astype(float))[0, 1])
    col3.metric("Experience Elasticity (DS)", f"r = +{exp_corr:.3f}")
    col4.metric("Top Hiring Location", "Bengaluru (21.0%)")

    st.markdown("---")

    tab1, tab2, tab3 = st.tabs(["Job Roles & Compensation", "Hiring Companies & Locations", "Skills & Experience Dynamics"])

    with tab1:
        c1, c2 = st.columns(2)
        with c1:
            st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "01_top_10_job_titles.png"), width="stretch")
            st.caption("Business Analyst and Data Analyst represent 37.8% of all enterprise hiring volume.")
        with c2:
            st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "07_salary_by_job_role.png"), width="stretch")
            st.caption("Data Architect (25.1 LPA) and Senior Data Scientist (22.3 LPA) lead executive compensation.")

    with tab2:
        c1, c2 = st.columns(2)
        with c1:
            st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "02_top_10_companies_by_jobs.png"), width="stretch")
            st.caption("Top 10 employers account for 35.5% of total hiring; TCS leads with 9,064 open listings.")
        with c2:
            st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "06_top_locations.png"), width="stretch")
            st.caption("Bengaluru and Mumbai account for 33.6% of all analytics requisitions.")

    with tab3:
        c1, c2 = st.columns(2)
        with c1:
            st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "04_experience_vs_salary.png"), width="stretch")
            st.caption("Reaching >=15 LPA requires a mean minimum experience of 6.4 years (r = +0.593 in DS, +0.551 in Analytics).")
        with c2:
            st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "05_top_15_skills.png"), width="stretch")
            st.caption("SQL (915 jobs), Domain Analytics (904), and Python (840) form the universal technical trifecta.")


# =====================================================================
# SECTION 3: TECHNICAL SKILLS (JDS)
# =====================================================================
elif nav_choice == "3. Technical Skills (JDS)":
    st.markdown('<div class="main-header">Junior Data Scientist Skill Traits Analysis</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Competency Driver Modeling for Annual Performance Salary Hikes (N=139)</div>', unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Evaluated Practitioners", "139 Candidates")
    col2.metric("Target Balance", "52.5% High / 47.5% Low")
    col3.metric("Top Driver (Correlation)", "Storytelling (r = +0.554)")
    col4.metric("Logistic Regression CV Acc", "81.3%")

    st.markdown("---")

    col1, col2 = st.columns(2)
    with col1:
        st.image(str(BASE_DIR / "outputs" / "figures" / "jds_skills" / "03_jds_group_comparison.png"), width="stretch")
        st.markdown("""
        **Key Group Difference Finding:**
        - High-hike recipients score **4.83 / 5.00 in Storytelling** vs 3.84 for low-hike peers (**+25.8% delta**).
        - High-hike recipients score **4.69 in Maths/Stats** vs 3.85 (**+21.8% delta**).
        - In contrast, `big_data_skills` shows only a negligible **+5.1% delta**, indicating distributed infrastructure is secondary for early-stage merit hikes.
        """)

    with col2:
        st.image(str(BASE_DIR / "outputs" / "figures" / "jds_skills" / "04_jds_feature_importance.png"), width="stretch")
        st.markdown("""
        **Multivariate Modeling Finding:**
        - **Random Forest:** `dashboard_and_storytelling_skills` is the #1 feature (0.297 Gini importance).
        - **Logistic Regression:** `maths-stats_skills` has the highest odds ratio (**4.27x higher odds of high hike** per 1-unit increase).
        """)

    st.markdown("---")
    c1, c2 = st.columns(2)
    with c1:
        st.image(str(BASE_DIR / "outputs" / "figures" / "jds_skills" / "02_jds_skill_correlations.png"), width="stretch")
    with c2:
        st.image(str(BASE_DIR / "outputs" / "figures" / "jds_skills" / "05_jds_confusion_matrix.png"), width="stretch")


# =====================================================================
# SECTION 4: PERSONALITY TRAITS (SDS)
# =====================================================================
elif nav_choice == "4. Personality Traits (SDS)":
    st.markdown('<div class="main-header">Senior Data Scientist Personality Analysis</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Big Five / EPQ Psychometric Predictors of Customer-Facing Success (N=161)</div>', unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Senior Scientists", "161 Practitioners")
    col2.metric("Target Balance", "52.8% High / 47.2% Low")
    col3.metric("Top Predictor", "Conscientiousness (r = +0.680)")
    col4.metric("Random Forest CV Acc", "94.4%")

    st.markdown("---")

    col1, col2 = st.columns(2)
    with col1:
        st.image(str(BASE_DIR / "outputs" / "figures" / "sds_personality" / "03_sds_group_comparison.png"), width="stretch")
        st.markdown("""
        **The High-Success Personality Signature:**
        - **Conscientiousness:** High performers average **53.6 vs 35.8 (+49.9% delta)**.
        - **Openness to Experience:** High performers average **48.5 vs 33.3 (+45.6% delta)**.
        - **Extraversion:** High performers average **48.9 vs 36.9 (+32.4% delta)**.
        - **Neuroticism:** Effectively zero difference (-0.4% delta; r = -0.006). Emotional reactivity does not discriminate senior success.
        """)

    with col2:
        st.image(str(BASE_DIR / "outputs" / "figures" / "sds_personality" / "04_sds_feature_importance.png"), width="stretch")
        st.markdown("""
        **Predictive Importance (67.0% Concentrated in 2 Traits):**
        - **Conscientiousness (0.360):** Governs reliable project closure, disciplined execution, and code reproducibility.
        - **Openness to Experience (0.310):** Governs creative algorithmic problem solving and rapid adoption of novel AI paradigms.
        """)

    st.markdown("---")
    c1, c2 = st.columns(2)
    with c1:
        st.image(str(BASE_DIR / "outputs" / "figures" / "sds_personality" / "02_sds_personality_correlations.png"), width="stretch")
    with c2:
        st.image(str(BASE_DIR / "outputs" / "figures" / "sds_personality" / "05_sds_confusion_matrix.png"), width="stretch")


# =====================================================================
# SECTION 5: CAREER INSIGHTS
# =====================================================================
elif nav_choice == "5. Integrated Career Insights":
    st.markdown('<div class="main-header">Integrated Talent Ecosystem Insights</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Evidence-Based Synthesis Across All Four Hackathon Datasets</div>', unsafe_allow_html=True)

    st.markdown("""
    <div class="highlight-card">
    <b>Methodological Notice:</b> These insights represent a conceptual integration across macro labor market hiring (108k+ total data points) and internal employee appraisals (300 practitioners). Datasets were NOT falsely merged row-by-row.
    </div>
    """, unsafe_allow_html=True)

    try:
        matrix_df = pd.read_csv(BASE_DIR / "outputs" / "tables" / "integrated_career_insights.csv")
        st.dataframe(matrix_df, width="stretch")
    except (FileNotFoundError, ValueError, OSError) as e:
        st.warning(f"Could not load integrated table: {e}")

    st.markdown("---")
    col1, col2 = st.columns(2)

    with col1:
        st.image(str(BASE_DIR / "outputs" / "figures" / "job_market" / "08_skills_vs_salary.png"), width="stretch")
        st.markdown("""
        #### High-Paying Technical Premium
        - **R (16.27 LPA), Machine Learning (15.82 LPA), SAS (15.48 LPA)** command top compensation premiums. Over 46% to 50% of requisitions for these skills offer >=15 LPA.
        - **Excel (8.84 LPA) and SEO (7.54 LPA)** cluster heavily in entry compensation brackets (<6 LPA).
        """)

    with col2:
        st.markdown("#### Strategic Career Takeaways")
        st.markdown("""
        1. **The Translation Multiplier:** While coding and SQL get candidates hired (Layer 1), executive visual storytelling is the **#1 catalyst for merit salary increases (Layer 2)**.
        2. **Senior Execution Engine:** Senior enterprise success is not predicted by technical coding hours, but by **Conscientiousness (0.360)** and **Openness to Experience (0.310)** (Layer 3).
        3. **Beginner Roadmap:**
           - *Weeks 1–12:* Master SQL & Python + foundational statistics.
           - *Months 3–6:* Learn visual storytelling (Power BI / Tableau) + Scikit-learn ML.
           - *Ongoing:* Develop disciplined documentation and project closure habits.
        """)


# =====================================================================
# SECTION 6: CAREER RECOMMENDATION
# =====================================================================
elif nav_choice == "6. Career Recommendation Engine":
    st.markdown('<div class="main-header">Explainable Career Diagnostics Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Interactive Evaluation Based on Empirical Market & Talent Benchmarks</div>', unsafe_allow_html=True)

    st.markdown("""
    Select your current technical competency levels and behavioral traits below to receive:
    1. **Empirical Archetype Fit Score** across 5 primary Data Science career paths
    2. **Quantified Skill Gap Analysis**
    3. **Evidence-Based Priority Roadmap** for high-ROI advancement
    """)

    col_input1, col_input2 = st.columns(2)

    with col_input1:
        st.subheader("1. Technical Competencies (Scale 1.0 to 5.0)")
        s_story = st.slider("Visual Analytics & Storytelling", 1.0, 5.0, 3.8, 0.1, help="BI dashboards, executive presentations, communication")
        s_maths = st.slider("Maths, Probability & Statistics", 1.0, 5.0, 4.0, 0.1, help="Hypothesis testing, probability, regression models")
        s_coding = st.slider("Scripting & Software Engineering", 1.0, 5.0, 4.2, 0.1, help="Python, SQL, SAS, algorithms, data structures")
        s_aiml = st.slider("Machine Learning & AI", 1.0, 5.0, 3.9, 0.1, help="Predictive models, deep learning, Scikit-learn")
        s_bigdata = st.slider("Big Data & Distributed Systems", 1.0, 5.0, 3.2, 0.1, help="Hadoop, Spark, Hive, data pipelines")

    with col_input2:
        st.subheader("2. Behavioral & Career Context")
        p_cons = st.slider("Conscientiousness (Goal-Directed Delivery)", 17, 68, 52, 1, help="Standardized EPQ score: reliability, thoroughness, diligence")
        p_open = st.slider("Openness to Experience (Curiosity & Innovation)", 17, 68, 48, 1, help="Creative problem framing, adopting novel methods")
        p_extra = st.slider("Extraversion (Assertiveness & Communication)", 17, 68, 44, 1, help="Client interaction, persuasive presentations")
        p_agree = st.slider("Agreeableness (Cooperation & Teamwork)", 17, 68, 46, 1, help="Collaborative rapport, empathy")
        p_neuro = st.slider("Neuroticism (Stress Sensitivity)", 17, 68, 32, 1, help="Emotional reactivity (lower indicates higher stability)")
        exp_years = st.slider("Current Career Experience (Years)", 0.0, 15.0, 2.5, 0.5)

    user_skills = {
        "dashboard_and_storytelling_skills": s_story,
        "maths_stats_skills": s_maths,
        "coding_skills": s_coding,
        "ai_and_ml_skills": s_aiml,
        "big_data_skills": s_bigdata
    }
    user_pers = {
        "conscientiousness": float(p_cons),
        "openness_to_experience": float(p_open),
        "extraversion": float(p_extra),
        "agreeableness": float(p_agree),
        "neuroticism": float(p_neuro)
    }

    st.markdown("---")
    # Always evaluate diagnostic result from current inputs so res is never unbound
    res = evaluate_career_profile(user_skills, user_pers, user_experience_years=exp_years)

    st.button("🔄 Recalculate Career Diagnostic Evaluation", type="primary", width="stretch")

    col_res1, col_res2 = st.columns([1, 1])

    with col_res1:
        st.success(f"### Recommended Primary Direction:\n**{res['primary_track_title']}**")
        st.metric("Profile Alignment Score", f"{res['primary_fit_score']}%", f"Alternative Track: {res['secondary_track']} ({res['secondary_fit_score']}%)", delta_color="off")

        st.markdown("#### Fit Scores across All Career Tracks:")
        fit_df = pd.DataFrame(list(res["all_fit_scores"].items()), columns=["Career Track", "Alignment Score (%)"]).sort_values(by="Alignment Score (%)", ascending=False)
        st.dataframe(fit_df, width="stretch")

    with col_res2:
        st.markdown("#### Priority Skills to Develop (Evidence-Backed):")
        for item in res["priority_skills_to_improve"]:
            st.markdown(f"**• {item['skill']}** (Current: {item['current_rating']} → Target: {item['target']})")
            st.caption(f"_{item['rationale']}_")

        if res["development_areas"]:
            st.markdown("#### Competency Gap Summary:")
            gap_df = pd.DataFrame(res["development_areas"])
            st.dataframe(gap_df[["competency", "current_score", "benchmark_target", "gap", "priority"]], width="stretch")

    st.markdown("---")
    st.markdown("### Transparent Decision Explanation & Empirical Evidence")
    st.markdown(res["explanation"])
    st.info(f"ℹ️ **Governance Disclaimer:** {res['disclaimer']}")
