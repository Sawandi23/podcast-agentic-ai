import os
import re
import random
import requests
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")
USE_MOCK = os.getenv("USE_MOCK", "true").lower() == "true"

def generate_with_ollama(prompt: str, model: str = None):
    """
    Sends a prompt to Ollama LLM and returns the response.
    If no model is provided, uses MODEL_NAME from .env
    Falls back to mock data if Ollama is unavailable
    """
    if model is None:
        model = MODEL_NAME

    # Try real Ollama first
    if not USE_MOCK:
        try:
            response = requests.post(
                OLLAMA_URL,
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=10
            )

            if response.status_code == 200:
                # Ollama returns JSON like {"response": "..."}
                return response.json().get("response", "")
            else:
                raise Exception(f"Ollama error: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"⚠️  Ollama unavailable: {str(e)}")
            print("⚠️  Falling back to mock responses")
    
    # Fallback: Return mock data
    return generate_mock_response(prompt)


def generate_mock_response(prompt: str):
    """Generate mock responses for testing without Ollama"""
    prompt_lower = prompt.lower()
    
    # Check for outline generation first (has both outline and podcast keywords)
    if ("outline" in prompt_lower or "structured" in prompt_lower) and "podcast" in prompt_lower:
        return """I. Introduction
   - Hook and topic overview
   - Why this topic matters
   - What listeners will learn

II. Main Section 1: Background & Context
   - Historical perspective
   - Current state of the topic
   - Key players and stakeholders

III. Main Section 2: Key Insights & Analysis
   - Deep dive into main points
   - Real-world examples
   - Statistical data

IV. Main Section 3: Practical Applications
   - How this affects listeners
   - Actionable takeaways
   - Implementation strategies

V. Expert Perspective
   - Industry insights
   - Best practices
   - Future projections

VI. Conclusion & Call to Action
   - Recap of key points
   - Final thoughts
   - Resources for further learning"""
    
    # Check for script generation 
    elif ("script" in prompt_lower or "write" in prompt_lower) and ("podcast" in prompt_lower or "episode" in prompt_lower):
        return """PODCAST EPISODE SCRIPT

[SECTION 1: INTRO & HOOK - 0:00-1:00]

Host: "Welcome back to the podcast! I'm your host, and today we're exploring a topic that affects all of us in ways we might not even realize. Whether you're commuting, working out, or just taking a break, I'm excited to share some fascinating insights with you."

Host: "Before we jump in, I want to give you a quick roadmap of what we're covering today. We'll start with the fundamentals, then explore some real-world examples that really bring this to life, and finish with practical takeaways you can use immediately."

---

[SECTION 2: BACKGROUND & CONTEXT - 1:00-4:00]

Host: "Let's start with the basics. To truly understand this topic, we need to look back at how it developed. Over the past decade, we've seen remarkable changes that have shaped our current landscape."

Host: "The history of this subject is fascinating because it shows us how innovation happens gradually. It started when pioneers recognized a problem that needed solving. They took their initial ideas and refined them over time, learning from failures and building on successes."

Host: "Today, the landscape looks completely different. We have new technologies, new players in the market, and new ways of thinking about the problem. What was revolutionary five years ago is now becoming standard practice."

---

[SECTION 3: DEEP DIVE & ANALYSIS - 4:00-8:00]

Host: "Now let's go deeper. There are three key aspects we need to understand about this topic."

Host: "First, the technical side. Without getting too nerdy, here's what's happening: the underlying mechanisms have evolved significantly. The key innovation is that it's now more accessible, more efficient, and more scalable than ever before."

Host: "Second, the human element. This isn't just about technology—it's about how people interact with it. We're seeing a shift in mindset, where more people understand the value and are willing to invest time and resources."

Host: "Third, the broader implications. This affects not just individuals but organizations, industries, and society as a whole. The ripple effects are still unfolding, and that's what makes this moment so important."

Host: "Let me give you a concrete example that ties these together. Imagine a company that was struggling with a particular challenge. They implemented the right solution. The result? They saw measurable, significant outcomes. This isn't an isolated success—it's happening across industries."

---

[SECTION 4: EXPERT PERSPECTIVE - 8:00-10:00]

Host: "To give us more context on what experts are saying, here's what the latest research shows: studies indicate that this area is growing and evolving rapidly. This is significant because it validates what many practitioners have been experiencing in the field."

Host: "Leading experts in this space are saying something important: the future is going to be shaped by emerging trends and innovations. They're predicting that we'll see more widespread adoption happening in the next few years."

Host: "One thing most experts agree on is that the fundamentals haven't changed—what has changed is our ability to execute. This gives us confidence that we're moving in the right direction and that the time is right to pay attention."

---

[SECTION 5: PRACTICAL APPLICATIONS - 10:00-13:00]

Host: "So here's the most important question: how does this actually affect you? What can you do with this information? Let me break it down into three actionable steps."

Host: "Step 1: Start with the fundamentals. Take the time to really understand the core concepts. This will give you a solid foundation. If you're just starting out, focus on one element and get comfortable with it before moving on. This might take days or weeks, and that's perfectly fine."

Host: "Step 2: Once you've got the basics down, it's time to experiment. Try different approaches. See what works for your unique situation. This is where things get really interesting because you'll start seeing real results. You might succeed on the first try, or you might need to adjust and try again. Both outcomes teach you valuable lessons."

Host: "Step 3: This is where you level up. Take everything you've learned and combine it in new ways. Share your knowledge with others. Build on what's worked and discard what hasn't. This is how you become an expert and set yourself apart from others."

Host: "The beauty of these three steps is that they build on each other. You don't need to do everything at once. Pick one and get comfortable with it before moving to the next. Progress beats perfection every single time."

---

[SECTION 6: CLOSING & CALL TO ACTION - 13:00-15:00]

Host: "As we wrap up, let me recap the key points we've covered. We explored the background and how we got here. We dived deep into the mechanisms at play and the different angles to consider. We heard from experts about where things are headed. And we discussed practical, actionable steps you can take right now."

Host: "The most important takeaway is this: the time to act is now. Things are changing rapidly, and the people who understand this and take action early are going to be the ones who benefit most."

Host: "I'd love to hear what you think about this. Drop me a message, leave a comment, or reach out on social media. Your insights and experiences are valuable, and I want to feature the most interesting perspectives on future episodes."

Host: "Thank you so much for joining me today. If this episode resonated with you, please share it with someone who might benefit from it. And don't forget to subscribe so you don't miss next week's episode."

Host: "Until next time, keep exploring, keep questioning, and keep growing. This is your host, signing off. See you soon!\""""
    
    # Check for safety/review
    elif "review" in prompt_lower or "safety" in prompt_lower or "rewrite" in prompt_lower:
        return """[REVIEWED & ENHANCED PODCAST SCRIPT]

[INTRO - 0:00-0:30]
Host: "Welcome back to the show! I'm your host, and today we're diving into something that's been on everyone's mind lately. We're exploring a fascinating topic that affects all of us in unique ways, and I'm excited to share some really interesting insights with you."

[MAIN CONTENT - 0:30-8:00]
Host: "Let's start with the foundations. To truly understand this topic, we need to look at how it developed. Over the past decade, we've seen remarkable changes that have shaped our current landscape. Here's what you need to know..."

[ENGAGING EXAMPLES - 8:00-12:00]
Host: "Let me share a compelling example that really brings this to life. Picture this scenario: someone discovers a problem and decides to take action. This real-world experience shows us exactly why this matters..."

[EXPERT PERSPECTIVES - 12:00-14:00]
Host: "Leading experts in this field are saying something important. Their research consistently shows that..."

[PRACTICAL TAKEAWAYS - 14:00-16:00]
Host: "Here are three actionable insights from today's discussion:
1. Understand the context and how it applies to your life
2. Take small steps toward implementation
3. Stay informed about new developments in this space"

[STRONG CONCLUSION - 16:00-17:00]
Host: "Thank you for joining us today! This is a topic worth discussing with others. If this resonated with you, I'd love to hear your thoughts. Subscribe for more conversations that matter!"

✓ Content verified for clarity
✓ Tone is engaging and conversational
✓ All claims are grounded and balanced"""
    
    # Check for topic generation (default for "generate topic" prompts)
    elif "topic" in prompt_lower and ("idea" in prompt_lower or "generate" in prompt_lower):
        theme_match = re.search(r'about:\s*"([^"]+)"', prompt)
        theme = (theme_match.group(1).strip() if theme_match else "General")

        count_match = re.search(r"exactly\s+(\d+)\s+unique", prompt_lower)
        count = int(count_match.group(1)) if count_match else 5

        more_requested = "requested more topics" in prompt_lower or "continue with fresh ideas" in prompt_lower

        topic_pool = [
            f"Why {theme} Matters Right Now",
            f"Biggest Myths About {theme}",
            f"Beginner Mistakes in {theme}",
            f"How to Start with {theme} Today",
            f"Real-Life Stories from {theme}",
            f"Lessons Learned from {theme} Experts",
            f"The Future of {theme} in Everyday Life",
            f"What Nobody Tells You About {theme}",
            f"Simple Frameworks for Better {theme} Results",
            f"Common Challenges in {theme} and Fixes",
        ]

        more_topic_pool = [
            f"How {theme} Is Changing This Year",
            f"Tools and Habits That Improve {theme}",
            f"Top Trends Shaping {theme}",
            f"Do's and Don'ts in {theme}",
            f"A Practical Guide to {theme} for Beginners",
            f"Advanced {theme} Tactics That Actually Work",
            f"How to Measure Progress in {theme}",
            f"The Psychology Behind Better {theme} Decisions",
            f"How to Build Consistency in {theme}",
            f"From Confused to Confident in {theme}",
        ]

        source_pool = more_topic_pool if more_requested else topic_pool
        selected = random.sample(source_pool, k=min(max(count, 1), len(source_pool)))
        return "\n".join(f"{idx+1}. {topic}" for idx, topic in enumerate(selected))
    
    else:
        return """That's a great question! Here's what I think about it:

This is definitely an important topic worth exploring. The key points to consider are:

1. First, understand the context and background of the issue
2. Second, look at real-world examples and case studies
3. Third, consider the different perspectives and viewpoints
4. Finally, think about the practical implications and what it means for you

This topic is complex, but by breaking it down into these components, we can develop a more nuanced understanding. I hope this perspective is helpful!"""