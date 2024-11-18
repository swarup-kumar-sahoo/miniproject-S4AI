import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({ data }) => {
  const userId = localStorage.getItem("userId");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [error, setError] = useState("");

  const chat = model.startChat({
    history: data?.history?.length
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0].text }]
        }))
      : [
          { role: "user", parts: [{ text: "Hello" }] },
          { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] }
        ],
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: () => {
      if (!data?._id) {
        throw new Error("Chat ID is missing");
      }
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`,
        },
        body: JSON.stringify({
          userId,
          question: question.length ? question : undefined,
          answer,
          imgUrl: img.dbData?.filePath || undefined,
        }),
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to update chat');
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', data?._id] });
      formRef.current?.reset();
      setQuestion("");
      setAnswer("");
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
      setError("");
    },
    onError: (err) => {
      console.error("Error updating chat:", err);
      setError(err.message || "Failed to update chat. Please try again.");
    }
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.message.includes("The model is overloaded")) {
        // ... (existing overload handling code)
      } else if (error.message.includes("Chat not found")) {
        setError("This chat no longer exists. Please start a new chat.");
      } else {
        setError(error.message || "An error occurred while processing your request. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
  };

  const hasRun = useRef(false);
  useEffect(() => {
    const initializeChat = async () => {
      if (!data) {
        setError("Chat not found. Please start a new chat.");
        return;
      }
      if (!hasRun.current && data?.history?.length === 1) {
        await add(data.history[0].parts[0].text, true);
        hasRun.current = true;
      }
    };
    initializeChat();
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint="https://ik.imagekit.io/duyut14iw"
          path={img.dbData.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className='message user'>{question}</div>}
      {answer && (
        <div className='message'>
          <Markdown>{answer}</Markdown>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id='file' type="file" multiple={false} hidden />
        <input type="text" name='text' placeholder='Ask anything...' />
        <button type="submit" disabled={mutation.isPending}>
          <img src="/arrow.png" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;