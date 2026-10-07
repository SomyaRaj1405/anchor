import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, RefreshCcw, ShieldCheck } from "lucide-react";
import { getDiagnosis, getSamples } from "../api/client";

const STORAGE_KEY = "anchor-check-profile-state";
const DEFAULT_FORM = {
  candidateId: "sample-a",
  experienceYears: 7.2,
  breakYears: 3,
  targetRole: "marketing_manager",
  resumeFormat: "chronological",
};

function getProfileDefaults(profile) {
  const base = profile?.profile || {};
  return {
    candidateId: profile?.id || DEFAULT_FORM.candidateId,
    experienceYears: Number(base.experience_years ?? DEFAULT_FORM.experienceYears),
    breakYears: Number(base.gap_years ?? DEFAULT_FORM.breakYears),
    targetRole: base.target_role_id || DEFAULT_FORM.targetRole,
    resumeFormat: String(base.resume_format || DEFAULT_FORM.resumeFormat).toLowerCase(),
  };
}

function getConfidenceInfo(result, form = DEFAULT_FORM) {
  if (!result) {
    return { label: "Not yet checked", value: "—" };
  }

  const barrierCount = Number(result?.summary?.barrier_count || 0);
  const experienceYears = Number(form.experienceYears || 0);
  const breakYears = Number(form.breakYears || 0);
  const formatWeight = form.resumeFormat === "chronological" ? 12 : 4;
  const breakWeight = Math.min(breakYears * 6, 18);
  const experienceWeight = experienceYears > 7 ? -6 : 6;
  const percentage = Math.max(46, Math.min(94, 100 - barrierCount * 11 - formatWeight - breakWeight + experienceWeight));
  const label = percentage >= 75 ? "High" : percentage >= 60 ? "Medium" : "Low";

  return {
    label,
    value: `${Math.round(percentage)}%`,
  };
}

