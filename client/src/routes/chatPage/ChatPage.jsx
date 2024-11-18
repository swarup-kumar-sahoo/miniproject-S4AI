import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import NewPrompt from '../../components/newPrompt/NewPrompt';
import styles from "./chatPage.module.css";
import { useParams, useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { id: chatId } = useParams();
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatId) {
      navigate("/dashboard");
    }
  }, [chatId, navigate]);

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      if (!chatId) {
        throw new Error("Chat ID is missing");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}?userId=${userId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        throw new Error("Failed to fetch chat");
      }
      return response.json();
    },
    enabled: !!chatId && !!userId,
    retry: false,
    onError: (error) => {
      if (error.message === "Chat not found") {
        navigate("/dashboard");
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ question, answer, imgUrl }) => {
      if (!chatId) {
        throw new Error("Chat ID is missing");
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, question, answer, imgUrl }),
      });
      if (!response.ok) {
        throw new Error('Failed to update chat');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chat", chatId]);
    },
  });

  if (!chatId) {
    return null; // This will prevent rendering anything if there's no chatId
  }

  if (isPending) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>An error occurred: {error.message}</div>;

  return (
    <div className={styles.chatPage}>
      <div className={styles.wrapper}>
        <div className={styles.chat}>
          {data?.history?.map((message, i) => (
            <div key={i}>
              {message.img && (
                <IKImage
                  urlEndpoint="https://ik.imagekit.io/duyut14iw"
                  path={message.img}
                  height="300"
                  width="400"
                  transformation={[{ height: 300, width: 400 }]}
                  loading="lazy"
                  lqip={{ active: true, quality: 20 }}
                />
              )}
              <div className={`${styles.message} ${message.role === "user" ? styles.user : ""}`}>
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            </div>
          ))}
          {data && <NewPrompt data={data} onSubmit={mutation.mutate} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
