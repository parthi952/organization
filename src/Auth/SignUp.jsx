import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5001/api/contect/signup/OA";
const ORG_NAME_API_URL = "http://localhost:5001/api/contect/listorg"

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [OrgName, setOrgName] = useState("");
  const [OrgList, setOrgList] = useState([]);
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (Password === "") {
      alert("Password cannot be empty");
      return;
    }
    if (Password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,      
          Email: email,
          OrgName,    
          Password,
          Roll: "OA"
        })
      });

      if (res.ok) {
        const message = "Successfully registered"; 
        navigate("/", { state: { message } });
      } else {
        
      }
    } catch (error) {
      
    }
  };


  useEffect(() => {
    async function fetchOrgNames() {
      try {
        const response = await fetch(ORG_NAME_API_URL);
        const data = await response.json();

        const list =
          data.orgNames ||
          data.orgnames ||
          data.OrgNames ||
          data.OrgName ||
          data.organizations ||
          data.data ||
          data.list ||
          (Array.isArray(data) ? data : []);

        setOrgList(Array.isArray(list) ? list : []);
      } catch (err) {
        setOrgList([]);
      }
    }
    fetchOrgNames();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4 font-sans text-slate-100">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">Create Account</h2>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                id="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-slate-400 transition-all"
                required
              />
              {confirmPassword ? (
                Password !== confirmPassword ? (
                  <span className="text-red-500 text-xs block mt-1">Not Match</span>
                ) : (
                  <span className="text-green-500 text-xs block mt-1">Matched</span>
                )
              ) : null}
            </div>
            <div className='space-y-1.5'>
              <label htmlFor="OrgName" className="block text-sm font-medium text-slate-300">OrgName</label>
              <select
                name="OrgName"
                id="OrgName"
                value={OrgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-slate-400 transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select OrgName</option>

                {OrgList.map((org, index) => (
                  <option key={index} value={org.Org_Name} className="bg-slate-800">
                    {org.Org_Name}
                  </option>
                ))}
              </select>
            </div>  

            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-1 mt-6">
              Sign Up
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-slate-400">
            <p>Already have an account? <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;