import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Home = () => {
  const { id } = useParams();

  const api = `http://localhost:5001/api/contect/oapanal/${id}`;
  const createFlagApi = 'http://localhost:5001/api/contect/newflag';

  const [data, setData] = useState([]);
  const [flags, setFlags] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [flagName, setFlagName] = useState('');
  const [flagStatus, setFlagStatus] = useState(false);
  const [flagLoading, setFlagLoading] = useState(false);
  const [flagError, setFlagError] = useState('');
  const [flagSuccess, setFlagSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(api, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        // error handling
      }
    };
    fetchData();
  }, [api]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5001/api/contect/listorg', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const list = await res.json();
        setOrgs(list);
      } catch (e) {
        // error handling
      }
    };
    fetchOrgs();
  }, []);

  useEffect(() => {
    const targetOrgId = data?.Org?._id || data?.Org;
    if (!targetOrgId) return;

    if (data?.Org?.Org_Name) {
      setOrgName(data.Org.Org_Name);
      setOrgCode(data.Org.Org_ID);
    } else if (orgs.length > 0) {
      const found = orgs.find(o => o._id === targetOrgId);
      if (found) {
        setOrgName(found.Org_Name);
        setOrgCode(found.Org_ID);
      }
    }
  }, [data, orgs]);

  const fetchFlags = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('http://localhost:5001/api/contect/allflags', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const allFlags = await res.json();
      const orgId = data?.Org?._id || data?.Org;
      if (orgId) {
        const filtered = allFlags.filter(
          (flag) => (flag.flag_own?._id || flag.flag_own) === orgId
        );
        setFlags(filtered);
      }
    } catch (error) {
      // error handling
    }
  };

  useEffect(() => {
    if (data?.Org) {
      fetchFlags();
    }
  }, [data]);


  const handleCreateFlag = async (e) => {
    e.preventDefault();
    setFlagError('');
    setFlagSuccess('');

    if (!flagName.trim()) {
      setFlagError('Flag Name is required.');
      return;
    }

    setFlagLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(createFlagApi, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Flag_Name: flagName.trim(),
          flag_own: data?.Org?._id || data?.Org,
          flag_Status: flagStatus,
          created_by: id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setFlagError(result.message || 'Failed to create flag.');
      } else {
        setFlagSuccess(`Flag "${result.Flag_Name}" created successfully!`);
        setFlagName('');
        setFlagStatus(false);
        fetchFlags();
        setTimeout(() => {
          setShowModal(false);
          setFlagSuccess('');
        }, 1500);
      }
    } catch (err) {
      setFlagError('Network error. Please try again.');
    } finally {
      setFlagLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFlagError('');
    setFlagSuccess('');
    setFlagName('');
    setFlagStatus(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 font-sans text-slate-100 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl p-10 border border-white/20 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight">
                Welcome, {data?.Name || 'User'}!
              </h1>
              <div className="space-y-2 text-slate-300 bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-white">Email:</span> {data?.Email}
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-white">Role:</span>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">
                    {data?.Roll}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-white">Organisation:</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    {orgName || 'Loading...'}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-white">Org ID:</span>
                  <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10 break-all">
                    {orgCode || 'Loading...'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-2xl border border-white/10 w-full md:w-auto min-w-[250px]">
              <h2 className="text-xl font-semibold text-white mb-6">Flag Management</h2>

              <button
                id="open-create-flag-btn"
                onClick={() => setShowModal(true)}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-1"
              >
                + Create Flag
              </button>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Created Flags</h3>
            {flags.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-white/5 rounded-2xl border border-white/10">
                No flags created yet. Click "+ Create Flag" to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flags.map((flag) => {
                  const likes = flag.responses?.filter(r => r.response === true).length || 0;
                  const dislikes = flag.responses?.filter(r => r.response === false).length || 0;
                  return (
                    <div 
                      key={flag._id} 
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 hover:bg-white/10 transition duration-300 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <span className="font-semibold text-lg text-white break-all">{flag.Flag_Name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          flag.flag_Status 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        }`}>
                          {flag.flag_Status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">
                        Created by: <span className="text-slate-300 font-medium">{flag.created_by?.Name || flag.created_by || data?.Name || 'System'}</span>
                      </p>
                      <div className="flex gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          👍 <span className="font-semibold text-slate-200">{likes}</span> Likes
                        </span>
                        <span className="flex items-center gap-1.5">
                          👎 <span className="font-semibold text-slate-200">{dislikes}</span> Dislikes
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          id="create-flag-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target.id === 'create-flag-modal-overlay' && closeModal()}
        >
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-white/20 rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
            <button
              id="close-flag-modal-btn"
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl leading-none transition-colors"
            >
              &times;
            </button>

            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
              Create New Flag
            </h2>

            <form onSubmit={handleCreateFlag} className="space-y-5">
              <div>
                <label htmlFor="flag-name-input" className="block text-sm font-semibold text-slate-300 mb-1">
                  Flag Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="flag-name-input"
                  type="text"
                  value={flagName}
                  onChange={(e) => setFlagName(e.target.value)}
                  placeholder="Enter flag name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  value={orgName || 'Loading Organization...'}
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 cursor-not-allowed font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  value={data?.Name || 'Loading User...'}
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 cursor-not-allowed font-medium"
                />
              </div>
              <div className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                <span className="text-sm font-semibold text-slate-300">
                  Flag Status&nbsp;
                  <span className={flagStatus ? 'text-green-400' : 'text-slate-500'}>
                    ({flagStatus ? 'Active' : 'Inactive'})
                  </span>
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="flag-status-toggle"
                    type="checkbox"
                    className="sr-only peer"
                    checked={flagStatus}
                    onChange={(e) => setFlagStatus(e.target.checked)}
                  />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              {flagError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                  {flagError}
                </p>
              )}
              {flagSuccess && (
                <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg">
                  {flagSuccess}
                </p>
              )}
              <button
                id="submit-flag-btn"
                type="submit"
                disabled={flagLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {flagLoading ? 'Creating...' : 'Create Flag'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
