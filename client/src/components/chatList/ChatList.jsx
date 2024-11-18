import { Link } from 'react-router-dom';
import './chatList.css';
import { useQuery } from '@tanstack/react-query';

const ChatList = () => {
  const userId = localStorage.getItem("userId");
  const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats/${userId}`, {
        headers: {
          "Authorization": `Bearer ${userId}`,
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      return response.json();
    },
    enabled: !!userId,
  });

  if (!userId) {
    return <div>Please log in to view your chats.</div>;
  }

  return (
    <div className='chatList'>
      <span className='title'>DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore LAMA AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className='title'>RECENT CHATS</span>
      <div className="list">
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error-message">Error: {error.message}</div>
        ) : data && data.length > 0 ? (
          data.map(chat => (
            <Link 
              to={`/dashboard/chats/${chat._id}`} 
              key={chat._id}
              className="chat-link"
            >
              {chat.title}
            </Link>
          ))
        ) : (
          <div className="no-chats">No recent chats</div>
        )}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="LAMA AI Logo" />
        <div className="texts">
          <span>Upgrade to LAMA AI Pro</span>
          <span>Get Unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;