import { Link, Outlet, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import "./rootLayout.css";

const queryClient = new QueryClient();

const RootLayout = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/sign-in");
    }
  }, [userId, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    navigate("/sign-in");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          <Link to="/" className="logo">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>S4 AI</span>
          </Link>
          <div className="user">
            {userId && (
              <div className="user-section">
                <div 
                  className="user-trigger"
                  onClick={toggleDropdown}
                >
                  <div className="user-avatar">
                    <span>U</span>
                  </div>
                  <span className="welcome-text">Welcome, User</span>
                </div>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={handleSignOut} className="sign-out-button">
                      <svg 
                        viewBox="0 0 24 24" 
                        width="16" 
                        height="16" 
                        stroke="currentColor" 
                        fill="none" 
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;