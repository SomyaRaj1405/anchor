"""
Anchor Career Recommendation Engine - SAS Data Analytics Hackathon
===================================================================
Script: src/recommendation_engine.py
Phase: 5 — Explainable & Transparent Career Recommendation Engine

Core Philosophy:
- Empirical evidence-based recommendations derived from:
  1. Job Market Requisitions (DataScience Jobs + Analytics Jobs)
  2. Junior Performance & Merit Hike Drivers (JDS Skill Traits)
  3. Senior Workplace Success Predictors (SDS Personality Traits)
- Transparent, heuristic scoring without false black-box claims of guaranteed career outcomes.
- Quantifiable gap analysis, priority skill roadmaps, and evidence-backed rationale.
"""

from typing import Dict, Any, List


# Career Track Archetype Target Profiles
# Scores: Skills (1.0 - 5.0 scale), Personality (17 - 68 normative scale)
CAREER_ARCHETYPES = {
    "Data Scientist": {
        "title": "Data Scientist (Predictive Modeling & Statistical Computing)",
        "description": "Specializes in framing business hypotheses, building supervised/unsupervised machine learning models, and conducting rigorous statistical validation.",
        "market_context": "11,703 openings in DS jobs (12.6% share); average compensation 13.53 LPA (senior tier reaches 22.29 LPA).",
        "benchmark_skills": {
            "maths_stats_skills": 4.5,
            "ai_and_ml_skills": 4.5,
            "coding_skills": 4.2,
            "dashboard_and_storytelling_skills": 4.0,
            "big_data_skills": 3.5
        },
        "benchmark_personality": {
            "conscientiousness": 52.0,
            "openness_to_experience": 50.0,
            "extraversion": 44.0,
            "agreeableness": 45.0,
            "neuroticism": 34.0
        },
        "target_skills_keywords": ["Python", "Machine Learning", "R", "SQL", "Statistics", "Deep Learning"],
        "recommended_min_exp": 2.0
    },
    "Data Engineer": {
        "title": "Data Engineer (Big Data & Distributed Architecture)",
        "description": "Designs, implements, and maintains scalable data ingestion pipelines, cloud warehouses, and distributed processing infrastructure.",
        "market_context": "11,215 openings in DS jobs (12.1% share); average compensation 11.81 LPA (senior tier reaches 19.00 LPA).",
        "benchmark_skills": {
            "big_data_skills": 4.6,
            "coding_skills": 4.5,
            "maths_stats_skills": 3.8,
            "ai_and_ml_skills": 3.5,
            "dashboard_and_storytelling_skills": 3.2
        },
        "benchmark_personality": {
            "conscientiousness": 55.0,
            "openness_to_experience": 45.0,
            "extraversion": 40.0,
            "agreeableness": 44.0,
            "neuroticism": 35.0
        },
        "target_skills_keywords": ["SQL", "Java", "Hadoop", "Spark", "Hive", "Python", "Cloud (AWS/GCP)"],
        "recommended_min_exp": 1.5
    },
    "Business Analyst / Analytics Translator": {
        "title": "Business Analyst / Analytics Translator (Bridge & Strategy)",
        "description": "Translates executive business challenges into quantitative analytical requisitions, synthesizes BI dashboards, and drives cross-functional delivery.",
        "market_context": "17,994 openings in DS jobs (19.4% share, #1 volume role); average compensation 8.95 LPA (senior tier reaches 13.17 LPA).",
        "benchmark_skills": {
            "dashboard_and_storytelling_skills": 4.8,
            "maths_stats_skills": 4.0,
            "coding_skills": 3.6,
            "ai_and_ml_skills": 3.2,
            "big_data_skills": 3.0
        },
        "benchmark_personality": {
            "extraversion": 52.0,
            "conscientiousness": 50.0,
            "agreeableness": 48.0,
            "openness_to_experience": 44.0,
            "neuroticism": 32.0
        },
        "target_skills_keywords": ["SQL", "Excel", "Business Analysis", "Power BI/Tableau", "Project Management"],
        "recommended_min_exp": 2.0
    },
    "Machine Learning Engineer": {
        "title": "Machine Learning Engineer (Production Systems & MLOps)",
        "description": "Focuses on deploying, serving, monitoring, and optimizing production-grade deep learning and machine learning algorithms at scale.",
        "market_context": "1,223 openings in DS jobs; average compensation 9.85 LPA at entry with rapid salary acceleration.",
        "benchmark_skills": {
            "coding_skills": 4.8,
            "ai_and_ml_skills": 4.8,
            "maths_stats_skills": 4.2,
            "big_data_skills": 4.0,
            "dashboard_and_storytelling_skills": 3.4
        },
        "benchmark_personality": {
            "conscientiousness": 54.0,
            "openness_to_experience": 52.0,
            "extraversion": 42.0,
            "agreeableness": 43.0,
            "neuroticism": 35.0
        },
        "target_skills_keywords": ["Python", "PyTorch/TensorFlow", "MLOps", "Docker", "Algorithms", "SQL"],
        "recommended_min_exp": 1.0
    },
    "Data Architect": {
        "title": "Data Architect (Enterprise Architecture & Strategy)",
        "description": "Defines enterprise data strategy, governance frameworks, multi-cloud architectures, and long-term organizational data modeling.",
        "market_context": "810 specialized executive openings; highest paying role in market (25.09 LPA mean, up to 102.0 LPA).",
        "benchmark_skills": {
            "big_data_skills": 4.8,
            "coding_skills": 4.5,
            "dashboard_and_storytelling_skills": 4.5,
            "maths_stats_skills": 4.2,
            "ai_and_ml_skills": 4.0
        },
        "benchmark_personality": {
            "conscientiousness": 58.0,
            "openness_to_experience": 52.0,
            "extraversion": 48.0,
            "agreeableness": 46.0,
            "neuroticism": 30.0
        },
        "target_skills_keywords": ["Enterprise Data Models", "Cloud Architecture", "Distributed Systems", "Governance"],
        "recommended_min_exp": 9.0
    }
}


