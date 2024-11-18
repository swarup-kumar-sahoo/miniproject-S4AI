import { Outlet, useNavigate } from 'react-router-dom';
import './dashboardLayout.css';
import { useEffect } from 'react';
import Chatlist from "../../components/chatList/ChatList";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/sign-in");  
    }
  }, [userId, navigate]);

  if (!userId) return <div className="loading">Loading...</div>;

  return (
    <div className='dashboardLayout'>
      <div className="menu"><Chatlist /></div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
