import { Link } from 'react-router-dom';
import './chatList.css';
import { useQuery } from '@tanstack/react-query';

const ChatList = () => {
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${VITE_API_URL}/api/userchats?userId=${userId}`, {
        headers: {
          "Authorization": `Bearer ${userId}`, // Example of sending userId in request header for custom auth
        },
      }).then((res) => res.json()),
  });

  return (
    <div className='chatList'>
      <span className='title'>DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore LAMA AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className='title'>RECENT CHATS</span>
      <div className="list">
        {isPending ? "Loading..." : error ? "Something went wrong" : data?.map(chat => (
          <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
            {chat.title}
          </Link>
        ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to LAMA AI Pro</span>
          <span>Get Unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
