import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCNm475ezrucGV1c169H0IIgjX1ftwSgqQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;