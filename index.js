import OpenAI from "openai";
import readlineSync from "readline-sync";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const apiKey = process.env.WEATHER_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function getCurrentWeather(city = "") {
    if (!city) return "City name is required";

    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await axios.get(url);
        const temperature = response.data.current?.temp_c;
        console.log(temperature);
        return temperature !== undefined ? `${temperature}°C` : "N/A";
    } catch (error) {
        console.error(
            "Error fetching weather:",
            error?.response?.data || error.message
        );
        return "Weather unavailable";
    }
}

const tools = { getCurrentWeather: getCurrentWeather };

const SYSTEM_PROMPT = `You are an AI Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with Appropriate tools and wait for Observation based on Action.
Once you get the observation, Return the AI Response based on START prompt and Observation.

Strictly follow the JSON output format as in examples.

Available Tools:
- function getCurrentWeather(city:string):string
getCurrentWeather is a function accepts city name as string and returns the weather details of that city.

Example:
START
{"type":"user","user":"What is the sum of weather of Varanasi and Gurugram today?"}
{"type":"plan","user":"I will call the getCurrentWeather for Varanasi"}
{"type":"action","function":"getCurrentWeather","input":"Varanasi"}
{"type":"observation","observation":"17°C"}
{"type":"plan","user":"I will call the getCurrentWeather for Gurugram"}
{"type":"action","function":"getCurrentWeather","input":"Gurugram"}
{"type":"observation","observation":"10°C"}
{"type":"output","output":"The sum of weather of Varanasi and Gurugram is 27°C"}
`;

const message = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
    const query = readlineSync.question(">> ");
    const q = {
        type: "user",
        user: query,
    };
    message.push({ role: "user", content: JSON.stringify(q) });

    while (true) {
        const chat = await client.chat.completions.create({
            model: "gpt-4o",
            messages: message,
            response_format: { type: "json_object" },
        });
        const result = chat.choices[0].message.content;
        message.push({ role: "assistant", content: result });

        const call = JSON.parse(result);
        if (call.type === "output") {
            console.log(call.output);
            break;
        } else if (call.type == "action") {
            const func = tools[call.function];
            const observation = await func(call.input);
            const obs = { type: "observation", observation: observation };
            message.push({ role: "developer", content: JSON.stringify(obs) });
        }
    }
}
