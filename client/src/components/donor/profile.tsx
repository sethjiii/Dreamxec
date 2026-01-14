import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileHeader from '../ProfileHeader';

const calculateCompletion = (data: any) => {
    const fields = Object.values(data);
    const filledFields = fields.filter(value => 
        value !== '' && 
        value !== undefined && 
        value !== null && 
        (Array.isArray(value) ? value.length > 0 : true)
    );
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
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dob: '',
        panNumber: '',
        education: '',
        occupation: '',
        address: '',
        instagram: '',
        facebook: '',
        twitter: '',
        reddit: '',
        bio: '',
        preferredCategories: [],
        isAnonymous: false,
        totalDonations: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCategoryChange = (cat: string) => {
        setFormData(prev => {
            const categories = prev.preferredCategories.includes(cat)
                ? prev.preferredCategories.filter(c => c !== cat)
                : [...prev.preferredCategories, cat];
            return { ...prev, preferredCategories: categories };
        });
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, phoneNumber: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
            alert("Please enter a valid phone number");
            return;
        }
        alert("Donor Profile Saved Successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Nav Branding */}
            {/* <nav className="bg-[#000080] p-4 shadow-xl text-white mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-black tracking-tighter italic uppercase">Donor<span className="text-[#FF7F00]">Care</span></h1>
                    <div className="text-[10px] font-bold uppercase tracking-widest border border-[#0B9C2C] px-3 py-1 rounded text-[#0B9C2C]">
                        Secure Giving
                    </div>
                </div>
            </nav> */}

            <div className="max-w-3xl mx-auto px-4">
                <ProfileHeader
                    completion={calculateCompletion(formData)}
                    emailVerified={true}
                    phoneVerified={formData.phoneNumber ? isValidPhoneNumber(formData.phoneNumber) : false}
                    createdAt="Jan 2026"
                />

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                    {/* Header Banner */}
                    <div className="bg-[#000080] p-8 text-center relative">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF7F00] opacity-10 rounded-full -ml-16 -mt-16"></div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Donor Registration</h1>
                        <p className="text-[#0B9C2C] font-bold text-sm mt-2">Manage your contributions and tax benefits</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-12">

                        {/* SECTION 1: Personal Details */}
                        <section>
                            <h2 className="text-[#000080] text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-wider">
                                <span className="w-8 h-1 bg-[#FF7F00] rounded-full"></span>
                                Personal Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                    <input type="text" name="fullName" placeholder="Sanskar Seth" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-2 outline-none transition-all font-medium" required />
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                                    <input type="email" name="email" placeholder="seth@example.com" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-2 outline-none transition-all font-medium" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                                    <div className="border-b-2 border-slate-200 focus-within:border-[#000080] transition-all">
                                        <PhoneInput
                                            international
                                            defaultCountry="IN"
                                            value={formData.phoneNumber}
                                            onChange={handlePhoneChange}
                                            className="custom-phone"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                                        <select name="gender" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-2 outline-none bg-transparent font-medium">
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">DOB</label>
                                        <input type="date" name="dob" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-1.5 outline-none bg-transparent" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2: Tax & Address */}
                        <section className="bg-slate-50 p-6 rounded-2xl border-l-8 border-[#0B9C2C]">
                            <h2 className="text-[#000080] text-lg font-black mb-6 uppercase tracking-wider">Tax & Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">PAN Number (For Tax Benefits)</label>
                                    <input type="text" name="panNumber" maxLength={10} placeholder="ABCDE1234F" onChange={handleChange} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#0B9C2C] py-2 outline-none uppercase font-bold text-[#000080]" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Occupation</label>
                                    <select name="occupation" onChange={handleChange} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#0B9C2C] py-2 outline-none">
                                        <option value="salaried">Salaried</option>
                                        <option value="business">Business</option>
                                        <option value="professional">Professional</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
                                    <textarea name="address" rows={2} onChange={handleChange} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#0B9C2C] py-2 outline-none resize-none" placeholder="Residential Address"></textarea>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 3: Social & Bio */}
                        <section>
                            <h2 className="text-[#000080] text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-wider">
                                <span className="w-8 h-1 bg-[#0B9C2C] rounded-full"></span>
                                Social Presence
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {['instagram', 'facebook', 'twitter', 'reddit'].map(social => (
                                    <div key={social}>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase">{social}</label>
                                        <input type="text" name={social} onChange={handleChange} className="w-full border-b border-slate-200 focus:border-[#000080] py-1 text-xs outline-none" placeholder="@username" />
                                    </div>
                                ))}
                            </div>
                            <textarea name="bio" rows={2} placeholder="A short bio about your philanthropic interests..." onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#000080] text-sm"></textarea>
                        </section>

                        {/* SECTION 4: Donor Preferences */}
                        <section className="bg-[#000080] p-8 rounded-3xl text-white">
                            <h2 className="text-lg font-black mb-6 uppercase tracking-widest text-[#FF7F00]">Donor Preferences</h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="text-xs font-bold opacity-70 uppercase mb-4 block">Preferred Categories</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Education', 'Health', 'Climate', 'Tech', 'Animal Welfare'].map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleCategoryChange(cat)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                                    formData.preferredCategories.includes(cat)
                                                        ? 'bg-[#FF7F00] border-[#FF7F00] text-white'
                                                        : 'bg-transparent border-white/20 text-white/60 hover:border-white'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex items-center justify-between p-4 border border-white/10 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                        <div>
                                            <p className="font-bold text-sm">Donate Anonymously</p>
                                            <p className="text-[10px] opacity-50 font-medium">Hide your name from public</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="isAnonymous"
                                            checked={formData.isAnonymous}
                                            onChange={handleChange}
                                            className="w-5 h-5 accent-[#FF7F00]"
                                        />
                                    </label>
                                    
                                    <div className="p-4 border border-[#0B9C2C]/30 rounded-2xl bg-[#0B9C2C]/10">
                                        <p className="text-[10px] font-black uppercase text-[#0B9C2C]">Total Impact</p>
                                        <p className="text-2xl font-black text-white">₹{formData.totalDonations}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button type="submit" className="w-full bg-[#FF7F00] hover:bg-[#e67300] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-200 uppercase tracking-widest text-lg active:scale-95">
                            Save Donor Profile
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .custom-phone { display: flex; align-items: center; padding: 4px 0; }
                .PhoneInputInput { border: none; outline: none; background: transparent; width: 100%; font-weight: 500; font-size: 0.9rem; color: #000080; }
                .PhoneInputCountry { border-right: 1px solid #cbd5e1; padding-right: 10px; margin-right: 10px; }
            `}</style>
        </div>
    );
};

export default RegistrationForm;