def calculate_archetype_fit(
    user_skills: Dict[str, float],
    user_personality: Dict[str, float],
    user_exp: float,
    archetype_key: str
) -> float:
    """Computes an explainable weighted alignment score (0% to 100%)."""
    arch = CAREER_ARCHETYPES[archetype_key]
    bench_skills = arch["benchmark_skills"]
    bench_pers = arch["benchmark_personality"]

    # 1. Technical skill alignment (60% total weight)
    skill_diffs = []
    for skill_name, target_val in bench_skills.items():
        user_val = user_skills.get(skill_name, 3.0)
        # Normalized skill distance (scale 1 to 5, range = 4.0)
        diff = max(0.0, target_val - user_val) / 4.0
        skill_diffs.append(diff)
    avg_skill_gap = sum(skill_diffs) / len(skill_diffs)
    skill_score = max(0.0, 1.0 - avg_skill_gap) * 60.0

    # 2. Personality alignment (30% total weight)
    pers_diffs = []
    for trait_name, target_val in bench_pers.items():
        user_val = user_personality.get(trait_name, 40.0)
        # For neuroticism, lower is preferred; for others, higher/closer is preferred
        if trait_name == "neuroticism":
            gap = max(0.0, user_val - target_val) / 51.0
        else:
            gap = max(0.0, target_val - user_val) / 51.0
        pers_diffs.append(gap)
    avg_pers_gap = sum(pers_diffs) / len(pers_diffs)
    pers_score = max(0.0, 1.0 - avg_pers_gap) * 30.0

    # 3. Experience alignment (10% total weight)
    req_exp = arch["recommended_min_exp"]
    if user_exp >= req_exp:
        exp_score = 10.0
    else:
        exp_score = max(0.0, (user_exp / req_exp) * 10.0)

    total_fit = round(skill_score + pers_score + exp_score, 1)
    return min(100.0, total_fit)


