import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';
import {
  Users,
  Bus,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  Moon,
  Sun,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import {
  getCurrentUser,
  logout,
  getApplications,
  updatePassStatus,
  getAllUsers,
  getRoutes,
  getAllPasses,
  addRoute,
  deleteRoute,
} from '../utils/mockData';
import type { Application, Route } from '../utils/mockData';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user] = useState(getCurrentUser());
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'routes' | 'users'>('overview');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    startPoint: '',
    endPoint: '',
    stops: '',
    fare: 0,
    distance: '',
    duration: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setApplications(getApplications());
    setRoutes(getRoutes());
    setUsers(getAllUsers());
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleApprove = (appId: string) => {
    updatePassStatus(appId, 'approved');
    loadData();
    toast.success('Application approved!');
  };

  const handleReject = (appId: string) => {
    updatePassStatus(appId, 'rejected');
    loadData();
    toast.error('Application rejected');
  };

  const handleAddRoute = () => {
    if (!newRoute.name || !newRoute.startPoint || !newRoute.endPoint) {
      toast.error('Please fill all required fields');
      return;
    }

    addRoute({
      ...newRoute,
      stops: newRoute.stops.split(',').map(s => s.trim()),
    });

    setShowAddRoute(false);
    setNewRoute({
      name: '',
      startPoint: '',
      endPoint: '',
      stops: '',
      fare: 0,
      distance: '',
      duration: '',
    });
    loadData();
    toast.success('Route added successfully!');
  };

  const handleDeleteRoute = (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      deleteRoute(routeId);
      loadData();
      toast.success('Route deleted');
    }
  };

  // Analytics data
  const allPasses = getAllPasses();
  const stats = [
    {
      label: 'Total Users',
      value: users.filter(u => u.role === 'user').length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      change: '+12%',
    },
    {
      label: 'Active Passes',
      value: allPasses.filter(p => p.status === 'approved').length,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      change: '+8%',
    },
    {
      label: 'Pending Applications',
      value: applications.filter(a => a.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      change: '+3',
    },
    {
      label: 'Revenue',
      value: `₹${allPasses.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.amount, 0)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      change: '+24%',
    },
  ];

  // Chart data
  const monthlyData = [
    { month: 'Jan', passes: 45, revenue: 22500 },
    { month: 'Feb', passes: 52, revenue: 26000 },
    { month: 'Mar', passes: 61, revenue: 30500 },
    { month: 'Apr', passes: 58, revenue: 29000 },
    { month: 'May', passes: 72, revenue: 36000 },
    { month: 'Jun', passes: 85, revenue: 42500 },
  ];

  const passTypeData = [
    { name: 'Monthly', value: allPasses.filter(p => p.passType === 'monthly').length },
    { name: 'Quarterly', value: allPasses.filter(p => p.passType === 'quarterly').length },
    { name: 'Yearly', value: allPasses.filter(p => p.passType === 'yearly').length },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Smart Bus Pass Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0)}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6">
          <div className="flex gap-6">
            {['overview', 'applications', 'routes', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 border-b-2 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Passes Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Monthly Pass Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="passes" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Monthly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pass Type Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Pass Type Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={passTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {passTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {app.userName} applied for {app.passType}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {app.appliedDate}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Pass Applications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Pass Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {app.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {app.passType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {app.route}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        ₹{app.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {app.appliedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : app.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Route Management
              </h2>
              <button
                onClick={() => setShowAddRoute(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Add Route
              </button>
            </div>

            {showAddRoute && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Add New Route
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Route Name (e.g., Route 404)"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Start Point"
                    value={newRoute.startPoint}
                    onChange={(e) => setNewRoute({ ...newRoute, startPoint: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="End Point"
                    value={newRoute.endPoint}
                    onChange={(e) => setNewRoute({ ...newRoute, endPoint: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Stops (comma separated)"
                    value={newRoute.stops}
                    onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Fare (₹)"
                    value={newRoute.fare}
                    onChange={(e) => setNewRoute({ ...newRoute, fare: Number(e.target.value) })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Distance (e.g., 20 km)"
                    value={newRoute.distance}
                    onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 35 min)"
                    value={newRoute.duration}
                    onChange={(e) => setNewRoute({ ...newRoute, duration: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleAddRoute}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Route
                  </button>
                  <button
                    onClick={() => setShowAddRoute(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {route.name}
                    </h3>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {route.startPoint} → {route.endPoint}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {route.distance}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                        {route.duration}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                        ₹{route.fare}/month
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stops:</p>
                      <div className="flex flex-wrap gap-1">
                        {route.stops.map((stop, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                User Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Passes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {u.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'operator'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {allPasses.filter(p => p.userId === u.id && p.status === 'approved').length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}