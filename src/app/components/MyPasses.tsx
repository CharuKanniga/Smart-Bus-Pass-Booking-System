import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, CreditCard, CheckCircle, Clock, XCircle, QrCode as QrIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { getCurrentUser, getUserPasses, updatePassStatus } from '../utils/mockData';
import type { BusPass } from '../utils/mockData';

export function MyPasses() {
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser());
  const [passes, setPasses] = useState<BusPass[]>([]);
  const [selectedPass, setSelectedPass] = useState<BusPass | null>(null);
  const passCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
      return;
    }
    const userPasses = getUserPasses(user.id);
    setPasses(userPasses);
  }, [user, navigate]);

  const handlePayment = (passId: string) => {
    // Simulate payment
    const updatedPasses = passes.map(p => {
      if (p.id === passId) {
        return { ...p, paymentStatus: 'completed' as const };
      }
      return p;
    });
    setPasses(updatedPasses);
    toast.success('Payment completed successfully!');
  };

  const handleDownloadPDF = async (pass: BusPass) => {
    if (!passCardRef.current) return;

    try {
      const canvas = await html2canvas(passCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 15, 15, imgWidth, imgHeight);
      pdf.save(`bus-pass-${pass.id}.pdf`);

      toast.success('Pass downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download pass');
    }
  };

  const handleRenew = (pass: BusPass) => {
    toast.info('Renew feature - redirecting to application...');
    navigate('/user/apply');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/user')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Passes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View, download, and manage your bus passes
          </p>
        </div>

        {passes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <QrIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No passes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Apply for your first bus pass to get started
            </p>
            <button
              onClick={() => navigate('/user/apply')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Apply for Pass
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {passes.map((pass) => (
              <div
                key={pass.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Pass Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{pass.passType.toUpperCase()}</h3>
                      <p className="text-blue-100">{pass.route}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      {getStatusIcon(pass.status)}
                      <span className="text-sm font-semibold capitalize">{pass.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-blue-200">Valid From</p>
                      <p className="font-semibold">{pass.validFrom}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Valid To</p>
                      <p className="font-semibold">{pass.validTo}</p>
                    </div>
                  </div>
                </div>

                {/* Pass Card Body */}
                <div className="p-6">
                  {/* QR Code */}
                  {pass.status === 'approved' && (
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-xl shadow-md">
                        <QRCode value={pass.qrCode} size={150} />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Pass ID:</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {pass.qrCode}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        ₹{pass.amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                      <span
                        className={`font-semibold ${
                          pass.paymentStatus === 'completed'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {pass.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {pass.status === 'approved' && pass.paymentStatus === 'pending' && (
                      <button
                        onClick={() => handlePayment(pass.id)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Complete Payment
                      </button>
                    )}

                    {pass.status === 'approved' && pass.paymentStatus === 'completed' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedPass(pass);
                            setTimeout(() => handleDownloadPDF(pass), 100);
                          }}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Download Pass PDF
                        </button>
                        <button
                          onClick={() => handleRenew(pass)}
                          className="w-full border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 font-semibold"
                        >
                          Renew Pass
                        </button>
                      </>
                    )}

                    {pass.status === 'pending' && (
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                        <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Your application is under review
                        </p>
                      </div>
                    )}

                    {pass.status === 'rejected' && (
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                          Application was rejected
                        </p>
                        <button
                          onClick={() => navigate('/user/apply')}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          Apply Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hidden Pass Card for PDF Generation */}
        {selectedPass && (
          <div className="fixed -left-[9999px] top-0">
            <div
              ref={passCardRef}
              className="w-[600px] bg-white p-8"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
                <h1 className="text-3xl font-bold mb-2">SMART BUS PASS</h1>
                <p className="text-blue-100">Official Travel Document</p>
              </div>

              {/* Body */}
              <div className="border-2 border-gray-200 border-t-0 p-8 rounded-b-2xl">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-4">PASSENGER DETAILS</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-semibold">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pass Type</p>
                        <p className="font-semibold uppercase">{selectedPass.passType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Route</p>
                        <p className="font-semibold">{selectedPass.route}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-4">VALIDITY</h3>
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Valid From</p>
                        <p className="font-semibold">{selectedPass.validFrom}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Valid To</p>
                        <p className="font-semibold">{selectedPass.validTo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <QRCode value={selectedPass.qrCode} size={200} />
                    <p className="text-xs text-gray-500 mt-2">{selectedPass.qrCode}</p>
                  </div>
                </div>

                <div className="border-t pt-4 text-center text-xs text-gray-500">
                  <p>This is a computer-generated pass. Valid only with photo ID.</p>
                  <p className="mt-1">For queries: support@smartbuspass.com | +1234567890</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}