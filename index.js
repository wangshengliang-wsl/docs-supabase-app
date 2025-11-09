import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "anthropic/claude-sonnet-4.5",
    messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "hello, how are you?"
            }
          ]
        }
      ]
  });

  console.log(completion.choices[0].message);
}

main();
