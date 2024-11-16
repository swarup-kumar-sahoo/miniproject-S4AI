// import { useState } from 'react';
// import './dashboardPage.css';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';

// const DashboardPage = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const mutation = useMutation({
//     mutationFn: (text) => {
//       const userId = localStorage.getItem("userId");
//       return fetch(`${VITE_API_URL}/api/chats`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId, text }),
//       }).then((res) => res.json());
//     },
//     onSuccess: (id) => {
//       queryClient.invalidateQueries({ queryKey: ['userChats'] });
//       navigate(`/dashboard/chats/${id}`);
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const text = e.target.text.value;
//     if (!text) return;

//     mutation.mutate(text);
//   };

//   return (
//     <div className='dashboardPage'>
//       <div className="texts">
//         <div className="logo">
//           <img src="/logo.png" alt="" />
//           <h1>LAMA AI</h1>
//         </div>
//         <div className="options">
//           <div className="option">
//             <img src="/chat.png" alt="" />
//             <span>Create a New Chat</span>
//           </div>
//           <div className="option">
//             <img src="/image.png" alt="" />
//             <span>Analyze Images</span>
//           </div>
//           <div className="option">
//             <img src="/code.png" alt="" />
//             <span>Help me with my Code</span>
//           </div>
//         </div>
//       </div>
//       <div className="formContainer">
//         <form onSubmit={handleSubmit}>
//           <input type="text" name='text' placeholder='Ask me Anything...' />
//           <button>
//             <img src="/arrow.png" alt="" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
import { useState } from 'react';
import styles from './dashboardPage.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  const mutation = useMutation({
    mutationFn: (text) => {
      const userId = localStorage.getItem("userId");
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, text }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      });
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      navigate(`/dashboard/chats/${id}`);
    },
    onError: (error) => {
      console.error('An error occurred:', error);
      // You might want to set an error state here and display it to the user
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    mutation.mutate(inputText);
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.texts}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="LAMA AI Logo" />
          <h1>LAMA AI</h1>
        </div>
        <div className={styles.options}>
          <div className={styles.option}>
            <img src="/chat.png" alt="Chat icon" />
            <span>Create a New Chat</span>
          </div>
          <div className={styles.option}>
            <img src="/image.png" alt="Image icon" />
            <span>Analyze Images</span>
          </div>
          <div className={styles.option}>
            <img src="/code.png" alt="Code icon" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Ask me Anything...' 
          />
          <button type="submit" disabled={mutation.isPending}>
            <img src="/arrow.png" alt="Submit" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;