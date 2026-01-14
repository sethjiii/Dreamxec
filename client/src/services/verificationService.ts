import apiRequest, { type ApiResponse } from './api';

export interface GenerateOtpResponse {
    message: string;
    otp?: string; // Optional, present only in dev/test mode or if backend sends it
}

export interface VerifyOtpResponse {
    message: string;
}

export const generateEmailOtp = async (email: string): Promise<ApiResponse<GenerateOtpResponse>> => {
    return apiRequest<GenerateOtpResponse>('/otp/generate-otp', {
        method: 'POST',
        body: JSON.stringify({ email, purpose: 'verification' }),
    });
};

export const generateMobileOtp = async (phonenumber: string): Promise<ApiResponse<GenerateOtpResponse>> => {
    return apiRequest<GenerateOtpResponse>('/otp/generate-otp', {
        method: 'POST',
        body: JSON.stringify({ phonenumber, purpose: 'verification' }),
    });
};

export const verifyOtp = async (otp: string, identifier: { email?: string; phonenumber?: string }): Promise<ApiResponse<VerifyOtpResponse>> => {
    const body = { otp, ...identifier };
    return apiRequest<VerifyOtpResponse>('/otp/verify-otp', {
        method: 'POST',
        body: JSON.stringify(body),
    });
};

export const createVerificationPaymentOrder = async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/student-verification/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: 29, type: 'verification' }),
    });
};

export const submitVerification = async (formData: FormData): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/student-verification/verify`, {
        method: 'POST',
        headers,
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Verification submission failed');
    }
    return data;
};
