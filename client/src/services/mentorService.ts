import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface MentorApplicationData {
  // Basic Information
  name: string;
  email: string;
  linkedin?: string;
  role: string;
  organization?: string;
  country: string;
  city?: string;
  yearsOfExperience: number;

  // Area of Expertise
  expertiseAreas: string[];

  // Credibility Check
  achievement: string;
  mentoringExperience: "Yes" | "No";
  mentoringDescription?: string;
  projectsOrResearch?: string;

  // Mentorship Intent
  mentorshipIntent: string;

  // Scenario Question
  scenarioResponse: string;

  // Commitment
  monthlyCommitment: "2-3 hours" | "4-6 hours" | "6-10 hours" | "10+ hours";
  mentorshipFormat: string[];

  // Student Impact
  studentPreference: string[];

  // Proof of Work
  portfolioLinks?: string;

  // Values Alignment
  innovationImpactView: string;

  // Final Filter Question
  studentMistakeObservation: string;

  // Elite Filter (Optional)
  thirtyDayBuildPlan?: string;

  // Public Feature
  publicMentorFeature?: boolean;

  // Network Expansion
  mentorReferral?: string;
}

/**
 * Submit a mentor application
 */
export const submitMentorApplication = async (data: MentorApplicationData) => {
  try {
    const response = await api.post("/mentor", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data) {
        throw new Error(
          axiosError.response.data.message ||
            "Failed to submit mentor application",
        );
      }
    }
    throw new Error("Network error or server unavailable");
  }
};

/**
 * Get mentor application status (if user has auth token)
 */
export const getMentorApplicationStatus = async (applicationId: string) => {
  try {
    const response = await api.get(`/mentor/${applicationId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data) {
        throw new Error(
          axiosError.response.data.message || "Failed to fetch application",
        );
      }
    }
    throw new Error("Network error or server unavailable");
  }
};
