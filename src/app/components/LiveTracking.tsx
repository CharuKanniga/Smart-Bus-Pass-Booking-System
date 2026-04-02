import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Clock, Users, Navigation } from 'lucide-react';
import { getCurrentUser, getRoutes } from '../utils/mockData';
import type { Route } from '../utils/mockData';

export function LiveTracking() {
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser());
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [busLocation, setBusLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi coordinates
  const [eta, setEta] = useState('5 min');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
      return;
    }
    setRoutes(getRoutes());
  }, [user, navigate]);

  // Simulate bus movement
  useEffect(() => {
    if (!selectedRoute) return;

    const interval = setInterval(() => {
      setBusLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.01,
        lng: prev.lng + (Math.random() - 0.5) * 0.01,
      }));
      
      // Random ETA between 2-10 minutes
      setEta(`${Math.floor(Math.random() * 8) + 2} min`);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Live Bus Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your bus in real-time with AI-powered ETA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Select Route
              </h2>
              <div className="space-y-3">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedRoute?.id === route.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 dark:text-white mb-1">
                      {route.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {route.startPoint} → {route.endPoint}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Info */}
            {selectedRoute && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Bus Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ETA</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{eta}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {Math.floor(Math.random() * 30) + 20}/50
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Speed</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {Math.floor(Math.random() * 20) + 30} km/h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[600px]">
              {!selectedRoute ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a route to start tracking
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full relative">
                  {/* Map placeholder with animated bus */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
                    {/* Simulated map with road network */}
                    <svg className="w-full h-full opacity-20">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Route stops */}
                    <div className="absolute top-20 left-20 space-y-24">
                      {selectedRoute.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                          <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-md">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              {stop}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Animated bus icon */}
                    <div
                      className="absolute transition-all duration-1000 ease-linear"
                      style={{
                        left: `${(busLocation.lng % 1) * 100}%`,
                        top: `${(busLocation.lat % 1) * 100}%`,
                      }}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                          </svg>
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                          Bus #{Math.floor(Math.random() * 100) + 100}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="text-xl">+</span>
                    </button>
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="text-xl">−</span>
                    </button>
                  </div>

                  {/* Info Panel */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                          {selectedRoute.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedRoute.startPoint} → {selectedRoute.endPoint}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Arriving in</p>
                        <p className="text-2xl font-bold text-green-600">{eta}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Note about Google Maps */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a simulated tracking interface. In production, this would integrate with Google Maps API for real-time GPS tracking. You would need to add a Google Maps API key and implement the Google Maps JavaScript API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}