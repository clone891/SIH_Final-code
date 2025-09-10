import os
from groq import Groq
from typing import List
from models.chat_models import ChatMessage
import logging

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"  # You can change this to other Groq models
        
        # Mental health chatbot system prompt
        self.system_prompt = """You are a compassionate and professional mental health support chatbot. Your role is to:

1. Provide emotional support and active listening
2. Offer evidence-based coping strategies and techniques
3. Help users explore their feelings in a safe, non-judgmental space
4. Recognize when someone may need professional help and gently encourage seeking it
5. Never provide medical diagnoses or replace professional therapy

Guidelines:
- Be empathetic, warm, and supportive
- Use person-first language
- Ask open-ended questions to encourage reflection
- Validate emotions while providing helpful perspectives
- If someone mentions self-harm or suicide, express concern and provide crisis resources
- Keep responses conversational but professional
- Encourage self-care and healthy coping mechanisms

Remember: You are a supportive companion, not a replacement for professional mental health care."""

    async def generate_response(self, user_message: str, conversation_history: List[ChatMessage] = None) -> str:
        try:
            # Prepare messages for the API
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                    messages.append({
                        "role": msg.role,
                        "content": msg.content
                    })
            
            # Add current user message
            messages.append({
                "role": "user", 
                "content": user_message
            })
            
            # Make API call to Groq
            response = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.7,
                max_tokens=1000,
                top_p=0.9,
                stream=False
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "I'm sorry, I'm having trouble responding right now. Please try again in a moment, and remember that if you're in crisis, please reach out to a mental health professional or crisis helpline."

    def is_crisis_message(self, message: str) -> bool:
        """Simple crisis detection - in production, use more sophisticated methods"""
        crisis_keywords = [
            "suicide", "kill myself", "end it all", "hurt myself", 
            "self-harm", "cutting", "overdose", "can't go on"
        ]
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in crisis_keywords)

    def get_crisis_response(self) -> str:
        return """I'm very concerned about what you've shared. Your life has value and there are people who want to help.

**Immediate Crisis Resources:**
• National Suicide Prevention Lifeline: 988 or 1-800-273-8255
• Crisis Text Line: Text HOME to 741741
• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

Please reach out to a mental health professional, trusted friend, family member, or emergency services if you're in immediate danger. You don't have to go through this alone."""