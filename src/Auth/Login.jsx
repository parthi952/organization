import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { URLApi } from '../Apilink';


const loginApi = "http://localhost:5001/api/contect/login/OA" 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(loginApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          Email: email, 
          Password: password ,
          Roll : "OA"
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Login Successful!");
        
        localStorage.setItem("token", data.token);
        
        navigate(`/home/${data.user.id}`); 
      } else {
        alert(data.message || "Invalid Credentials");
      }

    } catch (error) {
      alert("Server error! Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4 font-sans text-slate-100">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">Welcome Back</h2>
          
    
          <form className="space-y-5" onSubmit={handleLogin}>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-slate-400 transition-all"
                required 
              />
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-1 mt-6">
              Log In
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-400">
            <p>Don't have an account? <Link to="/signup" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;