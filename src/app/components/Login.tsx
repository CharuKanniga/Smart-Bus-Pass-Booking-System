import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Bus, Moon, Sun, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '../utils/mockData';

export function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = login(email, password);
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        
        // Navigate based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'operator':
            navigate('/operator');
            break;
          default:
            navigate('/user');
        }
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const demoLogins = [
    { role: 'Admin', email: 'admin@buspass.com', password: 'admin123' },
    { role: 'Operator', email: 'operator@buspass.com', password: 'operator123' },
    { role: 'User', email: 'Create new account', password: '' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      {/* Language and Theme Switcher */}
      <div className="absolute top-4 right-4 flex gap-2">
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          defaultValue="en"
        >
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="hi">🇮🇳 हिंदी</option>
        </select>
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left space-y-6 p-8">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bus className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Bus Pass
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Booking System</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('welcome')}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Book your bus pass online with ease. Track buses in real-time, get AI-powered route suggestions, and manage your passes digitally.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Routes</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-pink-600">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {t('login')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Signing in...' : t('login')}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Demo Accounts</span>
            </div>
          </div>

          <div className="space-y-2">
            {demoLogins.map((demo, index) => (
              <div key={index} className="text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-800 dark:text-white">{demo.role}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {demo.email} {demo.password && `/ ${demo.password}`}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
