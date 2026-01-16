import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileHeader from '../ProfileHeader';

const StudentRegistration: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        collegeName: '',
        yearOfStudy: '1st Year',
        bio: '',
        address: '',
        skills: ['React', 'Next.js'] as string[],
        projectTitle: '',
        fundingRequirement: '',
        portfolioUrl: '',
        githubUrl: '',
        linkedInUrl: '',
    });

    // 1. Improved Change Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        console.log(`Updated ${name}:`, value); // Check if state is changing
    };

    const handlePhoneChange = (v?: string) => {
        setFormData(prev => ({ ...prev, phone: v || '' }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput] }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    // 2. Submission Logic with Debugging
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // This log will tell us if the function even starts
        console.log("Submit triggered! Payload:", formData);

        if (!formData.email.includes('@')) {
            toast.error("Please enter a valid college email");
            return;
        }

        setLoading(true);
        try {
            // NOTE: If using a separate backend port (e.g. 5000), 
            // ensure you have a proxy in package.json or use full URL.
            const response = await axios.post('/api/profile-student', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            
            console.log("Server Success Response:", response.data);
            if (response.data.success) {
                toast.success('Student Portfolio Synced! 🚀');
            }
        } catch (error: any) {
            // This captures why the "Update Failed"
            console.error("AXIOS ERROR DETAILS:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            toast.error(error.response?.data?.message || 'Update failed. Check Network Tab.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-20 bg-slate-50 overflow-x-hidden font-sans">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 p-4 shadow-sm border-b">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-black italic text-[#000080]">
                        STUDENT<span className="text-[#FF7F00]">HUB</span>.in
                    </h1>
                    <div className="bg-gray-100 px-4 py-1 rounded-full text-[10px] font-bold uppercase">
                        Session 2026
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 mt-8">
                <ProfileHeader
                    completion={85}
                    emailVerified={!!formData.email}
                    phoneVerified={formData.phone ? isValidPhoneNumber(formData.phone) : false}
                    createdAt="Active Now"
                />

                <div className="bg-white shadow-xl rounded-[40px] mt-10 overflow-hidden border border-gray-200">
                    {/* Header Banner */}
                    <div className="bg-[#000080] p-10 text-center">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tight">
                            Digital Identity
                        </h1>
                        <p className="text-orange-400 font-bold mt-2 text-sm uppercase">
                            Bharat's Student Innovation Portal
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        
                        {/* 1. Basic Identity */}
                        <section className="space-y-6">
                            <h2 className="text-[#000080] text-xl font-black border-l-4 border-[#FF7F00] pl-3">PRIMARY DETAILS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="border-b-2 py-2 outline-none focus:border-[#FF7F00] font-bold text-lg" placeholder="e.g. Rahul Sharma" required />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">College Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="border-b-2 py-2 outline-none focus:border-[#FF7F00] font-bold text-lg text-blue-600" placeholder="name@college.edu" required />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">College Name</label>
                                    <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="border-b-2 py-2 outline-none focus:border-[#000080] font-bold text-lg" placeholder="IIT Bombay" required />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Mobile Number</label>
                                    <PhoneInput international defaultCountry="IN" value={formData.phone} onChange={handlePhoneChange} className="border-b-2 py-2 font-bold text-lg" />
                                </div>
                            </div>
                        </section>

                        {/* 2. Bio Section */}
                        <section className="bg-orange-50/50 p-6 rounded-3xl border-2 border-dashed border-orange-200 space-y-4">
                            <h2 className="text-[#000080] font-bold text-sm uppercase">Short Bio & Location</h2>
                            <textarea name="bio" value={formData.bio} placeholder="Describe your technical background..." rows={2} onChange={handleChange} className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 font-medium outline-none focus:border-[#000080]" />
                            <input type="text" name="address" value={formData.address} placeholder="Current Address" onChange={handleChange} className="w-full bg-white border-2 border-gray-200 rounded-xl p-3 font-medium outline-none focus:border-[#000080]" />
                        </section>

                        {/* 3. Tech Stack */}
                        <section className="p-6 rounded-3xl border-2 border-[#000080] space-y-4">
                            <h2 className="text-[#000080] font-black text-center uppercase">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {formData.skills.map(skill => (
                                    <span key={skill} className="bg-[#000080] text-white px-4 py-1 rounded-full font-bold text-[10px] flex items-center gap-2">
                                        {skill} <button type="button" onClick={() => removeSkill(skill)} className="text-orange-400">×</button>
                                    </span>
                                ))}
                                <input 
                                    value={skillInput} 
                                    onChange={(e) => setSkillInput(e.target.value)} 
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    placeholder="+ Add Tech" 
                                    className="outline-none bg-transparent font-bold text-sm border-b-2 border-orange-400 w-24" 
                                />
                            </div>
                        </section>

                        {/* 4. Professional Links */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="Portfolio Link" className="bg-gray-50 border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#000080]" />
                            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub Link" className="bg-gray-50 border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#000080]" />
                            <input type="url" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} placeholder="LinkedIn Link" className="bg-gray-50 border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#000080]" />
                        </section>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 text-xl font-black rounded-2xl shadow-lg transition-all ${loading ? 'bg-gray-300' : 'bg-[#FF7F00] hover:bg-[#0B9C2C] text-white'}`}
                        >
                            {loading ? 'SYNCING...' : 'FINISH REGISTRATION →'}
                        </button>
                    </form>
                </div>

                {/* --- LIVE DEBUGGER (Delete this after fixing) --- */}
                <div className="mt-10 p-4 bg-black text-green-400 font-mono text-[10px] rounded-xl overflow-auto max-h-40">
                    <p className="border-b border-green-900 mb-2 font-bold">// REAL-TIME STATE MONITOR</p>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            </div>

            <style>{`
                .PhoneInputInput { border: none; outline: none; font-weight: 700; color: #000080; }
                .PhoneInput { display: flex; align-items: center; }
            `}</style>
        </div>
    );
};

export default StudentRegistration;