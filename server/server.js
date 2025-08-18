//This is an API Based assistant that uses OpenAI and WeatherAPI to provide weather information.
import express from "express";
import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import { SYSTEM_PROMPT } from "./prompt.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function getCurrentWeather(city = "") {
  if (!city) return "City name is required";
  const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;

  try {
    const response = await axios.get(url);
    const temperature = response.data.current?.temp_c;
    return temperature !== undefined ? `${temperature}°C` : "N/A";
  } catch (error) {
    console.error("Error fetching weather:", error?.response?.data || error.message);
    return "Weather unavailable";
  }
}

const tools = { getCurrentWeather };


app.post("/ask", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const messages = [{ role: "system", content: SYSTEM_PROMPT }];
  const q = { type: "user", user: query };
  messages.push({ role: "user", content: JSON.stringify(q) });

  while (true) {
    const chat = await client.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    const result = chat.choices[0].message.content;
    messages.push({ role: "assistant", content: result });

    const call = JSON.parse(result);

    if (call.type === "output") {
      return res.json({ answer: call.output });
    } else if (call.type === "action") {
      const func = tools[call.function];
      const observation = await func(call.input);
      const obs = { type: "observation", observation };
      messages.push({ role: "developer", content: JSON.stringify(obs) });
    }
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
