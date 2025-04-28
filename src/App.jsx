import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './components/LoginPage';
import SideNavbar from './components/SideNavbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex">
      {isAuthenticated && <SideNavbar />}
      <div className="flex-1">
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          ) : (
            <>
              {/* Home page after login */}
              <Route path="/" element={<HomePage />} />
              {/* Other pages */}
              {/* Example: <Route path="/pickup" element={<PickupPage />} /> */}
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

const HomePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Prime Laundry Dashboard!</h1>
      <p className="mt-4 text-gray-600">This is your homepage after login.</p>
    </div>
  );
};

export default App;
