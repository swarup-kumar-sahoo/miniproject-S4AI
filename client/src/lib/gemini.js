import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD4gaEqjLz5msD-V-EBGaP3SPdiYybD_Xw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;