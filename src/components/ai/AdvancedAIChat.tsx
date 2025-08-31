import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  MessageCircle, 
  Brain, 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  Settings,
  Minimize2,
  Maximize2,
  RotateCcw,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Users
} from 'lucide-react';

const typingAnimation = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const AIContainer = styled.div<{ isExpanded: boolean; isMinimized: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
  width: ${props => props.isExpanded ? (props.isMinimized ? '60px' : '480px') : '60px'};
  height: ${props => props.isExpanded ? (props.isMinimized ? '60px' : '700px') : '60px'};
`;

const AIToggle = styled.button<{ isActive: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.isActive ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'};
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }
`;

const ChatInterface = styled.div<{ isVisible: boolean; isMinimized: boolean }>`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 480px;
  height: 640px;
  display: ${props => props.isVisible && !props.isMinimized ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e1e5e9;
`;

const ChatHeader = styled.div<{ persona: 'harry' | 'alex' }>`
  background: ${props => props.persona === 'harry' ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'};
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const PersonaAvatar = styled.div<{ persona: 'harry' | 'alex'; isActive: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${props => props.isActive ? pulseAnimation : 'none'} 2s infinite;

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #48bb78;
    border: 2px solid white;
  }
`;

const PersonaInfo = styled.div`
  flex: 1;
`;

const PersonaName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PersonaStatus = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
`;

const PersonaSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PersonaButton = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? 'rgba(255,255,255,0.3)' : 'transparent'};
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;

  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 450px;
`;

const Message = styled.div<{ isFromAI: boolean; persona: 'harry' | 'alex' }>`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: ${props => props.isFromAI ? 
    (props.persona === 'harry' ? '#f0f4ff' : '#f0fff4') : 
    '#667eea'};
  color: ${props => props.isFromAI ? '#2d3748' : 'white'};
  align-self: ${props => props.isFromAI ? 'flex-start' : 'flex-end'};
  border: ${props => props.isFromAI ? '1px solid #e2e8f0' : 'none'};
  position: relative;
  word-wrap: break-word;

  &::before {
    content: '';
    position: absolute;
    ${props => props.isFromAI ? 'left: -8px' : 'right: -8px'};
    top: 12px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    ${props => props.isFromAI ? 
      `border-right: 8px solid ${props.persona === 'harry' ? '#f0f4ff' : '#f0fff4'};` : 
      'border-left: 8px solid #667eea;'
    }
  }
`;

const TypingIndicator = styled.div<{ persona: 'harry' | 'alex' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.persona === 'harry' ? '#667eea' : '#48bb78'};
  font-style: italic;
  padding: 0.75rem 1rem;
  max-width: 80%;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 2px;
  
  span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    animation: ${typingAnimation} 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button<{ persona: 'harry' | 'alex' }>`
  background: ${props => props.persona === 'harry' ? '#edf2f7' : '#f0fff4'};
  border: 1px solid ${props => props.persona === 'harry' ? '#e2e8f0' : '#c6f6d5'};
  color: ${props => props.persona === 'harry' ? '#4a5568' : '#276749'};
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.persona === 'harry' ? '#667eea' : '#48bb78'};
    color: white;
    border-color: ${props => props.persona === 'harry' ? '#667eea' : '#48bb78'};
  }
`;

const InputArea = styled.div`
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem;
  resize: none;
  min-height: 40px;
  max-height: 100px;
  font-family: inherit;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const VoiceButton = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? '#e53e3e' : '#f7fafc'};
  color: ${props => props.isActive ? 'white' : '#4a5568'};
  border: 1px solid ${props => props.isActive ? '#e53e3e' : '#e2e8f0'};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isActive ? '#c53030' : '#edf2f7'};
  }
`;

const SendButton = styled.button<{ persona: 'harry' | 'alex' }>`
  background: ${props => props.persona === 'harry' ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

interface AIMessage {
  id: string;
  content: string;
  isFromAI: boolean;
  persona: 'harry' | 'alex';
  timestamp: Date;
  quickActions?: string[];
}

const AdvancedAIChat: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<'harry' | 'alex'>('harry');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const harryGreeting: AIMessage = {
    id: '1',
    content: "Hello! I'm Harry, your Risk Management Mentor. I'm here to guide you through complex scenarios and help you develop evidence-based decision-making skills. What would you like to explore today?",
    isFromAI: true,
    persona: 'harry',
    timestamp: new Date(),
    quickActions: [
      "Explain a risk concept",
      "Analyze current scenario", 
      "Review my decisions",
      "What patterns should I watch?"
    ]
  };

  const alexGreeting: AIMessage = {
    id: '2',
    content: "Hi there! I'm Alex, your Dynamic Scenario Generator. I create personalized risk scenarios based on your learning progress and interests. Ready for a new challenge tailored just for you?",
    isFromAI: true,
    persona: 'alex',
    timestamp: new Date(),
    quickActions: [
      "Generate new scenario",
      "Adaptive difficulty",
      "Industry-specific risks",
      "Team collaboration scenario"
    ]
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([currentPersona === 'harry' ? harryGreeting : alexGreeting]);
    }
  }, [currentPersona, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const switchPersona = (persona: 'harry' | 'alex') => {
    if (persona === currentPersona) return;
    
    setCurrentPersona(persona);
    setMessages([persona === 'harry' ? harryGreeting : alexGreeting]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isFromAI: false,
      persona: currentPersona,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse = generateAIResponse(inputMessage, currentPersona);
    setIsTyping(false);
    
    setMessages(prev => [...prev, aiResponse]);
  };

  const generateAIResponse = (userInput: string, persona: 'harry' | 'alex'): AIMessage => {
    const harryResponses = {
      "risk": "Great question about risk! In the AXiLe framework, we look at risks through multiple lenses: probability, impact, and interconnectedness. What specific aspect would you like to dive deeper into?",
      "decision": "Decision-making under uncertainty is a core skill. I recommend using the evidence-based approach: 1) Gather relevant data, 2) Consider historical patterns, 3) Evaluate potential outcomes, 4) Choose with clear reasoning. What decision are you facing?",
      "pattern": "Pattern recognition is crucial! Look for Natural Pattern Language indicators - recurring themes across different contexts. Historical data often reveals cycles that help predict future risks. What patterns have you noticed?",
      "scenario": "Let me help you analyze this scenario systematically. We should consider the OKRM structure: Objectives at risk, Key Results affected, potential cascade effects, and available mitigations. What's the context?",
      "default": "That's an excellent point to explore! Let's break it down using the AXiLe methodology. Consider how this connects to broader risk patterns and what evidence supports different approaches."
    };

    const alexResponses = {
      "generate": "Perfect! Let me create a scenario tailored to your current skill level. Based on your progress, I'll design a multi-domain risk challenge that builds on your strengths while developing new capabilities. Ready?",
      "difficulty": "I'll adapt the complexity based on your performance data. Your current analytics show strong pattern recognition but opportunity for growth in team leadership scenarios. Shall I create something that challenges this area?",
      "industry": "Which industry interests you most? I can generate scenarios for: FinTech disruption, Healthcare compliance, Manufacturing automation, Climate tech, or Startup scaling. Each has unique risk profiles!",
      "team": "Excellent choice! Team scenarios test collaboration, communication, and distributed decision-making. I'll create a crisis situation requiring coordinated response across multiple stakeholders. Sound challenging enough?",
      "default": "I love the creative thinking! Let me design something that incorporates your idea into a realistic business context with measurable outcomes and branching decision trees."
    };

    const responses = persona === 'harry' ? harryResponses : alexResponses;
    
    let response = responses.default;
    const lowerInput = userInput.toLowerCase();
    
    for (const [key, value] of Object.entries(responses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    const quickActions = persona === 'harry' 
      ? ["Tell me more", "Show examples", "Quiz me on this", "Related concepts"]
      : ["Create this scenario", "Adjust difficulty", "Add team element", "Different industry"];

    return {
      id: (Date.now() + 1).toString(),
      content: response,
      isFromAI: true,
      persona,
      timestamp: new Date(),
      quickActions
    };
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Text-to-speech would be implemented here
  };

  const clearChat = () => {
    setMessages([currentPersona === 'harry' ? harryGreeting : alexGreeting]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPersonaStatus = () => {
    if (isTyping) return 'Thinking...';
    if (currentPersona === 'harry') return 'Risk Analysis Expert • Online';
    return 'Scenario Generator • Ready to Create';
  };

  return (
    <AIContainer isExpanded={isExpanded} isMinimized={isMinimized}>
      <AIToggle 
        isActive={currentPersona === 'harry'}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {currentPersona === 'harry' ? <Brain size={24} /> : <Sparkles size={24} />}
      </AIToggle>

      <ChatInterface isVisible={isExpanded} isMinimized={isMinimized}>
        <ChatHeader persona={currentPersona}>
          <PersonaAvatar persona={currentPersona} isActive={isTyping}>
            {currentPersona === 'harry' ? <Brain size={20} /> : <Sparkles size={20} />}
          </PersonaAvatar>
          
          <PersonaInfo>
            <PersonaName>
              {currentPersona === 'harry' ? 'Harry AI' : 'Alex AI'}
              <Lightbulb size={16} />
            </PersonaName>
            <PersonaStatus>{getPersonaStatus()}</PersonaStatus>
          </PersonaInfo>

          <PersonaSelector>
            <PersonaButton 
              isActive={currentPersona === 'harry'}
              onClick={() => switchPersona('harry')}
            >
              Harry
            </PersonaButton>
            <PersonaButton 
              isActive={currentPersona === 'alex'}
              onClick={() => switchPersona('alex')}
            >
              Alex
            </PersonaButton>
          </PersonaSelector>

          <ControlButtons>
            <ControlButton onClick={toggleSpeaking}>
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </ControlButton>
            <ControlButton onClick={clearChat}>
              <RotateCcw size={16} />
            </ControlButton>
            <ControlButton onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </ControlButton>
          </ControlButtons>
        </ChatHeader>

        <MessagesContainer>
          {messages.map((message) => (
            <div key={message.id}>
              <Message 
                isFromAI={message.isFromAI} 
                persona={message.persona}
              >
                {message.content}
              </Message>
              
              {message.isFromAI && message.quickActions && (
                <QuickActions>
                  {message.quickActions.map((action, index) => (
                    <QuickActionButton
                      key={index}
                      persona={message.persona}
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </QuickActionButton>
                  ))}
                </QuickActions>
              )}
            </div>
          ))}
          
          {isTyping && (
            <TypingIndicator persona={currentPersona}>
              {currentPersona === 'harry' ? <Brain size={16} /> : <Sparkles size={16} />}
              {currentPersona === 'harry' ? 'Harry is analyzing...' : 'Alex is generating...'}
              <TypingDots>
                <span></span>
                <span></span>
                <span></span>
              </TypingDots>
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputArea>
          <VoiceButton isActive={isListening} onClick={toggleVoice}>
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </VoiceButton>
          
          <MessageInput
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${currentPersona === 'harry' ? 'Harry about risk management' : 'Alex to generate a scenario'}...`}
          />
          
          <SendButton 
            persona={currentPersona}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Send size={16} />
          </SendButton>
        </InputArea>
      </ChatInterface>
    </AIContainer>
  );
};

export default AdvancedAIChat;