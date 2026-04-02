import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';
import { Scan, CheckCircle, XCircle, User, Calendar, MapPin, LogOut, Moon, Sun, Shield, Clock } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { getCurrentUser, logout, getAllPasses } from '../utils/mockData';
import type { BusPass } from '../utils/mockData';

export function OperatorDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user] = useState(getCurrentUser());
  const [qrInput, setQrInput] = useState('');
  const [scannedPass, setScannedPass] = useState<BusPass | null>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'operator') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleScan = () => {
    if (!qrInput.trim()) {
      toast.error('Please enter QR code');
      return;
    }

    const allPasses = getAllPasses();
    const pass = allPasses.find(p => p.qrCode === qrInput.trim());

    if (!pass) {
      toast.error('Invalid QR code');
      setScannedPass(null);
      return;
    }

    if (pass.status !== 'approved') {
      toast.error('Pass not approved');
      setScannedPass(pass);
      return;
    }

    if (pass.paymentStatus !== 'completed') {
      toast.error('Payment not completed');
      setScannedPass(pass);
      return;
    }

    const validTo = new Date(pass.validTo);
    const today = new Date();
    
    if (validTo < today) {
      toast.error('Pass has expired');
      setScannedPass(pass);
      return;
    }

    toast.success('Pass verified successfully!');
    setScannedPass(pass);
    
    // Add to scan history
    setScanHistory(prev => [{
      passId: pass.qrCode,
      route: pass.route,
      time: new Date().toLocaleString(),
      status: 'verified'
    }, ...prev.slice(0, 9)]);
  };

  const isPassValid = (pass: BusPass) => {
    if (pass.status !== 'approved') return false;
    if (pass.paymentStatus !== 'completed') return false;
    const validTo = new Date(pass.validTo);
    return validTo >= new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Operator Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                QR Code Scanner & Verification
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
                <p className="text-xs text-gray-600 dark:text-gray-400">Bus Operator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
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

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Scan className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Scan QR Code
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter or scan passenger's QR code
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    QR Code / Pass ID
                  </label>
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                    placeholder="Enter QR code or Pass ID"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleScan}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Scan className="w-5 h-5" />
                  Verify Pass
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Demo Pass IDs: PASS-{Date.now() - 1000000}, PASS-{Date.now() - 2000000}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Result */}
            {scannedPass && (
              <div className={`rounded-2xl shadow-lg p-8 ${
                isPassValid(scannedPass)
                  ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800'
                  : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  {isPassValid(scannedPass) ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-600" />
                      <div>
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-100">
                          Valid Pass
                        </h3>
                        <p className="text-green-700 dark:text-green-200">
                          Passenger verified successfully
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-12 h-12 text-red-600" />
                      <div>
                        <h3 className="text-2xl font-bold text-red-800 dark:text-red-100">
                          Invalid Pass
                        </h3>
                        <p className="text-red-700 dark:text-red-200">
                          Passenger not authorized
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pass Type</p>
                      <p className="font-semibold text-gray-800 dark:text-white capitalize">
                        {scannedPass.passType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Route</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {scannedPass.route}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {scannedPass.validTo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pass ID</p>
                      <p className="font-mono text-sm text-gray-800 dark:text-white">
                        {scannedPass.qrCode}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-semibold ${
                        scannedPass.status === 'approved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {scannedPass.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                      <span className={`font-semibold ${
                        scannedPass.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {scannedPass.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scan History */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Recent Scans
              </h2>

              {scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No scans yet. Start verifying passes!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scanHistory.map((scan, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {scan.route}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {scan.passId}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {scan.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Today's Statistics
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {scanHistory.length}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Verified Passes
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(Math.random() * 50) + 100}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Total Passengers
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(Math.random() * 5) + 2}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Invalid Attempts
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    98%
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Success Rate
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                Quick Reference
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Green: Valid and active pass
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Red: Invalid or expired pass
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Yellow: Payment pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}