import { Link } from 'react-router';
import { Home, Bus } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <Bus className="w-24 h-24 text-blue-600 mx-auto mb-4 animate-bounce" />
          <h1 className="text-9xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Home className="w-5 h-5" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
