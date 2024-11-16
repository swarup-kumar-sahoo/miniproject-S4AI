import React from "react";
import { useQuery } from '@tanstack/react-query';
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import NewPrompt from '../../components/newPrompt/NewPrompt';
import styles from "./ChatPage.module.css"; // Assuming you have some CSS module for styling

const ChatPage = ({ chatId }) => {
  const userId = localStorage.getItem("userId");

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Loading state
  if (isPending) return <div className={styles.loading}>Loading...</div>;

  // Error state
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
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
