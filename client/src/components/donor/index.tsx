import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileHeader from '../ProfileHeader'; // Ensure path is correct

// Progress calculation helper
const calculateCompletion = (data: any) => {
    const fields = ['fullName', 'email', 'phoneNumber', 'panNumber', 'address', 'bio'];
    const filledFields = fields.filter(field => data[field] && data[field].length > 0);
    return Math.round((filledFields.length / fields.length) * 100);
};

interface FormData {
    fullName: string; 
    email: string; 
    phoneNumber: string | undefined;
    gender: string; 
    dob: string; 
    panNumber: string; 
    education: string;
    occupation: string; 
    address: string; 
    instagram: string; 
    facebook: string;
    twitter: string; 
    reddit: string; 
    bio: string; 
    preferredCategories: string[];
    isAnonymous: boolean; 
    totalDonations: number;
}

const RegistrationForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: '', email: '', phoneNumber: '', gender: '', dob: '',
        panNumber: '', education: '', occupation: '', address: '',
        instagram: '', facebook: '', twitter: '', reddit: '', bio: '',
        preferredCategories: ['Education', 'Healthcare'],
        isAnonymous: false, totalDonations: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCategoryToggle = (cat: string) => {
        const current = formData.preferredCategories;
        setFormData({
            ...formData,
            preferredCategories: current.includes(cat)
                ? current.filter(c => c !== cat)
                : [...current, cat]
        });
    };

    // --- Optimized Submit Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation
        if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
            return toast.error("Please enter a valid phone number");
        }

        setLoading(true);
        try {
            // Note: If you have proxy in vite.config, use '/api/profile-donor'
            // Otherwise use 'http://localhost:5000/api/profile-donor'
            const response = await axios.post('/api/profile-donor', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                toast.success('Donor Legacy Successfully Synced! 🇮🇳');
            }
        } catch (error: any) {
            console.error("Submission Error:", error);
            const errorMsg = error.response?.data?.message || 'Failed to update donor profile.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-20 bg-tricolor-vertical bg-fixed overflow-x-hidden">
            <Toaster position="top-center" reverseOrder={false} />

            <nav className="header-tricolor bg-white/90 backdrop-blur-md sticky top-0 z-50 p-4 md:p-6 shadow-xl border-b border-white/20">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-black italic text-[#000080] tracking-tighter uppercase">
                        Donor<span className="text-[#0B9C2C]">Portal</span>
                    </h1>
                    <div className="btn-pastel-secondary px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Contributor ID: #75-IN
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 mt-12 animate-fade-in">
                <ProfileHeader
                    completion={calculateCompletion(formData)}
                    emailVerified={true}
                    phoneVerified={formData.phoneNumber ? isValidPhoneNumber(formData.phoneNumber) : false}
                    createdAt="Platinum Legacy"
                />

                <div className="card-glass mt-12 overflow-hidden border border-white/30 rounded-[40px] shadow-2xl bg-white/95">
                    {/* Navy Hero Header */}
                    <div className="bg-[#000080] p-10 md:p-14 text-center relative">
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                            Donor Profile
                        </h1>
                        <p className="text-[#FF7F00] font-black mt-4 bg-white/10 border border-white/20 inline-block px-8 py-2 rounded-full text-xs uppercase tracking-widest backdrop-blur-sm">
                            Empowering Social Change
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-14 space-y-16">
                        {/* 1. Identity & Legal Section */}
                        <section className="space-y-10">
                            <h2 className="text-[#000080] text-xl font-black border-l-8 border-[#FF7F00] pl-4 uppercase tracking-tight">
                                Legal Identity
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name (As per PAN)</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border-b-2 border-slate-100 focus:border-[#FF7F00] py-2 outline-none font-bold text-lg bg-transparent transition-all" />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">PAN Number</label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} required className="w-full border-b-2 border-slate-100 focus:border-[#000080] py-2 outline-none font-black text-xl text-[#000080] uppercase tracking-wider" placeholder="ABCDE1234F" />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border-b-2 border-slate-100 focus:border-[#0B9C2C] py-2 outline-none font-bold text-lg bg-transparent" />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Contact Number</label>
                                    <div className="border-b-2 border-slate-100 focus-within:border-[#000080]">
                                        <PhoneInput international defaultCountry="IN" value={formData.phoneNumber} onChange={(v) => setFormData({ ...formData, phoneNumber: v })} className="custom-phone" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Demographic Section */}
                        <section className="p-8 md:p-12 rounded-[40px] bg-slate-50/50 space-y-8 border-2 border-[#FF7F00]/20">
                            <h2 className="text-[#000080] font-black uppercase tracking-widest text-sm text-center">Demographics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white border-2 border-[#000080] p-3 rounded-xl font-bold shadow-[4px_4px_0px_#000080] outline-none">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Education</label>
                                    <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Graduate" className="w-full bg-white border-2 border-[#000080] p-3 rounded-xl font-bold shadow-[4px_4px_0px_#000080] outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white border-2 border-[#000080] p-3 rounded-xl font-bold shadow-[4px_4px_0px_#000080] outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* 3. Preferred Categories */}
                        <section className="text-center">
                            <h2 className="text-[#000080] text-xl font-black uppercase mb-6">Impact Interests</h2>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {['Education', 'Healthcare', 'Environment', 'Animal Welfare', 'Technology'].map(cat => (
                                    <button key={cat} type="button" onClick={() => handleCategoryToggle(cat)}
                                        className={`px-6 py-2 rounded-full font-black text-[10px] uppercase transition-all shadow-md ${formData.preferredCategories.includes(cat)
                                                ? 'bg-[#0B9C2C] text-white -translate-y-1'
                                                : 'bg-white text-slate-400 border border-slate-200 hover:border-[#0B9C2C]'
                                            }`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 4. Anonymous Toggle & Impact */}
                        <section className="bg-[#000080] p-10 rounded-[40px] text-white shadow-2xl">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">Stay Anonymous</h3>
                                    <p className="text-white/50 text-xs mt-1 uppercase font-bold tracking-widest">Hide name from public leaderboards</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-150">
                                    <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B9C2C]"></div>
                                </label>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-8 text-2xl font-black rounded-full shadow-2xl transition-all active:scale-95 text-white ${loading ? 'bg-slate-400' : 'bg-[#0B9C2C] hover:bg-[#000080]'}`}
                        >
                            {loading ? 'SYNCING...' : 'SAVE DONOR LEGACY →'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .custom-phone .PhoneInputInput { border: none; outline: none; background: transparent; width: 100%; font-weight: 700; color: #000080; font-size: 1.125rem; }
                .bg-tricolor-vertical { background: linear-gradient(to bottom, #FFF5E6 0%, #FFFFFF 50%, #E6F4EA 100%); }
            `}</style>
        </div>
    );
};

export default RegistrationForm;