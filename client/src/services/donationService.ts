import apiRequest, { type ApiResponse } from './api';

/* =======================
   TYPES
======================= */

export interface Donation {
  id: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  paymentStatus: string;
  donor?: {
    id: string;
    name: string;
    organizationName?: string;
  };
  guestEmail?: string;
  userProject: {
    id: string;
    title: string;
  };
  createdAt: string;
}

// export interface CreateDonationData {
//   amount: number;
//   projectId: string;
//   message?: string;
//   anonymous?: boolean;
// }

/**
 * Razorpay Order Creation
 */
export interface CreateOrderData {
  amount: number; // INR
  projectId: string;
}

/**
 * Razorpay Verify (client-side optional)
 */
export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Donor Impact Summary
 */
export interface DonationSummary {
  totalAmount: number;
  donationsCount: number;
  projectsSupported: number;
  studentsSupported: number;
}

/* =======================
   API CALLS
======================= */

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (
  data: CreateOrderData
): Promise<ApiResponse<{ orderId: string; amount: number; currency: string }>> => {
  return apiRequest('/donations/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Verify payment (client-side success flow)
 * NOTE: webhook is still the source of truth
 */
export const verifyPayment = async (
  data: VerifyPaymentData
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiRequest('/donations/verify-payment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get logged-in donor's donations
 */
export const getMyDonations = async (): Promise<
  ApiResponse<{ donations: Donation[] }>
> => {
  return apiRequest('/donations/my', {
    method: 'GET',
  });
};

/**
 * Get donations for a specific campaign (project owner / admin)
 */
export const getProjectDonations = async (
  projectId: string
): Promise<ApiResponse<{ donations: Donation[] }>> => {
  return apiRequest(`/donations/project/${projectId}`, {
    method: 'GET',
  });
};

/**
 * Donor Impact Summary (used in DonorDashboard)
 */
export const getDonationSummary = async (): Promise<
  ApiResponse<{ summary: DonationSummary }>
> => {
  return apiRequest('/donations/summary', {
    method: 'GET',
  });
};
