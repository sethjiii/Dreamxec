import { useState } from 'react';
import { submitMentorApplication, MentorApplicationData } from '../services/mentorService';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface FormErrors {
  [key: string]: string;
}

/* ─────────────────────────────────────────
   CSS — DreamXec Brutalist Style
───────────────────────────────────────── */
const CSS = `
  .mf-wrap {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    font-family: 'Space Grotesk', sans-serif;
    color: #003262;
    background: #fffbf5;
  }

  /* ── PROGRESS BAR ── */
  .mf-progress-wrap {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fffbf5;
    border-bottom: 3px solid #003262;
    padding: 0.75rem 0;
    margin-bottom: 2.5rem;
  }
  .mf-progress-label {
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #003262;
    margin-bottom: 0.4rem;
  }
  .mf-progress-track {
    height: 8px;
    background: #e8e0d4;
    border: 2px solid #003262;
    position: relative;
    overflow: hidden;
  }
  .mf-progress-fill {
    height: 100%;
    background: repeating-linear-gradient(
      -45deg,
      #FF7F00 0px, #FF7F00 6px,
      #003262 6px, #003262 12px
    );
    transition: width 0.4s cubic-bezier(.16,1,.3,1);
  }

  /* ── STATUS BANNERS ── */
  .mf-banner {
    border: 3px solid #003262;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  .mf-banner-success { background: #0B9C2C; color: #fff; box-shadow: 5px 5px 0 #003262; }
  .mf-banner-error   { background: #c0392b; color: #fff; box-shadow: 5px 5px 0 #003262; }
  .mf-banner-icon { font-size: 1.5rem; flex-shrink: 0; }
  .mf-banner-title { font-size: 0.85rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; }
  .mf-banner-msg { font-size: 0.88rem; font-weight: 600; margin-top: 0.2rem; opacity: 0.9; }

  /* ── SECTION ── */
  .mf-section {
    margin-bottom: 3rem;
    border: 3px solid #003262;
    background: #fff;
    box-shadow: 6px 6px 0 #FF7F00;
  }
  .mf-section-elite {
    box-shadow: 6px 6px 0 #0B9C2C;
  }
  .mf-section-head {
    background: #003262;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .mf-section-num {
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #FF7F00;
    background: rgba(255,127,0,0.15);
    border: 2px solid #FF7F00;
    padding: 0.2rem 0.6rem;
    flex-shrink: 0;
  }
  .mf-section-num-green { color: #0B9C2C; border-color: #0B9C2C; background: rgba(11,156,44,0.15); }
  .mf-section-title {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.3px;
    color: #fff;
    margin: 0;
  }
  .mf-section-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .mf-section-accent {
    height: 5px;
    background: #FF7F00;
  }
  .mf-section-accent-green { background: #0B9C2C; }

  /* ── GRID ── */
  .mf-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media(max-width: 600px) { .mf-grid-2 { grid-template-columns: 1fr; } }

  /* ── FIELD ── */
  .mf-field { display: flex; flex-direction: column; gap: 0.35rem; }
  .mf-label {
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #003262;
  }
  .mf-hint {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(0,50,98,0.55);
    line-height: 1.5;
    margin-bottom: 0.2rem;
  }
  .mf-req { color: #FF7F00; }

  /* ── INPUTS ── */
  .mf-input, .mf-textarea, .mf-select {
    background: #fffbf5;
    border: 3px solid #003262;
    padding: 0.65rem 0.9rem;
    font-size: 0.92rem;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    color: #003262;
    outline: none;
    transition: box-shadow 0.15s, transform 0.15s;
    width: 100%;
    box-sizing: border-box;
    appearance: none;
  }
  .mf-input:focus, .mf-textarea:focus, .mf-select:focus {
    box-shadow: 4px 4px 0 #FF7F00;
    transform: translate(-2px, -2px);
  }
  .mf-input::placeholder, .mf-textarea::placeholder {
    color: rgba(0,50,98,0.3);
    font-weight: 500;
  }
  .mf-textarea { resize: vertical; min-height: 110px; }

  /* number input */
  .mf-input[type="number"]::-webkit-inner-spin-button { opacity: 1; }

  /* ── SELECT WRAP ── */
  .mf-select-wrap { position: relative; }
  .mf-select { cursor: pointer; padding-right: 2.5rem; }
  .mf-select-arrow {
    position: absolute; right: 0.9rem; top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem; color: #003262;
    pointer-events: none; font-weight: 900;
  }

  /* ── CHECKBOX / RADIO ── */
  .mf-check-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }
  @media(max-width: 560px) { .mf-check-grid { grid-template-columns: 1fr; } }

  .mf-check-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    border: 2px solid #003262;
    padding: 0.6rem 0.9rem;
    background: #fffbf5;
    transition: background 0.12s, transform 0.12s, box-shadow 0.12s;
    font-size: 0.88rem;
    font-weight: 600;
    color: #003262;
    user-select: none;
  }
  .mf-check-label:hover {
    background: #fff3e0;
    transform: translate(-2px, -2px);
    box-shadow: 3px 3px 0 #FF7F00;
  }
  .mf-check-label.checked {
    background: #FF7F00;
    color: #003262;
    box-shadow: 3px 3px 0 #003262;
  }
  .mf-check-label input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }
  .mf-check-box {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 2px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 900;
  }

  /* radio row */
  .mf-radio-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .mf-radio-label {
    display: flex; align-items: center; gap: 0.6rem;
    cursor: pointer;
    border: 3px solid #003262;
    padding: 0.55rem 1.25rem;
    background: #fffbf5;
    font-size: 0.82rem; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.1em;
    transition: background 0.12s, transform 0.12s, box-shadow 0.12s;
    color: #003262;
    user-select: none;
  }
  .mf-radio-label:hover {
    transform: translate(-2px,-2px);
    box-shadow: 3px 3px 0 #FF7F00;
  }
  .mf-radio-label.selected {
    background: #003262;
    color: #FF7F00;
    box-shadow: 3px 3px 0 #FF7F00;
  }
  .mf-radio-label input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  /* ── TOGGLE CHECKBOX (public feature) ── */
  .mf-toggle-wrap {
    display: flex; align-items: flex-start; gap: 1rem;
    border: 3px solid #003262; padding: 1rem 1.25rem;
    background: #fffbf5; cursor: pointer;
    transition: background 0.12s, transform 0.12s, box-shadow 0.12s;
  }
  .mf-toggle-wrap:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 #FF7F00;
  }
  .mf-toggle-wrap.checked {
    background: #003262;
    box-shadow: 4px 4px 0 #FF7F00;
  }
  .mf-toggle-wrap.checked .mf-toggle-title { color: #FF7F00; }
  .mf-toggle-wrap.checked .mf-toggle-sub { color: rgba(255,255,255,0.6); }
  .mf-toggle-box {
    width: 24px; height: 24px; flex-shrink: 0;
    border: 3px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; font-weight: 900; margin-top: 0.1rem;
    color: #003262;
  }
  .mf-toggle-wrap.checked .mf-toggle-box { color: #FF7F00; }
  .mf-toggle-title { font-size: 0.88rem; font-weight: 900; color: #003262; }
  .mf-toggle-sub { font-size: 0.75rem; font-weight: 600; color: rgba(0,50,98,0.55); margin-top: 0.25rem; line-height: 1.5; }
  .mf-toggle-wrap input { display: none; }

  /* ── SUBMIT AREA ── */
  .mf-submit-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
    padding-top: 1rem;
    border-top: 4px solid #003262;
    margin-top: 1rem;
  }
  .mf-required-note {
    font-size: 0.7rem; font-weight: 700;
    color: rgba(0,50,98,0.55);
    text-transform: uppercase; letter-spacing: 0.12em;
    align-self: flex-start;
  }
  .mf-submit-btn {
    padding: 1.1rem 3rem;
    font-size: clamp(0.85rem, 1.5vw, 1rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #003262;
    background: #FF7F00;
    border: 4px solid #003262;
    box-shadow: 7px 7px 0 #003262;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .mf-submit-btn:hover:not(:disabled) {
    transform: translate(-3px, -3px);
    box-shadow: 10px 10px 0 #003262;
  }
  .mf-submit-btn:disabled {
    background: #ccc;
    box-shadow: 4px 4px 0 #999;
    cursor: not-allowed;
  }
  .mf-submit-btn.submitted {
    background: #0B9C2C;
    color: #fff;
    box-shadow: 7px 7px 0 #003262;
  }
  .mf-spinner {
    width: 16px; height: 16px;
    border: 3px solid #003262;
    border-top-color: transparent;
    border-radius: 50%;
    animation: mf-spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes mf-spin { to { transform: rotate(360deg) } }

  /* ── STRIPE ── */
  .mf-stripe {
    height: 10px;
    background: repeating-linear-gradient(-45deg, #003262 0px, #003262 8px, #FF7F00 8px, #FF7F00 16px);
    border-top: 3px solid #003262;
    border-bottom: 3px solid #003262;
    margin: 2rem 0;
  }
`;

