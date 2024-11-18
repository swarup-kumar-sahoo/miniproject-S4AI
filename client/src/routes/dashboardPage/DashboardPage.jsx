import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardPage.module.css';

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (text) => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      navigate(`/dashboard/chats/${data.id}`);
    },
    onError: (error) => {
      console.error('An error occurred:', error);
      setError('Failed to create chat. Please try again.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setError('');
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
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
