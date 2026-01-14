import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileHeader from '../ProfileHeader';

const StudentRegistration: React.FC = () => {
    // State management for all fields
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', collegeName: '', yearOfStudy: '',
        instagram: '', facebook: '', twitter: '', reddit: '', bio: '',
        address: '', skills: ['React', 'Next.js'], projectTitle: '',
        fundingRequirement: '', portfolioUrl: '', githubUrl: '', linkedInUrl: '',
    });
    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePhoneChange = (v: any) => setFormData({ ...formData, phone: v });

    const addSkill = () => {
        if (skillInput && !formData.skills.includes(skillInput)) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    return (
        /* Yahan 'bg-tricolor-vertical' background ko Indian Flag look deta hai */
        <div className="min-h-screen pb-20 bg-tricolor-vertical bg-fixed overflow-x-hidden">
            
            {/* Nav: Glass Effect with Navy Accent */}
            <nav className="header-tricolor bg-white/80 backdrop-blur-md sticky top-0 z-50 p-4 shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-black italic text-[#000080] tracking-tighter">
                        STUDENT<span className="text-[#FF7F00]">HUB</span>.in
                    </h1>
                    <div className="btn-pastel-secondary px-6 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm">
                        Amrit Kaal Edition
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 mt-12 animate-fade-in">
                {/* Profile Header using completion logic */}
                <ProfileHeader 
                    completion={75} 
                    emailVerified={true} 
                    phoneVerified={true} 
                    createdAt="2026" 
                />

                {/* Main Glass Card: index.css ki 'card-glass' class use ki hai */}
                <div className="card-glass mt-10 overflow-hidden border border-white/40">
                    <div className="bg-white/90 backdrop-blur-sm">
                        
                        {/* Header Section: Navy Pastel from your CSS */}
                        <div className="bg-navy-pastel p-10 text-center relative">
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter text-outlined-saffron">
                                Profile Verification
                            </h1>
                            <p className="text-[#0B9C2C] font-black mt-2 bg-white/90 inline-block px-4 py-1 rounded-full text-xs uppercase shadow-md">
                                Empowering Bharat's Tech Talent
                            </p>
                        </div>

                        <form className="p-6 md:p-12 space-y-12">
                            
                            {/* 1. Basic Info Section */}
                            <section className="space-y-6">
                                <h2 className="text-[#000080] text-xl font-black border-l-8 border-[#FF7F00] pl-4 uppercase">
                                    Identity Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">Full Name</label>
                                        <input type="text" name="name" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#FF7F00] py-2 outline-none font-bold text-lg bg-transparent transition-all" placeholder="Sanskar Seth" />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">Email</label>
                                        <input type="email" name="email" onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-[#000080] py-2 outline-none font-bold text-lg bg-transparent transition-all" placeholder="sanskar@tech.in" />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">Mobile Number</label>
                                        <PhoneInput international defaultCountry="IN" value={formData.phone} onChange={handlePhoneChange} className="custom-phone border-b-2 border-slate-200 font-bold" />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">Year of Study</label>
                                        <select name="yearOfStudy" onChange={handleChange} className="w-full border-b-2 border-slate-200 py-2 outline-none font-bold text-lg bg-transparent">
                                            <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Bio & Address: Using 'pastel-stroke-saffron' */}
                            <section className="pastel-stroke-saffron p-8 rounded-[30px] bg-white/50 space-y-4">
                                <h2 className="text-[#000080] font-black uppercase tracking-widest text-sm">Bio & Communication</h2>
                                <textarea name="bio" placeholder="Tell us about your tech journey..." rows={2} onChange={handleChange} className="w-full bg-white border-2 border-[#000080] rounded-2xl p-4 font-bold shadow-[4px_4px_0px_#000080]" />
                                <input type="text" name="address" placeholder="Residential Address" onChange={handleChange} className="w-full bg-white border-2 border-[#000080] rounded-xl p-3 font-bold shadow-[4px_4px_0px_#000080]" />
                            </section>

                            {/* 3. Social Grid: 4 columns for tech feel */}
                            <section>
                                <h2 className="text-[#000080] text-lg font-black uppercase mb-4">Social Presence</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['instagram', 'facebook', 'twitter', 'reddit'].map(s => (
                                        <div key={s} className="bg-white/80 border-2 border-slate-100 p-3 rounded-2xl focus-within:border-[#0B9C2C] transition-all shadow-sm">
                                            <label className="text-[8px] font-black uppercase text-slate-400">{s}</label>
                                            <input type="text" name={s} placeholder="@username" onChange={handleChange} className="w-full text-xs font-bold outline-none bg-transparent" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 4. Project & Funding: Using 'pastel-stroke-green' */}
                            <section className="pastel-stroke-green p-8 rounded-[30px] bg-[#0B9C2C]/5 space-y-6">
                                <h2 className="text-[#0B9C2C] text-xl font-black uppercase">Innovation & Funding</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" name="projectTitle" placeholder="Startup/Project Title" className="p-4 rounded-xl border-2 border-[#0B9C2C] font-bold" />
                                    <input type="number" name="fundingRequirement" placeholder="Requirement (₹)" className="p-4 rounded-xl border-2 border-[#0B9C2C] font-bold" />
                                </div>
                            </section>

                            {/* 5. Skills & Mastery */}
                            <section className="border-4 border-[#000080] border-dashed p-6 rounded-[30px]">
                                <h2 className="text-[#000080] text-lg font-black mb-4 uppercase">Tech Stack</h2>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map(skill => (
                                        <span key={skill} className="bg-green-pastel text-white px-4 py-1 rounded-full font-bold text-[10px] shadow-md animate-float-slow">
                                            {skill}
                                        </span>
                                    ))}
                                    <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} 
                                        placeholder="+ Add Skill" className="outline-none bg-transparent font-bold text-sm ml-2 border-b border-slate-300" />
                                </div>
                            </section>

                            {/* 6. Developer Links */}
                            <section className="bg-[#000080] p-8 rounded-[30px] text-white space-y-6">
                                <h2 className="font-black uppercase tracking-widest italic">Professional Links</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['portfolioUrl', 'githubUrl', 'linkedInUrl'].map(link => (
                                        <input key={link} type="url" name={link} placeholder={link.replace('Url','').toUpperCase()} className="bg-white/10 border border-white/20 p-3 rounded-xl text-xs outline-none focus:bg-white/20 transition-all" />
                                    ))}
                                </div>
                            </section>

                            {/* Submit: Indian Flag Themed Button */}
                            <button className="btn-pastel-primary w-full py-6 text-2xl font-black rounded-full shadow-2xl bg-[#FF7F00] hover:bg-[#0B9C2C] transition-colors duration-500">
                                REGISTER PROFILE →
                            </button>
                        </form>
                    </div>
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