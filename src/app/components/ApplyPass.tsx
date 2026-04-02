import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser, getRoutes, applyForPass, suggestRoute, predictCrowd } from '../utils/mockData';
import type { Route } from '../utils/mockData';

export function ApplyPass() {
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser());
  const [routes, setRoutes] = useState<Route[]>([]);
  const [formData, setFormData] = useState({
    passType: 'monthly',
    route: '',
    startDate: '',
    documents: [] as File[],
  });
  const [aiSuggestion, setAiSuggestion] = useState<Route | null>(null);
  const [crowdPrediction, setCrowdPrediction] = useState<string>('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
      return;
    }
    setRoutes(getRoutes());
  }, [user, navigate]);

  const handleAISuggestion = () => {
    if (fromLocation && toLocation) {
      const suggestion = suggestRoute(fromLocation, toLocation);
      if (suggestion) {
        setAiSuggestion(suggestion);
        setFormData(prev => ({ ...prev, route: suggestion.id }));
        toast.success('AI found the best route for you!');
      }
    } else {
      toast.error('Please enter from and to locations');
    }
  };

  const handleRouteCrowdPrediction = (routeId: string) => {
    const currentTime = new Date().toTimeString().slice(0, 5);
    const prediction = predictCrowd(routeId, currentTime);
    setCrowdPrediction(prediction);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: Array.from(e.target.files),
      }));
    }
  };

  const calculateAmount = () => {
    const selectedRoute = routes.find(r => r.id === formData.route);
    if (!selectedRoute) return 0;

    const multiplier = formData.passType === 'monthly' ? 1 : formData.passType === 'quarterly' ? 2.7 : 10;
    return Math.round(selectedRoute.fare * multiplier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.route || !formData.startDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const selectedRoute = routes.find(r => r.id === formData.route);
    const amount = calculateAmount();
    
    // Calculate valid to date
    const startDate = new Date(formData.startDate);
    const validTo = new Date(startDate);
    
    if (formData.passType === 'monthly') {
      validTo.setMonth(validTo.getMonth() + 1);
    } else if (formData.passType === 'quarterly') {
      validTo.setMonth(validTo.getMonth() + 3);
    } else {
      validTo.setFullYear(validTo.getFullYear() + 1);
    }

    const pass = applyForPass({
      userId: user!.id,
      passType: formData.passType,
      route: selectedRoute!.name,
      validFrom: formData.startDate,
      validTo: validTo.toISOString().split('T')[0],
      status: 'pending',
      amount,
      paymentStatus: 'pending',
      documents: formData.documents.map(f => f.name),
    });

    toast.success('Pass application submitted successfully!');
    navigate('/user/passes');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/user')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Apply for Bus Pass
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Fill in the details to apply for your bus pass
          </p>

          {/* AI Route Suggestion */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                AI Route Suggestion
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="From location"
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="To location"
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAISuggestion}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
              >
                Get Suggestion
              </button>
            </div>
            {aiSuggestion && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-purple-600 mb-2">Suggested Route:</p>
                <p className="text-gray-800 dark:text-white font-bold">
                  {aiSuggestion.name} - {aiSuggestion.startPoint} to {aiSuggestion.endPoint}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {aiSuggestion.distance} • {aiSuggestion.duration} • ₹{aiSuggestion.fare}/month
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pass Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Pass Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['monthly', 'quarterly', 'yearly'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, passType: type })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.passType === type
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 dark:text-white capitalize">
                      {type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type === 'monthly' ? '1 month' : type === 'quarterly' ? '3 months' : '12 months'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Route Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Route
              </label>
              <div className="space-y-3">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, route: route.id });
                      handleRouteCrowdPrediction(route.id);
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.route === route.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white mb-1">
                          {route.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {route.startPoint} → {route.endPoint}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                            {route.distance}
                          </span>
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                            {route.duration}
                          </span>
                          <span className="px-2 py-1 bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                            ₹{route.fare}/month
                          </span>
                        </div>
                      </div>
                      {formData.route === route.id && crowdPrediction && (
                        <div className="ml-4">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-semibold">Crowd: {crowdPrediction}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Documents (ID Proof, Photo)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Click to upload files
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  PNG, JPG or PDF (max. 5MB each)
                </p>
                {formData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.documents.map((file, index) => (
                      <p key={index} className="text-sm text-green-600">
                        ✓ {file.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amount Summary */}
            {formData.route && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Pass Type:</span>
                    <span className="font-semibold text-gray-800 dark:text-white capitalize">
                      {formData.passType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Route:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {routes.find(r => r.id === formData.route)?.name}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-800 dark:text-white">Total Amount:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ₹{calculateAmount()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/user')}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}