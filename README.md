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


## 🔄 Workflow

1. **User inputs a theme** → Topic Agent generates 3-5 relevant topics
2. **User selects a topic** → Orchestrator triggers the full pipeline:
   - Outline Agent creates a structured outline
   - Script Agent writes the full podcast script
   - Safety Agent reviews and approves the content
3. **Final script is returned** to the user and optionally saved to MongoDB


## 📝 Future Enhancements

- Audio generation from scripts (TTS)
- Multi-host conversation scripts
- Topic suggestion based on trends
- User authentication and episode history
- Fine-tuned models for better podcast-style content