export default function DiagnosePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [samples, setSamples] = useState([]);
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_FORM;
      const parsed = JSON.parse(saved);
      return parsed.form || DEFAULT_FORM;
    } catch {
      return DEFAULT_FORM;
    }
  });
  const [result, setResult] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed.result || null;
    } catch {
      return null;
    }
  });
  const [status, setStatus] = useState(() => {
    if (typeof window === "undefined") return "idle";
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return "idle";
      const parsed = JSON.parse(saved);
      return parsed.status || "idle";
    } catch {
      return "idle";
    }
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSamples = async () => {
      const data = await getSamples();
      const nextSamples = data?.profiles || [];
      setSamples(nextSamples);

      const requestedCase = searchParams.get("case") || form.candidateId || DEFAULT_FORM.candidateId;
      const matchedProfile = nextSamples.find((sample) => sample.id === requestedCase) || nextSamples[0];

      if (matchedProfile) {
        setForm((current) => ({
          ...DEFAULT_FORM,
          ...current,
          ...getProfileDefaults(matchedProfile),
        }));

        if (!searchParams.get("case")) {
          setSearchParams({ case: matchedProfile.id }, { replace: true });
        }
      }
    };

    loadSamples();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ form, result, status })
    );
  }, [form, result, status]);

  const roleOptions = useMemo(
    () =>
      [...new Set(samples.map((profile) => profile.profile?.target_role_id).filter(Boolean))].map((value) => ({
        value,
        label: value.replace(/_/g, " "),
      })),
    [samples]
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const handleCandidateChange = (event) => {
    const nextId = event.target.value;
    const nextSample = samples.find((sample) => sample.id === nextId) || samples[0];

    if (!nextSample) return;

    const updatedForm = {
      ...DEFAULT_FORM,
      ...getProfileDefaults(nextSample),
    };

    setForm(updatedForm);
    setSearchParams({ case: nextId }, { replace: true });
    setErrors({});
    setError("");
    setResult(null);
    setStatus("idle");
  };

  const validateForm = () => {
    const nextErrors = {};
    const experienceYears = Number(form.experienceYears);
    const breakYears = Number(form.breakYears);

    if (!form.candidateId) {
      nextErrors.candidateId = "Choose a profile to review.";
    }

    if (Number.isNaN(experienceYears) || experienceYears < 0 || experienceYears > 40) {
      nextErrors.experienceYears = "Use a value between 0 and 40 years.";
    }

    if (Number.isNaN(breakYears) || breakYears < 0 || breakYears > 20) {
      nextErrors.breakYears = "Use a value between 0 and 20 years.";
    }

    if (!form.targetRole) {
      nextErrors.targetRole = "Choose a target role.";
    }

    if (!form.resumeFormat) {
      nextErrors.resumeFormat = "Pick a resume format.";
    }

    return nextErrors;
  };

  const runCheck = async () => {
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setError("");
    setIsLoading(true);
    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      const data = await getDiagnosis(form.candidateId);
      setResult(data);
      setStatus("ready");
    } catch {
      setError("We couldn’t complete this check with the details you entered. Please try again.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const startOver = () => {
    const firstSample = samples[0] || { id: DEFAULT_FORM.candidateId, profile: { target_role_id: DEFAULT_FORM.targetRole } };
    const resetForm = {
      ...DEFAULT_FORM,
      ...getProfileDefaults(firstSample),
    };

    setForm(resetForm);
    setSearchParams({ case: resetForm.candidateId }, { replace: true });
    setResult(null);
    setError("");
    setErrors({});
    setStatus("idle");
  };

  const selectedProfile = samples.find((sample) => sample.id === form.candidateId) || samples[0];
  const confidence = getConfidenceInfo(result, form);

  const sentence = [
    result?.capability_check?.explanation ||
      result?.recommendation?.rationale ||
      "The profile is ready for a review, and a quick scan will show the main barrier or next step.",
    form.breakYears > 2
      ? "The longer break becomes more visible when the profile uses a chronological format and the dates are left at the top."
      : "The profile history is comparatively compact, so the risk comes more from how the fit is framed than from the gap itself.",
    form.resumeFormat === "chronological"
      ? "A chronological format increases the visibility of the gap for screening filters."
      : "A non-chronological format reduces the direct visibility of the gap in the first scan.",
  ].join(" ");

  const nextActions = [
    form.breakYears > 2
      ? "Reformat the profile to show cumulative years worked instead of a full date timeline."
      : "Highlight the strongest recent work and keep the role fit clear in the opening summary.",
    form.resumeFormat === "chronological"
      ? "Move the focus from dates to outcomes and role fit in the first few lines."
      : "Keep the same structure, but add a concise statement of immediate availability and recent proof points.",
    result?.recommendation?.prescribed_action || "Refresh the profile headline so the strongest fit is visible first.",
  ].slice(0, 3);

  return (
    <div className="check-profile-page">
      <header className="check-profile-header">
        <p className="check-profile-kicker">Check a profile</p>
        <h1>Check a profile</h1>
        <p>
          This review looks for the most likely reason a profile is being filtered out and shows the next step.
        </p>
      </header>

      <div className="check-profile-layout">
        <section className="check-profile-panel">
          <form className="check-profile-form" noValidate onSubmit={(event) => event.preventDefault()}>
            <div className="field-group">
              <label htmlFor="candidateId">Profile to review</label>
              <select
                id="candidateId"
                name="candidateId"
                value={form.candidateId}
                onChange={handleCandidateChange}
                aria-invalid={Boolean(errors.candidateId)}
              >
                {samples.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.title}
                  </option>
                ))}
              </select>
              {errors.candidateId && <span className="field-error">{errors.candidateId}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="experienceYears">Years of relevant experience</label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                max="40"
                step="0.1"
                value={form.experienceYears}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.experienceYears)}
              />
              <span className="field-helper">Use the total years relevant to the target role.</span>
              {errors.experienceYears && <span className="field-error">{errors.experienceYears}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="breakYears">Career break length</label>
              <input
                id="breakYears"
                name="breakYears"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={form.breakYears}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.breakYears)}
              />
              <span className="field-helper">Enter the number of years away from paid work.</span>
              {errors.breakYears && <span className="field-error">{errors.breakYears}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="targetRole">Target role</label>
              <select
                id="targetRole"
                name="targetRole"
                value={form.targetRole}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.targetRole)}
              >
                {roleOptions.length > 0 ? (
                  roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value={DEFAULT_FORM.targetRole}>{DEFAULT_FORM.targetRole}</option>
                )}
              </select>
              <span className="field-helper">This should match the role the profile is aiming for.</span>
              {errors.targetRole && <span className="field-error">{errors.targetRole}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="resumeFormat">Resume format</label>
              <select
                id="resumeFormat"
                name="resumeFormat"
                value={form.resumeFormat}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.resumeFormat)}
              >
                <option value="chronological">Chronological</option>
                <option value="functional">Functional</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <span className="field-helper">Most break-related filters are more sensitive to chronological screening.</span>
              {errors.resumeFormat && <span className="field-error">{errors.resumeFormat}</span>}
            </div>

            <p className="consent-line">
              This check uses the profile details you enter and the sample evidence in the product. It is not stored after this session.
            </p>

            <div className="form-actions">
              <button type="button" className="primary-button" onClick={runCheck} disabled={isLoading} aria-live="polite">
                {isLoading ? "Checking profile..." : "Run check"}
              </button>
              <button type="button" className="secondary-button" onClick={startOver}>
                Start over
              </button>
            </div>
          </form>
        </section>

        <section className="check-profile-output" aria-live="polite">
          {status === "idle" && (
            <div className="result-empty state-card">
              <div className="state-icon">
                <ShieldCheck size={22} />
              </div>
              <h2>Ready when you are</h2>
              <p>
                Select a profile and run the check to see the likely barrier, how confident the review is, and what to do next.
              </p>
              <button type="button" className="primary-button" onClick={runCheck}>
                Run check
              </button>
            </div>
          )}

          {status === "loading" && (
            <div className="state-card loading-card" aria-busy="true">
              <div className="loading-line short" />
              <div className="loading-line" />
              <div className="loading-line" />
              <div className="loading-line short" />
            </div>
          )}

          {status === "error" && (
            <div className="state-card error-card" role="alert">
              <div className="state-icon danger" aria-hidden="true">
                <AlertCircle size={20} />
              </div>
              <h2>We couldn’t complete the check</h2>
              <p>{error}</p>
              <button type="button" className="primary-button" onClick={runCheck}>
                Try again
              </button>
            </div>
          )}

          {status === "ready" && result && (
            <div className="result-card state-card" aria-live="polite">
              <div className="result-header">
                <div className="result-title-wrap">
                  <span className="result-kicker">Profile review</span>
                  <h2>{selectedProfile?.title || "Profile review"}</h2>
                </div>
                <button type="button" className="secondary-button" onClick={runCheck}>
                  Run again
                </button>
              </div>

              <div className="result-block">
                <h3>What we found</h3>
                <p>{sentence}</p>
              </div>

              <div className="result-block">
                <h3>How confident</h3>
                <div className="confidence-row">
                  <span className="result-label">Confidence</span>
                  <strong>{confidence.label}</strong>
                </div>
                <div className="confidence-row">
                  <span className="result-label">Level</span>
                  <strong>{confidence.value}</strong>
                </div>
              </div>

              <div className="result-block">
                <h3>What to do next</h3>
                <ul className="action-list">
                  {nextActions.map((action) => (
                    <li key={action}>
                      <span className="bullet-check">
                        <CheckCircle2 size={16} />
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="result-actions">
                <button type="button" className="primary-button" onClick={runCheck}>
                  Run again
                </button>
                <button type="button" className="secondary-button" onClick={startOver}>
                  Start over
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
