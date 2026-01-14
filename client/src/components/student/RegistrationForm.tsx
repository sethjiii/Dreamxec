import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileHeader from '../ProfileHeader';

const calculateCompletion = (data: any) => {
    const fields = Object.values(data);
    const filledFields = fields.filter(value => value !== '' && (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null));
    return Math.round((filledFields.length / fields.length) * 100);
};

interface StudentData {
    name: string;
    email: string;
    phone: string | undefined;
    collegeName: string;
    yearOfStudy: string;
    instagram: string;
    facebook: string;
    twitter: string;
    reddit: string;
    bio: string;
    address: string;
    skills: string[];
    projectTitle: string;
    fundingRequirement: string;
    portfolioUrl: string;
    githubUrl: string;
    linkedInUrl: string;
}

const StudentRegistration: React.FC = () => {
    const [formData, setFormData] = useState<StudentData>({
        name: '', email: '', phone: '', collegeName: '', yearOfStudy: '',
        instagram: '', facebook: '', twitter: '', reddit: '', bio: '',
        address: '', skills: ['React', 'UI Design'], projectTitle: '',
        fundingRequirement: '', portfolioUrl: '', githubUrl: '', linkedInUrl: '',
    });
    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.phone && !isValidPhoneNumber(formData.phone)) {
            alert("Please check the phone number format.");
            return;
        }
        alert("Profile Created Successfully!");
    };
    const addSkill = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmedSkill = skillInput.trim();
        if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, trimmedSkill]
            }));
            setSkillInput(''); // Input clear karne ke liye
        }
    };
    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header Branding */}
            {/* <nav className="bg-[#000080] p-4 shadow-xl text-white mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-black tracking-tighter italic">STUDENT<span className="text-[#FF7F00]">HUB</span></h1>
                    <div className="text-[10px] font-bold uppercase tracking-widest border border-[#0B9C2C] px-3 py-1 rounded text-[#0B9C2C]">
                        Secure Onboarding
                    </div>
                </div>
            </nav> */}

            <div className="max-w-3xl mx-auto px-4">
                <ProfileHeader
                    completion={calculateCompletion(formData)}
                    emailVerified={true}
                    phoneVerified={formData.phone ? isValidPhoneNumber(formData.phone) : false}
                    createdAt="Jan 2026"
                />

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                    <div className="bg-[#000080] p-8 text-center relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B9C2C] opacity-10 rounded-full -mr-16 -mt-16"></div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Student Profile</h1>
                        <p className="text-[#0B9C2C] font-bold text-sm mt-2">Build your future with verified credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-12">

                        {/* 1. Basic Information */}
                        <section>
                            <h2 className="text-[#000080] text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-wider">
                                <span className="w-8 h-1 bg-[#FF7F00] rounded-full"></span>
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="relative group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                    <input type="text" name="name" placeholder="Sanskar Seth" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-2 outline-none transition-all font-medium" required />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                                    <input type="email" name="email" placeholder="sanskar@example.com" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-2 outline-none transition-all font-medium" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                                    <div className="border-b-2 border-slate-200 focus-within:border-[#000080] transition-all">
                                        <PhoneInput
                                            international
                                            defaultCountry="IN"
                                            value={"1234567890"}
                                            onChange={handlePhoneChange}
                                            className="custom-phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Academic Details */}
                        <section className="bg-slate-50 p-6 rounded-2xl border-l-8 border-[#0B9C2C]">
                            <h2 className="text-[#000080] text-lg font-black mb-6 uppercase tracking-wider">Academic Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">College / University</label>
                                    <input type="text" name="collegeName" placeholder="e.g. IIT Delhi" onChange={handleChange} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#0B9C2C] py-2 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Year of Study</label>
                                    <select name="yearOfStudy" onChange={handleChange} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#0B9C2C] py-2 outline-none transition-all cursor-pointer">
                                        <option value="">Select Year</option>
                                        <option value="1st">1st Year</option>
                                        <option value="2nd">2nd Year</option>
                                        <option value="3rd">3rd Year</option>
                                        <option value="Final">Final Year</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 3. Innovation & Skills */}
                        <section>
                            <h2 className="text-[#000080] text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-wider">
                                <span className="w-8 h-1 bg-[#0B9C2C] rounded-full"></span>
                                Innovation & Projects
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                                    <input type="text" name="projectTitle" placeholder="Project Name" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#FF7F00] py-2 outline-none" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Funding Needed (Optional)</label>
                                        <div className="flex items-center border-b-2 border-slate-200 focus-within:border-[#0B9C2C]">
                                            <span className="text-[#0B9C2C] font-bold mr-2">₹</span>
                                            <input type="number" name="fundingRequirement" onChange={handleChange} className="w-full py-2 outline-none bg-transparent" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Skills & Interests</label>
                                        <div className="flex flex-col gap-3 mt-1">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                    placeholder="Type skill and press Enter"
                                                    className="flex-1 border-b-2 border-slate-200 focus:border-[#FF7F00] py-2 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addSkill}
                                                    className="bg-[#0B9C2C] text-white px-4 py-1 rounded-lg text-xs font-bold hover:bg-[#000080] transition-colors"
                                                >
                                                    ADD
                                                </button>
                                            </div>

                                            {/* Render Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map(s => (
                                                    <span key={s} className="bg-[#000080] text-white text-[10px] px-3 py-1.5 rounded-full font-bold flex items-center gap-2 shadow-sm">
                                                        {s}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(s)}
                                                            className="hover:text-[#FF7F00] text-white/60 text-sm font-black"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                                {formData.skills.length === 0 && (
                                                    <p className="text-xs text-slate-400 italic">No skills added yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Professional Links */}
                        <section className="bg-[#000080] p-6 rounded-2xl text-white">
                            <h2 className="text-sm font-black mb-6 uppercase tracking-[0.2em] text-[#FF7F00]">Digital Presence</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['portfolioUrl', 'githubUrl', 'linkedInUrl'].map((link) => (
                                    <div key={link}>
                                        <label className="text-[9px] font-bold opacity-60 uppercase">{link.replace('Url', '')}</label>
                                        <input
                                            type="url"
                                            name={link}
                                            placeholder="https://..."
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-white/20 focus:border-[#FF7F00] py-1 outline-none text-xs"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <button type="submit" className="w-full bg-[#FF7F00] hover:bg-[#e67300] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-200 uppercase tracking-widest text-lg active:scale-95">
                            Submit Profile Details
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .custom-phone { display: flex; align-items: center; padding: 4px 0; }
                .PhoneInputInput { border: none; outline: none; background: transparent; width: 100%; font-weight: 500; font-size: 0.9rem; color: #000080; }
                .PhoneInputCountry { border-right: 1px solid #cbd5e1; padding-right: 10px; margin-right: 10px; }
                input::placeholder { color: #cbd5e1; font-weight: 400; }
            `}</style>
        </div>
    );
};

export default StudentRegistration;