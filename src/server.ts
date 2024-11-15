import fastify from 'fastify'

const app = fastify()

app.get('/webhook', async (request, reply) => {
  return 'pong\n'
})

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import { CreateProjectWithBudget } from './create.project.with.budget';

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set');
}

CreateProjectWithBudget({   });

// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "Crie nomem de um trader objetivos que enfrenta seus medos e a ganancia";

// model.generateContent(prompt)
//   .then(response => {
//     console.log(response.response.text());
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

app.listen({ port: 8081 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})