def evaluate_career_profile(
    user_skills: Dict[str, float],
    user_personality: Dict[str, float],
    user_experience_years: float = 2.0
) -> Dict[str, Any]:
    """
    Main evaluation function:
    Returns full explainable recommendation dictionary.
    """
    # 1. Calculate fit across all archetypes
    fit_scores = {}
    for arch_key in CAREER_ARCHETYPES.keys():
        fit_scores[arch_key] = calculate_archetype_fit(
            user_skills, user_personality, user_experience_years, arch_key
        )

    # Sort archetypes by fit
    ranked_archetypes = sorted(fit_scores.items(), key=lambda x: x[1], reverse=True)
    primary_track = ranked_archetypes[0][0]
    secondary_track = ranked_archetypes[1][0]
    primary_info = CAREER_ARCHETYPES[primary_track]

    # 2. Gap analysis for primary track
    development_areas = []
    for skill_name, target_val in primary_info["benchmark_skills"].items():
        current_val = user_skills.get(skill_name, 3.0)
        gap = round(target_val - current_val, 2)
        if gap > 0.3:
            development_areas.append({
                "competency": skill_name.replace("_skills", "").replace("_", " ").title(),
                "current_score": current_val,
                "benchmark_target": target_val,
                "gap": gap,
                "priority": "High" if gap >= 0.8 else "Medium"
            })
    development_areas.sort(key=lambda x: x["gap"], reverse=True)

    # 3. Priority skills to improve (Cross-referenced with Hackathon empirical evidence)
    priority_skills = []
    # Check Storytelling
    st_val = user_skills.get("dashboard_and_storytelling_skills", 3.0)
    if st_val < 4.2:
        priority_skills.append({
            "skill": "Executive Dashboarding & Storytelling",
            "current_rating": st_val,
            "target": 4.5,
            "rationale": "Empirical JDS Evidence: Storytelling is the #1 linear correlate with junior salary hikes (r = +0.554, RF Importance = 0.297). High-hike recipients score 4.83 vs 3.84."
        })
    # Check Maths/Stats
    ms_val = user_skills.get("maths_stats_skills", 3.0)
    if ms_val < 4.2:
        priority_skills.append({
            "skill": "Mathematical & Statistical Modeling",
            "current_rating": ms_val,
            "target": 4.5,
            "rationale": "Empirical JDS Evidence: Maths/Stats yields the highest per-unit odds ratio (4.27x higher odds of high salary hike). Market postings for R/SAS command a 15.5L–16.3L premium."
        })
    # Check AI/ML
    ml_val = user_skills.get("ai_and_ml_skills", 3.0)
    if ml_val < 4.0:
        priority_skills.append({
            "skill": "Machine Learning & Predictive Algorithms",
            "current_rating": ml_val,
            "target": 4.5,
            "rationale": "Empirical Market Evidence: 46.3% of postings requiring Machine Learning offer >=15 LPA (average associated salary: 15.82 LPA)."
        })
    # Check Conscientiousness
    cons_val = user_personality.get("conscientiousness", 40.0)
    if cons_val < 48.0:
        priority_skills.append({
            "skill": "Delivery Rigor & Reproducibility (Conscientiousness)",
            "current_rating": cons_val,
            "target": 52.0,
            "rationale": "Empirical SDS Evidence: Conscientiousness is the single strongest predictor of Senior Data Scientist workplace success (r = +0.680, RF Importance = 0.360)."
        })

    # 4. Transparent Explanation
    explanation_points = [
        f"**Primary Career Fit:** Your profile aligns most closely with **{primary_info['title']}** with an empirical fit score of **{ranked_archetypes[0][1]}%**.",
        f"**Secondary Career Track:** Your secondary alternative track is **{CAREER_ARCHETYPES[secondary_track]['title']}** (**{ranked_archetypes[1][1]}% fit**).",
        f"**Market Context:** {primary_info['market_context']}",
        f"**Experience Requirement:** Roles in this archetype recommend at least **{primary_info['recommended_min_exp']} years** of baseline career experience. You provided **{user_experience_years} years**.",
        "**Evidence-Based Decision Logic:**",
        "• *JDS Talent Data:* Emphasizes technical proficiency backed by executive storytelling. Even in highly technical data science roles, communication is the primary catalyst for commercial advancement.",
        "• *SDS Leadership Data:* Client-facing success is anchored in high Conscientiousness (rigorous execution) and high Openness to Experience (intellectual agility).",
        "• *Market Hiring Data:* High-paying enterprise compensation (>=15 LPA) requires pairing core database/programming skills (SQL, Python) with predictive machine learning frameworks."
    ]

    return {
        "candidate_experience_years": user_experience_years,
        "primary_track": primary_track,
        "primary_track_title": primary_info["title"],
        "primary_fit_score": ranked_archetypes[0][1],
        "secondary_track": secondary_track,
        "secondary_track_title": CAREER_ARCHETYPES[secondary_track]["title"],
        "secondary_fit_score": ranked_archetypes[1][1],
        "all_fit_scores": fit_scores,
        "development_areas": development_areas,
        "priority_skills_to_improve": priority_skills[:3],
        "explanation": "\n\n".join(explanation_points),
        "disclaimer": "This recommendation provides structured decision support based on empirical observational data from 4 hackathon datasets. It is not an automated employment guarantee."
    }


if __name__ == "__main__":
    # Test sample profile
    test_skills = {
        "big_data_skills": 3.2,
        "maths_stats_skills": 4.1,
        "coding_skills": 4.0,
        "ai_and_ml_skills": 3.8,
        "dashboard_and_storytelling_skills": 3.6
    }
    test_pers = {
        "neuroticism": 32.0,
        "extraversion": 46.0,
        "openness_to_experience": 48.0,
        "agreeableness": 46.0,
        "conscientiousness": 50.0
    }
    result = evaluate_career_profile(test_skills, test_pers, user_experience_years=2.5)
    print("=== CAREER RECOMMENDATION ENGINE TEST ===")
    print(f"Primary Track: {result['primary_track_title']} (Fit: {result['primary_fit_score']}%)")
    print(f"Secondary Track: {result['secondary_track_title']} (Fit: {result['secondary_fit_score']}%)")
    print("\nPriority Skills to Improve:")
    for p in result["priority_skills_to_improve"]:
        print(f"- {p['skill']}: {p['rationale']}")
