# 🌟 Cool-Agent

**Cool-Agent** is a command-line AI assistant that uses OpenAI's GPT model to understand and respond to user queries. It can also fetch real-time weather data using the Weather API. The assistant follows a structured plan-act-observe approach to deliver accurate and meaningful responses.

---

## 🚀 Features

- **🧠 AI Assistant**: Leverages OpenAI’s GPT model for intelligent and contextual responses.
- **🌦️ Weather Info**: Fetches current weather data for any city via the Weather API.
- **📦 Structured Interaction**: Utilizes a JSON-based format to plan actions and interpret observations.

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- An **OpenAI API key**
- A **Weather API key**

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Cool-Agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   WEATHER_API_KEY=your_weather_api_key
   ```

4. *(Optional)* Check the `.env.example` file for guidance.

---

## 💻 Usage

1. **Start the application:**
   ```bash
   node index.js
   ```

2. **Interact via the terminal:**
   ```bash
   >> What is the weather in New York?
   ```

3. **Example Output:**
   ```bash
   >> What is the weather in London?
   17°C, Clear skies
   ```

---

## 🗂️ Project Structure

```bash
Cool-Agent/
├── index.js            # Main application logic
├── Dockerfile          # Docker container configuration
├── docker-compose.yml  # Docker Compose setup
├── .env                # Environment variables (not included in repo)
├── .env.example        # Example env file
├── package.json        # Project metadata and dependencies
```

---

## 🔐 Environment Variables

The following environment variables must be defined:

- `OPENAI_API_KEY`: Your OpenAI API key.
- `WEATHER_API_KEY`: Your Weather API key.

---

## 🐳 Docker Support

You can run Cool-Agent using Docker:

1. **Build the image:**
   ```bash
   docker-compose build
   ```

2. **Run the container:**
   ```bash
   docker-compose up
   ```

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙌 Acknowledgments

- **[OpenAI](https://openai.com/)** – for the GPT model.
- **[Weather API](https://www.weatherapi.com/)** – for accurate weather data.
