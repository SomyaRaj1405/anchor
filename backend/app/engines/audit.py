"""Anchor Audit Engine.

Evaluates employer screening rules against the Anchor screening-rule library.
Conforms to Appendix A.5 and Section 5.2 of the Anchor Specification.
"""

import re

from app.schemas import (
    AuditResult,
    AuditResultItem,
    AuditRuleLibrary,
    AuditSummary,
    Provenance,
    RiskLevel,
)

RISK_ORDER = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}


def run_audit(rules: list[str], library: AuditRuleLibrary) -> AuditResult:
    """Evaluate employer screening rules against library patterns."""
    results: list[AuditResultItem] = []

    for raw in rules:
        text = raw.strip()
        if text == "":
            continue  # Blank lines are skipped

        # Strip one leading bullet or number marker
        text = re.sub(r"^([-*•]|\d+[.)])\s+", "", text)
        best = None

        for rule in library.rules:
            if any(re.search(p, text, re.IGNORECASE) for p in rule.patterns):
                rule_risk = RISK_ORDER.get(rule.risk_level.value, 0)
                best_risk = RISK_ORDER.get(best.risk_level.value, 0) if best else -1
                if best is None or rule_risk > best_risk:
                    best = rule  # Highest risk wins; ties keep earlier rule

        line_number = len(results) + 1
        if best:
            results.append(
                AuditResultItem(
                    line_number=line_number,
                    rule_text=text,
                    matched_rule_id=best.id,
                    matched_rule_name=best.name,
                    risk_level=best.risk_level,
                    impact=best.impact,
                    recommended_intervention=best.recommended_intervention,
                    evidence_ids=best.evidence_ids,
                    provenance=Provenance.MODELLED,
                )
            )
        else:
            results.append(
                AuditResultItem(
                    line_number=line_number,
                    rule_text=text,
                    matched_rule_id=None,
                    matched_rule_name=None,
                    risk_level=RiskLevel.NONE,
                    impact="No known risk pattern in the Anchor rule library.",
                    recommended_intervention=None,
                    evidence_ids=[],
                    provenance=None,
                )
            )

    counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0, "NONE": 0}
    for item in results:
        counts[item.risk_level.value] += 1

    summary = AuditSummary(
        total_rules=len(results),
        flagged=len(results) - counts["NONE"],
        high=counts["HIGH"],
        medium=counts["MEDIUM"],
        low=counts["LOW"],
        none=counts["NONE"],
    )

    return AuditResult(results=results, summary=summary)
