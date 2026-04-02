import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';
import {
  Home,
  FileText,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Bus,
} from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser, logout, getUserPasses, getRoutes } from '../utils/mockData';
import type { BusPass } from '../utils/mockData';

export function UserDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user] = useState(getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passes, setPasses] = useState<BusPass[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
      return;
    }

    // Load user passes
    const userPasses = getUserPasses(user.id);
    setPasses(userPasses);

    // Check for expiring passes
    const expiringPasses = userPasses.filter(pass => {
      const daysUntilExpiry = Math.ceil(
        (new Date(pass.validTo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0 && pass.status === 'approved';
    });

    if (expiringPasses.length > 0) {
      setNotifications(
        expiringPasses.map(p => `Your ${p.passType} pass expires on ${p.validTo}`)
      );
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const stats = [
    {
      label: 'Active Passes',
      value: passes.filter(p => p.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Pending',
      value: passes.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      label: 'Total Spent',
      value: `$${passes.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.amount, 0)}`,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Routes Used',
      value: new Set(passes.map(p => p.route)).size,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  const quickActions = [
    {
      label: 'Apply for Pass',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      onClick: () => navigate('/user/apply'),
    },
    {
      label: 'My Passes',
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      onClick: () => navigate('/user/passes'),
    },
    {
      label: 'Track Bus',
      icon: MapPin,
      color: 'from-green-500 to-green-600',
      onClick: () => navigate('/user/tracking'),
    },
    {
      label: 'Notifications',
      icon: Bell,
      color: 'from-orange-500 to-orange-600',
      onClick: () => toast.info(`You have ${notifications.length} notifications`),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <Bus className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Smart Bus Pass
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">User</p>
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
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-blue-100">
            Manage your bus passes and track your journeys easily
          </p>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900 border-l-4 border-orange-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Expiry Notifications
                </h3>
                {notifications.map((notif, index) => (
                  <p key={index} className="text-sm text-orange-800 dark:text-orange-200">
                    {notif}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

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
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 hover:scale-105 transition-transform shadow-lg`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <p className="font-semibold">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Passes */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Passes
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {passes.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No passes yet</p>
                <button
                  onClick={() => navigate('/user/apply')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply for Your First Pass
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Pass Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Valid Until
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {passes.slice(0, 5).map((pass) => (
                      <tr key={pass.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {pass.passType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {pass.route}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {pass.validTo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pass.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : pass.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {pass.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}