# Podcast Agentic AI

An AI-powered podcast script generation system built with a multi-agent architecture. The system uses specialized AI agents orchestrated together to generate, refine, and safety-check podcast scripts based on user-provided themes.

## 🏗️ Architecture

This project follows a **multi-agent architecture** where specialized agents collaborate to generate podcast content:

### Agents
- **Topic Agent**: Generates relevant podcast topics based on a theme
- **Outline Agent**: Creates structured outlines for selected topics
- **Script Agent**: Converts outlines into full podcast scripts
- **Safety Agent**: Reviews and filters scripts for inappropriate content

### Tech Stack

**Backend:**
- Python 3.x
- FastAPI (REST API framework)
- Ollama (Local LLM integration)
- MongoDB (Database for storing episodes)

**Frontend:**
- React 19
- Vite (Build tool)
- Axios (API communication)

## 📁 Project Structure

```
podcast-agentic-ai/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── agents/                    # AI agent modules
│   │   ├── topic_agent.py        # Topic generation
│   │   ├── outline_agent.py      # Outline generation
│   │   ├── script_agent.py       # Script generation
│   │   └── safety_agent.py       # Content safety review
│   ├── orchestrator/
│   │   └── orchestrator.py       # Agent coordination pipeline
│   ├── services/
│   │   └── llm_service.py        # LLM integration (Ollama)
│   ├── db/
│   │   └── mongo_service.py      # MongoDB operations
│   └── schemas/
│       └── request_models.py     # Pydantic models
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main application
    │   ├── api.js                # API client
    │   └── components/           # React components
    │       ├── TopicGenerator.jsx
    │       ├── PodcastGenerator.jsx
    │       ├── ChatPage.jsx
    │       └── ChatBox.jsx
    └── package.json
```

## 🔄 Workflow

1. **User inputs a theme** → Topic Agent generates 3-5 relevant topics
2. **User selects a topic** → Orchestrator triggers the full pipeline:
   - Outline Agent creates a structured outline
   - Script Agent writes the full podcast script
   - Safety Agent reviews and approves the content
3. **Final script is returned** to the user and optionally saved to MongoDB

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud)
- Ollama (with llama3.2 model installed)

### Backend Setup

```bash
cd backend
pip install fastapi uvicorn pymongo python-dotenv
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

- `GET /` - Health check
- `POST /generate-topics` - Generate topics from a theme
- `POST /generate-podcast` - Run full pipeline (outline → script → safety check)
- `POST /chat` - Interactive chat endpoint

## 🤖 LLM Integration

The system uses **Ollama** with the `llama3.2` model for all AI operations. Each agent makes structured prompts to the LLM to perform its specialized task.

## 💾 Database

MongoDB stores generated podcast episodes with:
- Theme
- Selected topic
- Generated outline
- Final script
- Timestamp

## 🔒 Safety Features

The Safety Agent reviews all generated scripts for:
- Inappropriate content
- Harmful information
- Bias and fairness
- Content quality

## 📝 Future Enhancements

- Audio generation from scripts (TTS)
- Multi-host conversation scripts
- Topic suggestion based on trends
- User authentication and episode history
- Fine-tuned models for better podcast-style content

## 📄 License

[Add your license here]

## 👤 Author

[Add your name/info here]