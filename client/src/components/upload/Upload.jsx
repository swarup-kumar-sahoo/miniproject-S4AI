import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const urlEndpoint = "https://ik.imagekit.io/nyj0rrpl1";
const publicKey = "public_EyR0fyryzue1HjHmiU+tzpxRUr4=";
const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userId")}`, // Adding Authorization header
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImg }) => {
  const ikUploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      <Link to="/image-maker">
        <img src="/logo.png" alt="AI Image Maker" style={{ width: '24px', height: '24px' }} />
      </Link>
    </IKContext>
  );
};

export default Upload;
