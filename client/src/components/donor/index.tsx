import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileHeader from '../ProfileHeader';

const calculateCompletion = (data: any) => {
    const fields = Object.values(data);
    const filledFields = fields.filter(value => 
        value !== '' && value !== undefined && value !== null && 
        (Array.isArray(value) ? value.length > 0 : true)
    );
    return Math.round((filledFields.length / fields.length) * 100);
};

interface FormData {
    fullName: string; email: string; phoneNumber: string | undefined;
    gender: string; dob: string; panNumber: string; education: string;
    occupation: string; address: string; instagram: string; facebook: string;
    twitter: string; reddit: string; bio: string; preferredCategories: string[];
    isAnonymous: boolean; totalDonations: number;
}

const RegistrationForm: React.FC = () => {
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

    return (
        <div className="min-h-screen pb-20 bg-tricolor-vertical bg-fixed overflow-x-hidden">
            {/* Header: Tricolor Glassmorphism */}
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

                <div className="card-glass mt-12 overflow-hidden border border-white/30">
                    <div className="bg-white/95">
                        
                        {/* Navy Hero Header */}
                        <div className="bg-navy-pastel p-10 md:p-14 text-center relative">
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-outlined-saffron">
                                Donor Profile
                            </h1>
                            <p className="text-[#FF7F00] font-black mt-4 bg-white/10 border border-white/20 inline-block px-8 py-2 rounded-full text-xs uppercase tracking-widest backdrop-blur-sm">
                                Empowering Social Change
                            </p>
                        </div>

                        <form className="p-6 md:p-14 space-y-16">
                            
                            {/* 1. Identity & Legal Section */}
                            <section className="space-y-10">
                                <h2 className="text-[#000080] text-xl font-black border-l-8 border-[#FF7F00] pl-4 uppercase tracking-tight">
                                    Legal Identity
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name (As per PAN)</label>
                                        <input type="text" name="fullName" onChange={handleChange} className="w-full border-b-2 border-slate-100 focus:border-[#FF7F00] py-2 outline-none font-bold text-lg bg-transparent transition-all" />
                                    </div>
                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">PAN Number</label>
                                        <input type="text" name="panNumber" onChange={handleChange} className="w-full border-b-2 border-slate-100 focus:border-[#000080] py-2 outline-none font-black text-xl text-[#000080] uppercase tracking-wider" placeholder="ABCDE1234F" />
                                    </div>
                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
                                        <input type="email" name="email" onChange={handleChange} className="w-full border-b-2 border-slate-100 focus:border-[#0B9C2C] py-2 outline-none font-bold text-lg bg-transparent" />
                                    </div>
                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Contact Number</label>
                                        <div className="border-b-2 border-slate-100 focus-within:border-[#000080]">
                                            <PhoneInput international defaultCountry="IN" value={formData.phoneNumber} onChange={(v) => setFormData({...formData, phoneNumber: v})} className="custom-phone" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Demographic Section (Gender, DOB, Education) */}
                            <section className="pastel-stroke-saffron p-8 md:p-12 rounded-[40px] bg-slate-50/50 space-y-8">
                                <h2 className="text-[#000080] font-black uppercase tracking-widest text-sm">Demographics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Gender</label>
                                        <select name="gender" onChange={handleChange} className="w-full bg-white border-2 border-[#000080] p-3 rounded-xl font-bold shadow-[4px_4px_0px_#000080]">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Education</label>
                                        <input type="text" name="education" onChange={handleChange} placeholder="Graduate/Post-Grad" className="w-full bg-white border-2 border-[#000080] p-3 rounded-xl font-bold shadow-[4px_4px_0px_#000080]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Date of Birth</label>
                                        <input type="date" name="dob" onChange={handleChange} className="w-full bg-white border-2 border-[#000080] p-3 rounded-xl font-bold shadow-[4px_4px_0px_#000080]" />
                                    </div>
                                </div>
                            </section>

                            {/* 3. Occupation & Bio */}
                            <section className="space-y-8">
                                <h2 className="text-[#000080] text-xl font-black uppercase tracking-tight">Professional & Bio</h2>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Occupation / Industry</label>
                                        <input type="text" name="occupation" onChange={handleChange} className="w-full border-b-2 border-slate-100 focus:border-[#0B9C2C] py-2 outline-none font-bold text-lg bg-transparent" />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Donor Bio (Mission Statement)</label>
                                        <textarea name="bio" rows={3} onChange={handleChange} placeholder="Share your vision for Bharat..." className="w-full bg-white border-4 border-[#0B9C2C] border-dashed rounded-3xl p-6 font-medium text-slate-700 outline-none focus:bg-slate-50 transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* 4. Preferred Categories (Themed Tags) */}
                            <section>
                                <h2 className="text-[#000080] text-xl font-black uppercase mb-6 flex items-center gap-2">
                                    <span className="star-pastel scale-75"></span> Impact Interests
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {['Education', 'Healthcare', 'Environment', 'Animal Welfare', 'Technology', 'Culture'].map(cat => (
                                        <button key={cat} type="button" onClick={() => handleCategoryToggle(cat)}
                                            className={`px-6 py-2 rounded-full font-black text-[10px] uppercase transition-all shadow-md ${
                                                formData.preferredCategories.includes(cat) 
                                                ? 'bg-[#0B9C2C] text-white translate-y-[-2px] shadow-green-200' 
                                                : 'bg-white text-slate-400 border border-slate-200 hover:border-[#0B9C2C]'
                                            }`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* 5. Privacy & Analytics (Dark Mode Section) */}
                            <section className="bg-navy-pastel p-10 rounded-[40px] text-white">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-outlined-saffron">Stay Anonymous</h3>
                                        <p className="text-white/50 text-xs mt-1 uppercase font-bold tracking-widest">Keep your contributions private</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-16 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0B9C2C]"></div>
                                    </label>
                                </div>
                                <div className="mt-12 p-8 border-t border-white/10 rounded-3xl bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0B9C2C]">Current Lifetime Impact</span>
                                    <span className="text-5xl font-black italic">₹{formData.totalDonations.toLocaleString()}</span>
                                </div>
                            </section>

                            {/* 6. Social Media & Address */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h2 className="text-[#000080] text-lg font-black uppercase">Presence</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['instagram', 'twitter', 'facebook', 'reddit'].map(social => (
                                            <input key={social} name={social} placeholder={social.toUpperCase()} onChange={handleChange} className="bg-white border-2 border-slate-100 p-3 rounded-2xl text-[10px] font-bold outline-none focus:border-[#FF7F00]" />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-[#000080] text-lg font-black uppercase">Location</h2>
                                    <textarea name="address" rows={2} onChange={handleChange} placeholder="Registered Address..." className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#0B9C2C]" />
                                </div>
                            </section>

                            {/* Final Save Button */}
                            <button type="submit" className="btn-pastel-primary w-full py-8 text-2xl font-black rounded-full shadow-2xl transition-all active:scale-[0.97] tracking-[0.1em]">
                                SAVE DONOR LEGACY →
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-phone .PhoneInputInput { border: none; outline: none; background: transparent; width: 100%; font-weight: 700; color: #000080; font-size: 1.125rem; }
                .custom-phone .PhoneInputCountry { border-right: 2px solid #cbd5e1; padding-right: 12px; margin-right: 12px; }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(12%) sepia(90%) saturate(5100%) hue-rotate(234deg) brightness(88%) contrast(145%); }
            `}</style>
        </div>
    );
};

export default RegistrationForm;