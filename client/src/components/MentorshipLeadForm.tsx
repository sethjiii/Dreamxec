import { useState } from 'react';
import { submitMentorApplication, MentorApplicationData } from '../services/mentorService';

interface FormErrors {
  [key: string]: string;
}

export const MentorshipLeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<MentorApplicationData>({
    // Basic Information
    name: '',
    email: '',
    linkedin: '',
    role: '',
    organization: '',
    country: '',
    city: '',
    yearsOfExperience: 0,

    // Area of Expertise
    expertiseAreas: [],

    // Credibility Check
    achievement: '',
    mentoringExperience: 'No',
    mentoringDescription: '',
    projectsOrResearch: '',

    // Mentorship Intent
    mentorshipIntent: '',

    // Scenario Question
    scenarioResponse: '',

    // Commitment
    monthlyCommitment: '2-3 hours',
    mentorshipFormat: [],

    // Student Impact
    studentPreference: [],

    // Proof of Work
    portfolioLinks: '',

    // Values Alignment
    innovationImpactView: '',

    // Final Filter Question
    studentMistakeObservation: '',

    // Elite Filter (Optional)
    thirtyDayBuildPlan: '',

    // Public Feature
    publicMentorFeature: false,

    // Network Expansion
    mentorReferral: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleArrayChange = (
    fieldName: 'expertiseAreas' | 'mentorshipFormat' | 'studentPreference',
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...currentArray, value],
        } as typeof prev;
      } else {
        return {
          ...prev,
          [fieldName]: currentArray.filter((item) => item !== value),
        } as typeof prev;
      }
    });

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
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
        `Thank you for your application! We'll review it and get back to you at ${formData.email} within 5-7 business days.`
      );

      // Reset form
      setTimeout(() => {
        setFormData({
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
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const expertiseOptions = [
    'AI / Machine Learning',
    'Blockchain / Web3',
    'Software Engineering',
    'Product Management',
    'Startup Building',
    'Research & Innovation',
    'Finance / Venture Capital',
    'Cybersecurity',
    'Data Science',
    'Career Guidance',
    'Other',
  ];

  const mentorshipFormatOptions = [
    '1:1 Mentorship',
    'Group Mentorship',
    'Project Guidance',
    'Research Guidance',
    'Workshops',
  ];

  const studentPreferenceOptions = ['Beginners', 'Intermediate builders', 'Startup founders', 'Researchers'];

  const commitmentOptions = ['2-3 hours', '4-6 hours', '6-10 hours', '10+ hours'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Submit Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">✓ Success!</p>
            <p className="text-sm mt-1">{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">✗ Error</p>
            <p className="text-sm mt-1">{submitMessage}</p>
          </div>
        )}

        {/* SECTION 1: BASIC INFORMATION */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">1. Basic Information</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
                required
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              />
            </div>

            {/* Current Role */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">Current Role / Title *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
                required
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">Organization / Company</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="e.g., Google, Startup, University"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g., India, USA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
                Years of Professional Experience *
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                max="70"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* SECTION 2: AREA OF EXPERTISE */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">
            2. Area of Expertise (Select at least one) *
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expertiseOptions.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.expertiseAreas.includes(option)}
                  onChange={(e) => handleArrayChange('expertiseAreas', option, e.target.checked)}
                  className="w-4 h-4 text-dreamxec-orange cursor-pointer"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* SECTION 3: CREDIBILITY CHECK */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">3. Credibility Check</legend>

          {/* Achievement */}
          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              What is your strongest professional achievement? *
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Examples: Built a startup, Published research, Worked at a leading company, Built large scale systems
            </p>
            <textarea
              name="achievement"
              value={formData.achievement}
              onChange={handleInputChange}
              placeholder="Describe your strongest professional achievement..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              required
            />
          </div>

          {/* Mentoring Experience */}
          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-3">
              Have you mentored students or professionals before? *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mentoringExperience"
                  value="Yes"
                  checked={formData.mentoringExperience === 'Yes'}
                  onChange={() => handleMentoringExperienceChange('Yes')}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mentoringExperience"
                  value="No"
                  checked={formData.mentoringExperience === 'No'}
                  onChange={() => handleMentoringExperienceChange('No')}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Mentoring Description (conditional) */}
          {formData.mentoringExperience === 'Yes' && (
            <div>
              <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
                Briefly describe your mentoring experience *
              </label>
              <textarea
                name="mentoringDescription"
                value={formData.mentoringDescription || ''}
                onChange={handleInputChange}
                placeholder="Tell us about your mentoring experience..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
                required
              />
            </div>
          )}

          {/* Projects or Research */}
          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              What projects, companies, or research have you worked on that students could learn from?
            </label>
            <textarea
              name="projectsOrResearch"
              value={formData.projectsOrResearch || ''}
              onChange={handleInputChange}
              placeholder="Describe projects or research that demonstrate your expertise..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
            />
          </div>
        </fieldset>

        {/* SECTION 4: MENTORSHIP INTENT */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">4. Mentorship Intent</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              Why do you want to mentor at DreamXec? *
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Good signals: Giving back to students, Helping innovation, Supporting research Weak signals: Networking, Exposure
            </p>
            <textarea
              name="mentorshipIntent"
              value={formData.mentorshipIntent}
              onChange={handleInputChange}
              placeholder="Share your motivation for mentoring at DreamXec..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              required
            />
          </div>
        </fieldset>

        {/* SECTION 5: SCENARIO QUESTION */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">5. Scenario Question (Mentor Quality Filter)</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              A student has a great idea but no technical skills. How would you guide them? *
            </label>
            <p className="text-xs text-gray-600 mb-2">
              This helps us evaluate: Communication ability, Mentorship mindset, Problem solving approach
            </p>
            <textarea
              name="scenarioResponse"
              value={formData.scenarioResponse}
              onChange={handleInputChange}
              placeholder="Describe how you would mentor a student with a great idea but no technical skills..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              required
            />
          </div>
        </fieldset>

        {/* SECTION 6: COMMITMENT */}
        <fieldset className="space-y-6 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">6. Commitment</legend>

          {/* Monthly Commitment */}
          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-3">
              How many hours per month can you commit to mentoring? *
            </label>
            <select
              name="monthlyCommitment"
              value={formData.monthlyCommitment}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
            >
              {commitmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Mentorship Format */}
          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-3">
              Preferred mentorship format (Select at least one) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mentorshipFormatOptions.map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={formData.mentorshipFormat.includes(option)}
                    onChange={(e) => handleArrayChange('mentorshipFormat', option, e.target.checked)}
                    className="w-4 h-4 text-dreamxec-orange cursor-pointer"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* SECTION 7: STUDENT IMPACT */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">7. Student Impact</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-3">
              What kind of students do you prefer mentoring? (Select at least one) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentPreferenceOptions.map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={formData.studentPreference.includes(option)}
                    onChange={(e) => handleArrayChange('studentPreference', option, e.target.checked)}
                    className="w-4 h-4 text-dreamxec-orange cursor-pointer"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* SECTION 8: PROOF OF WORK */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">8. Proof of Work</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              Portfolio / GitHub / Publications / Website
            </label>
            <textarea
              name="portfolioLinks"
              value={formData.portfolioLinks || ''}
              onChange={handleInputChange}
              placeholder="Paste links to your portfolio, GitHub, research papers, website, etc."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
            />
          </div>
        </fieldset>

        {/* SECTION 9: VALUES ALIGNMENT */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">9. Values Alignment</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              What does "innovation for impact" mean to you? *
            </label>
            <textarea
              name="innovationImpactView"
              value={formData.innovationImpactView}
              onChange={handleInputChange}
              placeholder="Share your perspective on innovation for impact..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              required
            />
          </div>
        </fieldset>

        {/* SECTION 10: FINAL FILTER QUESTION */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">10. Final Filter Question</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              What is one mistake most students make when building projects or startups? *
            </label>
            <textarea
              name="studentMistakeObservation"
              value={formData.studentMistakeObservation}
              onChange={handleInputChange}
              placeholder="Share your observation about common mistakes..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
              required
            />
          </div>
        </fieldset>

        {/* SECTION 11: ELITE FILTER QUESTION (OPTIONAL) */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-green pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">
            11. Elite Filter Question (Optional)
          </legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              If you had to mentor a student to build something meaningful in 30 days, what would you make them build?
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Strong mentors usually provide structured answers. This is optional but helps us identify exceptional mentors.
            </p>
            <textarea
              name="thirtyDayBuildPlan"
              value={formData.thirtyDayBuildPlan || ''}
              onChange={handleInputChange}
              placeholder="Describe a 30-day build plan for a student..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
            />
          </div>
        </fieldset>

        {/* SECTION 12: PUBLIC MENTOR FEATURE */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">12. Public Mentor Feature</legend>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="publicMentorFeature"
              checked={formData.publicMentorFeature || false}
              onChange={handleInputChange}
              className="w-4 h-4 text-dreamxec-orange cursor-pointer mt-1"
            />
            <div>
              <span className="text-gray-700 font-semibold">
                I'm open to being featured publicly as a DreamXec mentor
              </span>
              <p className="text-xs text-gray-600 mt-1">
                Selected mentors will be featured on our website and social media channels.
              </p>
            </div>
          </label>
        </fieldset>

        {/* SECTION 13: NETWORK EXPANSION */}
        <fieldset className="space-y-4 border-l-4 border-dreamxec-orange pl-4">
          <legend className="text-2xl font-bold text-dreamxec-berkeley-blue mb-6">13. Network Expansion</legend>

          <div>
            <label className="block text-sm font-semibold text-dreamxec-berkeley-blue mb-2">
              Who is one person you recommend as a mentor for DreamXec?
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Great mentors usually refer other strong mentors. This helps us expand our mentor network.
            </p>
            <textarea
              name="mentorReferral"
              value={formData.mentorReferral || ''}
              onChange={handleInputChange}
              placeholder="Name and brief description of a person you'd recommend as a mentor..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
            />
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8">
          <p className="text-sm text-gray-600">
            * Required fields. Your application will be reviewed within 5-7 business days.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="px-8 py-3 bg-dreamxec-orange hover:bg-dreamxec-green text-white font-bold rounded-lg transition-all duration-300 disabled:bg-gray-400 whitespace-nowrap"
          >
            {isSubmitting ? 'Submitting...' : submitStatus === 'success' ? '✓ Submitted' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};
