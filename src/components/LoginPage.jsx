import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiCheck, FiShield, FiTruck } from 'react-icons/fi';
import { GiWashingMachine } from 'react-icons/gi';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side - Company Info */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-600 to-teal-500 p-12 text-white">
        <div className="max-w-md my-auto">
          <div className="flex items-center mb-6">
          <GiWashingMachine className="text-5xl mr-3 text-white" />
            <h1 className="text-4xl font-bold">Prime Laundry </h1>
          </div>
          
          <p className="text-lg mb-8 leading-relaxed text-emerald-100">
            Transform your laundry business with our industry-leading management software. Streamline operations, boost efficiency, and deliver exceptional service to your customers.
          </p>
          
          <div className="space-y-5">
            <div className="flex items-start">
              <div className="bg-emerald-500/20 p-2 rounded-full mr-4 mt-0.5">
                <FiCheck className="text-emerald-200" />
              </div>
              <div>
                <h3 className="font-semibold">Complete Business Solution</h3>
                <p className="text-emerald-100 text-sm">Manage orders, inventory, drivers, and payments in one platform</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-emerald-500/20 p-2 rounded-full mr-4 mt-0.5">
                <FiTruck className="text-emerald-200" />
              </div>
              <div>
                <h3 className="font-semibold">Real-Time Tracking</h3>
                <p className="text-emerald-100 text-sm">Monitor pickup and delivery status with live updates</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-emerald-500/20 p-2 rounded-full mr-4 mt-0.5">
                <FiShield className="text-emerald-200" />
              </div>
              <div>
                <h3 className="font-semibold">Enterprise Security</h3>
                <p className="text-emerald-100 text-sm">Bank-level encryption protects your business data</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-emerald-400/30">
            <p className="text-emerald-200 text-sm">
              Trusted by 1 laundry businesses Raipur (wo paise wapas maang rha hai wo alag baat hai)
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <FiLock className="text-emerald-600 text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Prime Laundry </h2>
            <p className="text-gray-600">Sign in to take your laundry business online</p>

          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="your@business.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Access Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>New to Prime Laundry? <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Request a demo</a></p>
              <p className="mt-2">Need help? <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Contact support</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;