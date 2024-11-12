import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a recipe for a delicious carrot cake.";

model.generateContent(prompt)
  .then(response => {
    console.log(response.response.text());
  })
  .catch(error => {
    console.error('Error:', error);
  });