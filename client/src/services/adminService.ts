import apiRequest, { type ApiResponse } from './api';
import type { UserProject } from './userProjectService';
import type { DonorProject } from './donorProjectService';
import type  {
  Campaign,
  Project,
  User,
  DashboardStats,
  ProjectStatus,
  AccountStatus,
  PaginatedResponse
} from "../types"

export interface AllProjectsResponse {
  userProjects: PaginatedResponse<Campaign>
  donorProjects: PaginatedResponse<Project>;
}


export interface VerifyProjectData {
  status: ProjectStatus;
  reason?: string;
}

// get dashboard stats
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiRequest('/admin/stats', {
    method: 'GET',
  });
};



// PROJECT MANAGEMENT

interface ProjectQueryParams {
  page? : number;
  limit? : number;
  status? : ProjectStatus | '';
}

// Get all projects (admin)
export const getAllProjects = async (
  params: ProjectQueryParams = {}
): Promise<ApiResponse<AllProjectsResponse>> =>{
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);

  return apiRequest(`/admin/projects?${query.toString()}`, {
    method: 'GET',
  })
}

// Verify user project
export const verifyUserProject = async (
  id: string,
  data: VerifyProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/admin/projects/user/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Verify donor project
export const verifyDonorProject = async (
  id: string,
  data: VerifyProjectData
): Promise<ApiResponse<{ donorProject: DonorProject }>> => {
  return apiRequest(`/admin/projects/donor/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/* =========================================================
   User & Donor Governance
========================================================= */

// Get all users
export const getAllUsers = async (): Promise<ApiResponse<{ users: User[] }>> => {
  return apiRequest('/admin/users', {
    method: 'GET',
  });
};

// Get all donors
export const getAllDonors = async (): Promise<ApiResponse<{ donors: User[] }>> => {
  return apiRequest('/admin/donors', {
    method: 'GET',
  });
};

export const manageUserStatus = async(
  userId: string,
  status: AccountStatus
): Promise<ApiResponse<{ user: User}>> => {
  return apiRequest(`/admin/users/${userId}/status`,{
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}


// --- CLUB MANAGEMENT ---

// Add this function
export const getAllClubs = async (): Promise<ApiResponse<{ clubs: any[] }>> => {
  return apiRequest('/admin/clubs', {
    method: 'GET',
  });
};

// Add this function
export const manageClubStatus = async (
  clubId: string, 
  status: 'ACTIVE' | 'SUSPENDED'
): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/clubs/${clubId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};  

/* =========================================================
   Club Verification & Management
========================================================= */

export const getClubVerifications = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest('/admin/club-verifications/verifications', {
    method: 'GET',
  });
};

export const approveClubVerification = async (id: string): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/club-verifications/verifications/${id}/approve`, {
    method: 'POST',
  });
};

export const rejectClubVerification = async (id: string, reason: string): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/club-verifications/verifications/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};


/* =========================================================
   File Uploads
========================================================= */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadClubMembers = async (file: File, clubId: string, token?: string) => {
  const form = new FormData();
  form.append('file', file);
  form.append('clubId', clubId);

  const res = await fetch(`${API_BASE}/admin/clubs/members/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Upload failed');
  }
  return res.json();
};


/* =========================================================
   Financials
========================================================= */

export const getAdminDonations = async (page = 1, limit = 20): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/financials/donations?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
};

export const getAdminWithdrawals = async (status = 'pending'): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/financials/withdrawals?status=${status}`, {
    method: 'GET',
  });
};

export const processWithdrawal = async (
  id: string, 
  status: 'approved' | 'rejected',
  note?: string
): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/financials/withdrawals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
};


/* =========================================================
   Milestones
========================================================= */

export const getPendingMilestones = async (): Promise<ApiResponse<any>> => {
  return apiRequest('/admin/milestones/pending', {
    method: 'GET',
  });
};

export const verifyMilestone = async (
  id: string,
  status: 'APPROVED' | 'REJECTED',
  feedback?: string
): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/milestones/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ status, feedback }),
  });
};


/* =========================================================
   Student Verifications
========================================================= */

export const getStudentVerifications = async (status?: string): Promise<ApiResponse<any>> => {
  const query = status ? `?status=${status}` : '';
  return apiRequest(`/admin/student-verifications${query}`, {
    method: 'GET',
  });
};

export const approveStudentVerification = async (id: string): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/student-verifications/${id}/approve`, {
    method: 'PATCH',
  });
};

export const rejectStudentVerification = async (id: string, reason?: string): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/student-verifications/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
};


/* =========================================================
   Audit Logs
========================================================= */

export const getAuditLogs = async (
  page = 1, 
  limit = 20, 
  type?: string, 
  search?: string
): Promise<ApiResponse<any>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  if (type) params.append('type', type);
  if (search) params.append('search', search);

  return apiRequest(`/admin/audit-logs?${params.toString()}`, {
    method: 'GET',
  });
};


/* =========================================================
   Donor Governance
========================================================= */

export const toggleDonorVerification = async (
  id: string, 
  verified: boolean
): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/donors/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ verified }),
  });
};

export const manageDonorStatus = async (
  id: string, 
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED'
): Promise<ApiResponse<any>> => {
  return apiRequest(`/admin/donors/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};