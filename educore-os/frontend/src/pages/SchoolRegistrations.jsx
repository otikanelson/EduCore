import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserData, logout } from '../utils/auth';
import { authAPI } from '../services/api';

const SchoolRegistrations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'MANUFACTURER') {
      navigate('/manufacturer/login');
      return;
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await authAPI.getPendingRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setError(err.message || 'Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (school) => {
    setSelectedSchool(school);
    setShowDetailsModal(true);
  };

  const handleApprove = async (schoolId) => {
    if (!confirm('Are you sure you want to approve this school registration?')) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await authAPI.approveRegistration(schoolId);
      setSuccessMessage('School approved successfully');
      setRegistrations(prev => prev.filter(s => s.id !== schoolId));
      setShowDetailsModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to approve school:', err);
      setError(err.message || 'Failed to approve school');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (school) => {
    setSelectedSchool(school);
    setShowRejectModal(true);
    setShowDetailsModal(false);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await authAPI.rejectRegistration(selectedSchool.id, rejectReason);
      setSuccessMessage('School registration rejected');
      setRegistrations(prev => prev.filter(s => s.id !== selectedSchool.id));
      setShowRejectModal(false);
      setRejectReason('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to reject school:', err);
      setError(err.message || 'Failed to reject school');
    } finally {
      setActionLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
          <div className="ml-auto">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium">
              {registrations.length} Pending
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Registrations List */}
          {registrations.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-2">No pending registrations</p>
              <p className="text-sm text-gray-500">New school registrations will appear here</p>
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
                      <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Registered</th>
                      <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((school, index) => (
                      <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{school.name}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.email}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.type}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.state}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.lga}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600 text-right">{school.estimatedStudentCount.toLocaleString()}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.contactPersonName}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{school.contactPersonPhone}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{formatDate(school.createdAt)}</td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(school)}
                              className="px-3 py-1 text-xs text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleApprove(school.id)}
                              disabled={actionLoading}
                              className="px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectClick(school)}
                              disabled={actionLoading}
                              className="px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
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

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedSchool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Registration Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {/* School Information */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    School Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">School Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">School Type</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{selectedSchool.email}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Address</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.address}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">State</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.state}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">LGA</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.lga}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Contact Person
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.contactPersonName}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Role</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.contactPersonRole}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.contactPersonPhone}</p>
                    </div>
                    {selectedSchool.contactPersonId && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">ID Number</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSchool.contactPersonId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform Details */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Platform Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Subdomain</p>
                      <p className="text-sm font-medium text-gray-900 font-mono break-all">{selectedSchool.subdomain}.educore.com</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Estimated Students</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.estimatedStudentCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Registration Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedSchool.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Status</p>
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium">
                        Pending Verification
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Account */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Admin Account
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedSchool.users[0]?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{selectedSchool.users[0]?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedSchool.id)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 text-sm sm:text-base text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {actionLoading ? 'Processing...' : 'Approve School'}
                  </button>
                  <button
                    onClick={() => handleRejectClick(selectedSchool)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 text-sm sm:text-base text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    Reject School
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedSchool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Reject Registration</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Provide a reason for rejecting {selectedSchool.name}
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-sm"
                />

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={actionLoading || !rejectReason.trim()}
                    className="flex-1 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject School'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolRegistrations;