/* ─────────────────────────────────────────
   SECTION HEADER COMPONENT
───────────────────────────────────────── */
interface SectionProps {
  num: string;
  title: string;
  elite?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ num, title, elite = false, children }) => (
  <div className={`mf-section${elite ? ' mf-section-elite' : ''}`}>
    <div className="mf-section-head">
      <span className={`mf-section-num${elite ? ' mf-section-num-green' : ''}`}>{num}</span>
      <h2 className="mf-section-title">{title}</h2>
    </div>
    <div className="mf-section-body">{children}</div>
    <div className={`mf-section-accent${elite ? ' mf-section-accent-green' : ''}`} />
  </div>
);

/* ─────────────────────────────────────────
   CUSTOM CHECKBOX
───────────────────────────────────────── */
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
  <label className={`mf-check-label${checked ? ' checked' : ''}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="mf-check-box">{checked ? '✓' : ''}</span>
    {label}
  </label>
);

/* ─────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, required, hint, children }) => (
  <div className="mf-field">
    <label className="mf-label">
      {label} {required && <span className="mf-req">*</span>}
    </label>
    {hint && <p className="mf-hint">{hint}</p>}
    {children}
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const MentorshipLeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<MentorApplicationData>({
    name: '',
    email: '',
    linkedin: '',
    role: '',
    organization: '',
    country: '',
    city: '',
    yearsOfExperience: 0,
    expertiseAreas: [],
    achievement: '',
    mentoringExperience: 'No',
    mentoringDescription: '',
    projectsOrResearch: '',
    mentorshipIntent: '',
    scenarioResponse: '',
    monthlyCommitment: '2-3 hours',
    mentorshipFormat: [],
    studentPreference: [],
    portfolioLinks: '',
    innovationImpactView: '',
    studentMistakeObservation: '',
    thirtyDayBuildPlan: '',
    publicMentorFeature: false,
    mentorReferral: '',
  });

  // ── Progress calculation ──
  const filledFields = [
    formData.name, formData.email, formData.role, formData.country,
    formData.achievement, formData.mentorshipIntent, formData.scenarioResponse,
    formData.innovationImpactView, formData.studentMistakeObservation,
    formData.expertiseAreas.length > 0 ? 'x' : '',
    formData.mentorshipFormat.length > 0 ? 'x' : '',
    formData.studentPreference.length > 0 ? 'x' : '',
  ].filter(Boolean).length;
  const totalRequired = 12;
  const progress = Math.round((filledFields / totalRequired) * 100);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleArrayChange = (
    fieldName: 'expertiseAreas' | 'mentorshipFormat' | 'studentPreference',
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const arr = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: checked ? [...arr, value] : arr.filter((i) => i !== value),
      } as typeof prev;
    });
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleMentoringExperienceChange = (value: 'Yes' | 'No') => {
    setFormData((prev) => ({
      ...prev,
      mentoringExperience: value,
      mentoringDescription: value === 'No' ? '' : prev.mentoringDescription,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    try {
      await submitMentorApplication(formData);
      setSubmitStatus('success');
      setSubmitMessage(
        `Your application has been submitted! We'll review it and get back to you at ${formData.email} within 5–7 business days.`
      );
      setTimeout(() => {
        setFormData({
          name: '', email: '', linkedin: '', role: '', organization: '',
          country: '', city: '', yearsOfExperience: 0, expertiseAreas: [],
          achievement: '', mentoringExperience: 'No', mentoringDescription: '',
          projectsOrResearch: '', mentorshipIntent: '', scenarioResponse: '',
          monthlyCommitment: '2-3 hours', mentorshipFormat: [], studentPreference: [],
          portfolioLinks: '', innovationImpactView: '', studentMistakeObservation: '',
          thirtyDayBuildPlan: '', publicMentorFeature: false, mentorReferral: '',
        });
        setSubmitStatus('idle');
      }, 6000);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(
        error instanceof Error ? error.message : 'Failed to submit. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const expertiseOptions = [
    'AI / Machine Learning', 'Blockchain / Web3', 'Software Engineering',
    'Product Management', 'Startup Building', 'Research & Innovation',
    'Finance / Venture Capital', 'Cybersecurity', 'Data Science',
    'Career Guidance', 'Other',
  ];
  const mentorshipFormatOptions = [
    '1:1 Mentorship', 'Group Mentorship', 'Project Guidance',
    'Research Guidance', 'Workshops',
  ];
  const studentPreferenceOptions = [
    'Beginners', 'Intermediate builders', 'Startup founders', 'Researchers',
  ];
  const commitmentOptions = ['2-3 hours', '4-6 hours', '6-10 hours', '10+ hours'];

  return (
    <>
      <style>{CSS}</style>
      <div className="mf-wrap">

        {/* ── PROGRESS BAR ── */}
        <div className="mf-progress-wrap">
          <div className="mf-progress-label">Application Progress — {progress}% Complete</div>
          <div className="mf-progress-track">
            <div className="mf-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── STATUS BANNERS ── */}
        {submitStatus === 'success' && (
          <div className="mf-banner mf-banner-success">
            <span className="mf-banner-icon">✅</span>
            <div>
              <div className="mf-banner-title">Application Submitted!</div>
              <div className="mf-banner-msg">{submitMessage}</div>
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mf-banner mf-banner-error">
            <span className="mf-banner-icon">⚠️</span>
            <div>
              <div className="mf-banner-title">Submission Failed</div>
              <div className="mf-banner-msg">{submitMessage}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ══════════════ §1 BASIC INFORMATION ══════════════ */}
          <Section num="01" title="Basic Information">
            <div className="mf-grid-2">
              <Field label="Full Name" required>
                <input className="mf-input" type="text" name="name"
                  value={formData.name} onChange={handleInputChange}
                  placeholder="Your full name" required />
              </Field>
              <Field label="Email Address" required>
                <input className="mf-input" type="email" name="email"
                  value={formData.email} onChange={handleInputChange}
                  placeholder="your.email@example.com" required />
              </Field>
              <Field label="LinkedIn Profile">
                <input className="mf-input" type="url" name="linkedin"
                  value={formData.linkedin} onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile" />
              </Field>
              <Field label="Current Role / Title" required>
                <input className="mf-input" type="text" name="role"
                  value={formData.role} onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer" required />
              </Field>
              <Field label="Organization / Company">
                <input className="mf-input" type="text" name="organization"
                  value={formData.organization} onChange={handleInputChange}
                  placeholder="e.g., Google, Startup, University" />
              </Field>
              <Field label="Country" required>
                <input className="mf-input" type="text" name="country"
                  value={formData.country} onChange={handleInputChange}
                  placeholder="e.g., India, USA" required />
              </Field>
              <Field label="City">
                <input className="mf-input" type="text" name="city"
                  value={formData.city} onChange={handleInputChange}
                  placeholder="e.g., Bangalore" />
              </Field>
              <Field label="Years of Professional Experience" required>
                <input className="mf-input" type="number" name="yearsOfExperience"
                  value={formData.yearsOfExperience} onChange={handleInputChange}
                  min="0" max="70" placeholder="0" required />
              </Field>
            </div>
          </Section>

          {/* ══════════════ §2 EXPERTISE ══════════════ */}
          <Section num="02" title="Area of Expertise — Select at least one">
            <div className="mf-check-grid">
              {expertiseOptions.map((opt) => (
                <Checkbox
                  key={opt} label={opt}
                  checked={formData.expertiseAreas.includes(opt)}
                  onChange={(checked) => handleArrayChange('expertiseAreas', opt, checked)}
                />
              ))}
            </div>
          </Section>

          {/* ══════════════ §3 CREDIBILITY CHECK ══════════════ */}
          <Section num="03" title="Credibility Check">
            <Field
              label="What is your strongest professional achievement?"
              required
              hint="Examples: Built a startup, Published research, Worked at a leading company, Built large scale systems"
            >
              <textarea className="mf-textarea" name="achievement"
                value={formData.achievement} onChange={handleInputChange}
                placeholder="Describe your strongest professional achievement..."
                rows={4} required />
            </Field>

            <Field label="Have you mentored students or professionals before?" required>
              <div className="mf-radio-row">
                {(['Yes', 'No'] as const).map((v) => (
                  <label
                    key={v}
                    className={`mf-radio-label${formData.mentoringExperience === v ? ' selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="mentoringExperience"
                      value={v}
                      checked={formData.mentoringExperience === v}
                      onChange={() => handleMentoringExperienceChange(v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>

            {formData.mentoringExperience === 'Yes' && (
              <Field label="Briefly describe your mentoring experience" required>
                <textarea className="mf-textarea" name="mentoringDescription"
                  value={formData.mentoringDescription || ''}
                  onChange={handleInputChange}
                  placeholder="Tell us about your mentoring experience..."
                  rows={4} required />
              </Field>
            )}

            <Field label="What projects, companies, or research have you worked on that students could learn from?">
              <textarea className="mf-textarea" name="projectsOrResearch"
                value={formData.projectsOrResearch || ''}
                onChange={handleInputChange}
                placeholder="Describe projects or research that demonstrate your expertise..."
                rows={4} />
            </Field>
          </Section>

          <div className="mf-stripe" />

          {/* ══════════════ §4 MENTORSHIP INTENT ══════════════ */}
          <Section num="04" title="Mentorship Intent">
            <Field
              label="Why do you want to mentor at DreamXec?"
              required
              hint="Good signals: Giving back to students, Helping innovation, Supporting research. Weak signals: Networking, Exposure"
            >
              <textarea className="mf-textarea" name="mentorshipIntent"
                value={formData.mentorshipIntent} onChange={handleInputChange}
                placeholder="Share your motivation for mentoring at DreamXec..."
                rows={4} required />
            </Field>
          </Section>

          {/* ══════════════ §5 SCENARIO QUESTION ══════════════ */}
          <Section num="05" title="Scenario Question — Mentor Quality Filter">
            <Field
              label="A student has a great idea but no technical skills. How would you guide them?"
              required
              hint="This helps us evaluate: Communication ability, Mentorship mindset, Problem solving approach"
            >
              <textarea className="mf-textarea" name="scenarioResponse"
                value={formData.scenarioResponse} onChange={handleInputChange}
                placeholder="Describe how you would mentor a student with a great idea but no technical skills..."
                rows={4} required />
            </Field>
          </Section>

          {/* ══════════════ §6 COMMITMENT ══════════════ */}
          <Section num="06" title="Commitment">
            <Field label="How many hours per month can you commit to mentoring?" required>
              <div className="mf-select-wrap">
                <select className="mf-select" name="monthlyCommitment"
                  value={formData.monthlyCommitment} onChange={handleInputChange}>
                  {commitmentOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt} / month</option>
                  ))}
                </select>
                <span className="mf-select-arrow">▾</span>
              </div>
            </Field>

            <Field label="Preferred mentorship format — Select at least one" required>
              <div className="mf-check-grid">
                {mentorshipFormatOptions.map((opt) => (
                  <Checkbox
                    key={opt} label={opt}
                    checked={formData.mentorshipFormat.includes(opt)}
                    onChange={(checked) => handleArrayChange('mentorshipFormat', opt, checked)}
                  />
                ))}
              </div>
            </Field>
          </Section>

          <div className="mf-stripe" />

          {/* ══════════════ §7 STUDENT IMPACT ══════════════ */}
          <Section num="07" title="Student Impact">
            <Field label="What kind of students do you prefer mentoring? — Select at least one" required>
              <div className="mf-check-grid">
                {studentPreferenceOptions.map((opt) => (
                  <Checkbox
                    key={opt} label={opt}
                    checked={formData.studentPreference.includes(opt)}
                    onChange={(checked) => handleArrayChange('studentPreference', opt, checked)}
                  />
                ))}
              </div>
            </Field>
          </Section>

          {/* ══════════════ §8 PROOF OF WORK ══════════════ */}
          <Section num="08" title="Proof of Work">
            <Field label="Portfolio / GitHub / Publications / Website">
              <textarea className="mf-textarea" name="portfolioLinks"
                value={formData.portfolioLinks || ''}
                onChange={handleInputChange}
                placeholder="Paste links to your portfolio, GitHub, research papers, website, etc."
                rows={3} />
            </Field>
          </Section>

          {/* ══════════════ §9 VALUES ALIGNMENT ══════════════ */}
          <Section num="09" title="Values Alignment">
            <Field label={'What does "innovation for impact" mean to you?'} required>
              <textarea className="mf-textarea" name="innovationImpactView"
                value={formData.innovationImpactView} onChange={handleInputChange}
                placeholder="Share your perspective on innovation for impact..."
                rows={4} required />
            </Field>
          </Section>

          {/* ══════════════ §10 FINAL FILTER ══════════════ */}
          <Section num="10" title="Final Filter Question">
            <Field
              label="What is one mistake most students make when building projects or startups?"
              required
            >
              <textarea className="mf-textarea" name="studentMistakeObservation"
                value={formData.studentMistakeObservation} onChange={handleInputChange}
                placeholder="Share your observation about common mistakes..."
                rows={4} required />
            </Field>
          </Section>

          <div className="mf-stripe" />

          {/* ══════════════ §11 ELITE FILTER (OPTIONAL) ══════════════ */}
          <Section num="11" title="Elite Filter Question — Optional" elite>
            <Field
              label="If you had to mentor a student to build something meaningful in 30 days, what would you make them build?"
              hint="Strong mentors usually provide structured answers. This is optional but helps us identify exceptional mentors."
            >
              <textarea className="mf-textarea" name="thirtyDayBuildPlan"
                value={formData.thirtyDayBuildPlan || ''}
                onChange={handleInputChange}
                placeholder="Describe a 30-day build plan for a student..."
                rows={4} />
            </Field>
          </Section>

          {/* ══════════════ §12 PUBLIC MENTOR FEATURE ══════════════ */}
          <Section num="12" title="Public Mentor Feature">
            <div
              className={`mf-toggle-wrap${formData.publicMentorFeature ? ' checked' : ''}`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, publicMentorFeature: !prev.publicMentorFeature }))
              }
            >
              <input type="checkbox" name="publicMentorFeature"
                checked={formData.publicMentorFeature || false} onChange={() => {}} />
              <span className="mf-toggle-box">{formData.publicMentorFeature ? '✓' : ''}</span>
              <div>
                <div className="mf-toggle-title">
                  I'm open to being featured publicly as a DreamXec mentor
                </div>
                <div className="mf-toggle-sub">
                  Selected mentors will be featured on our website and social media channels.
                </div>
              </div>
            </div>
          </Section>

          {/* ══════════════ §13 NETWORK EXPANSION ══════════════ */}
          <Section num="13" title="Network Expansion">
            <Field
              label="Who is one person you recommend as a mentor for DreamXec?"
              hint="Great mentors usually refer other strong mentors. This helps us expand our mentor network."
            >
              <textarea className="mf-textarea" name="mentorReferral"
                value={formData.mentorReferral || ''}
                onChange={handleInputChange}
                placeholder="Name and brief description of a person you'd recommend as a mentor..."
                rows={3} />
            </Field>
          </Section>

          {/* ══════════════ SUBMIT ══════════════ */}
          <div className="mf-submit-area">
            <p className="mf-required-note">* Required fields · Reviewed within 5–7 business days</p>
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className={`mf-submit-btn${submitStatus === 'success' ? ' submitted' : ''}`}
            >
              {isSubmitting ? (
                <><span className="mf-spinner" /> Submitting...</>
              ) : submitStatus === 'success' ? (
                <>✓ Application Submitted</>
              ) : (
                <>🎓 Submit Application →</>
              )}
            </button>
          </div>

        </form>
      </div>
    </>
  );
};