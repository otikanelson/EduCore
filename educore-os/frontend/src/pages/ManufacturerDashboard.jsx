import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserData, logout } from '../utils/auth';
import { authAPI } from '../services/api';

const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'MANUFACTURER') {
      navigate('/manufacturer/login');
      return;
    }
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const pendingSchools = await authAPI.getPendingRegistrations();
      setSchools(pendingSchools);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/manufacturer/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/manufacturer/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'School Registrations', path: '/manufacturer/registrations', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-[#1e3a8a] flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">EduCore</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-[#1e3a8a] text-white flex items-center justify-center font-semibold mr-3">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">School Registrations</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {schools.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-2">No school registrations</p>
              <p className="text-sm text-gray-500">New registrations will appear here</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200">
              {/* Excel-style Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">School Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">State</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LGA</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Students</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Person</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school, index) => (
                      <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{school.name}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.email}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.type}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.state}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.lga}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600 text-right">{school.estimatedStudentCount.toLocaleString()}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.contactPersonName}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.contactPersonPhone}</td>
                        <td className="border border-gray-200 px-4 py-3">
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium">
                            Pending
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Link
                            to="/manufacturer/registrations"
                            className="text-sm text-[#1e3a8a] hover:underline font-medium"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
