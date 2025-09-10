from typing import List, Dict
import os
from groq import Groq
from dotenv import load_dotenv

# Good practice: use an Enum for crisis levels
class CrisisLevel:
    EMERGENCY = "emergency"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class LlamaService:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
        self.model_name = "llama-3.1-8b-instant"
        self.ready = True # Groq is always ready if the key is valid

    async def initialize(self):
        # With Groq, initialization is instant
        print("✅ Groq client initialized.")

    def is_ready(self) -> bool:
        return self.ready

    async def generate_response(self, message: str, conversation_history: List[Dict]) -> str:
        messages = [{"role": "user", "content": message}]
        
        # Add conversation history to messages if available
        # This will depend on the format of conversation_history
        # Here we assume a list of dicts with 'role' and 'content'
        if conversation_history:
            messages = conversation_history + messages

        try:
            chat_completion = await self.client.chat.completions.create(
                messages=messages,
                model=self.model_name,
                temperature=0.7 # Optional: controls creativity
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            raise # Re-raise the exception to be handled by the caller

class MentalHealthService:
    def __init__(self, llama_service: LlamaService):
        self.llama_service = llama_service
        self.crisis_keywords = {
            CrisisLevel.EMERGENCY: ["suicide", "kill myself", "end it all", "want to die", "harm myself"],
            CrisisLevel.HIGH: ["hopeless", "worthless", "better off dead", "can't go on"],
            CrisisLevel.MEDIUM: ["depressed", "anxious", "overwhelmed", "stressed"]
        }
        self.ready = False
        
    async def initialize(self):
        """Initialize mental health service"""
        await self.llama_service.initialize()
        self.ready = self.llama_service.is_ready()
        print(f"✅ Mental Health service initialized: {self.ready}")
        
    def is_ready(self) -> bool:
        return self.ready
        
    def detect_crisis_level(self, message: str) -> str:
        """Detect crisis level in user message"""
        message_lower = message.lower()
        
        for level, keywords in self.crisis_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return level
                
        return CrisisLevel.LOW
    
    async def generate_response(self, message: str, conversation_history: List[Dict]) -> Dict:
        """Generate mental health focused response"""
        try:
            # Detect crisis level
            crisis_level = self.detect_crisis_level(message)
            
            # Generate AI response
            ai_response = await self.llama_service.generate_response(message, conversation_history)
            
            # Add safety disclaimer for mental health context
            if any(word in message.lower() for word in ["help", "depressed", "sad", "anxiety"]):
                ai_response += "\n\nRemember, I'm here to listen, but please consider speaking with a mental health professional if you're struggling."
            
            # Add crisis resources if needed
            crisis_detected = crisis_level in [CrisisLevel.EMERGENCY, CrisisLevel.HIGH]
            if crisis_detected:
                ai_response += "\n\n🆘 Crisis Resources:\n• Suicide Prevention: 022-25521111\n• KIRAN Helpline: 1800-599-0019"
            
            return {
                "response": ai_response,
                "crisis_detected": crisis_detected,
                "crisis_level": crisis_level
            }
            
        except Exception as e:
            print(f"Error in mental health service: {e}")
            return {
                "response": "I'm here to listen and support you. While I'm having some technical difficulties right now, please know that you're not alone. If you're in crisis, please reach out to: 022-25521111",
                "crisis_detected": True,
                "crisis_level": "medium"
            }