import { Link, Outlet, useNavigate } from "react-router-dom";
import "./rootLayout.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const RootLayout = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated (use localStorage to manage authentication status)
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Redirect to sign-in if no userId in localStorage
    if (!userId) {
      navigate("/sign-in");
    }
  }, [userId, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          <Link to="/" className="logo">
            <img src="/logo.png" alt="LAMA AI Logo" />
            <span>LAMA AI</span>
          </Link>
          <div className="user">
            {userId && (
              <div className="user-info">
                <span>Welcome, User</span>
                <button onClick={() => {
                  localStorage.removeItem("userId");
                  navigate("/sign-in");
                }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
