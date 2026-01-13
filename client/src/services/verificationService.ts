import apiRequest, { type ApiResponse } from './api';

export interface GenerateOtpResponse {
    token: string;
    otp: string;
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

export const verifyOtp = async (token: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> => {
    return apiRequest<VerifyOtpResponse>('/otp/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ token, otp }),
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
