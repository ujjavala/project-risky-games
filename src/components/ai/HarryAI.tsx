import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { MessageCircle, Brain, Lightbulb } from 'lucide-react';

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const HarryContainer = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
  width: ${props => props.isExpanded ? '400px' : '60px'};
  height: ${props => props.isExpanded ? '500px' : '60px'};
`;

const HarryButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: absolute;
  bottom: 0;
  left: 0;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
  }
`;

const HarryChat = styled.div<{ isExpanded: boolean }>`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 70px;
  left: 0;
  width: 400px;
  height: 450px;
  display: ${props => props.isExpanded ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e1e5e9;
  animation: ${slideIn} 0.3s ease;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HarryAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HarryInfo = styled.div`
  flex: 1;
`;

const HarryName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const HarryStatus = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div<{ isFromHarry: boolean }>`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: ${props => props.isFromHarry ? '#f7fafc' : '#667eea'};
  color: ${props => props.isFromHarry ? '#2d3748' : 'white'};
  align-self: ${props => props.isFromHarry ? 'flex-start' : 'flex-end'};
  border: ${props => props.isFromHarry ? '1px solid #e2e8f0' : 'none'};
  animation: ${slideIn} 0.3s ease;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-style: italic;
  padding: 0.5rem 1rem;
`;

const SuggestionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SuggestionButton = styled.button`
  background: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

interface HarryAIProps {
  currentScenario?: string;
  userAction?: string;
}

const HarryAI: React.FC<HarryAIProps> = ({ currentScenario, userAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm Harry, your AI risk management mentor. I'm here to guide you through complex risk scenarios and help you develop your decision-making skills. Ready to tackle some challenges?",
      isFromHarry: true,
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    "What should I look for first?",
    "Explain this risk category",
    "Help me prioritize",
    "What would happen if...?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    const userMessage = {
      id: Date.now().toString(),
      text: suggestion,
      isFromHarry: false,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const harryResponse = getHarryResponse(suggestion);
      const harryMessage = {
        id: (Date.now() + 1).toString(),
        text: harryResponse,
        isFromHarry: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, harryMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getHarryResponse = (userInput: string): string => {
    const responses = {
      "What should I look for first?": "Great question! Start by examining the probability and impact matrix. Look for high-impact, high-probability risks first. Also, consider any interconnected risks that might create cascading effects.",
      "Explain this risk category": "Risk categories help us organize and understand different types of threats. Financial risks affect your bottom line, operational risks disrupt processes, strategic risks threaten long-term goals, and compliance risks involve regulatory issues.",
      "Help me prioritize": "Use the AXiLe framework! Consider the Natural Pattern Language - has this type of risk occurred before in similar contexts? Also evaluate: 1) Immediacy of impact 2) Available resources 3) Stakeholder concerns",
      "What would happen if...?": "Excellent forward-thinking! Let's use scenario analysis. Consider both direct and indirect consequences. What systems would be affected? How would stakeholders react? What recovery options would be available?"
    };
    
    return responses[userInput as keyof typeof responses] || "That's an interesting point. Let me help you think through this systematically. What specific aspect would you like to explore further?";
  };

  useEffect(() => {
    if (userAction) {
      const contextualResponse = `I noticed you ${userAction}. ${getContextualAdvice(userAction)}`;
      const harryMessage = {
        id: Date.now().toString(),
        text: contextualResponse,
        isFromHarry: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, harryMessage]);
    }
  }, [userAction]);

  const getContextualAdvice = (action: string): string => {
    if (action.includes('identified')) {
      return "Great observation! Now consider: What evidence supports this assessment? What are the potential cascading effects?";
    }
    if (action.includes('mitigation')) {
      return "Good mitigation thinking! Make sure your strategy addresses root causes and includes measurable success criteria.";
    }
    return "Keep thinking systematically about the interconnections between risks and objectives.";
  };

  return (
    <HarryContainer isExpanded={isExpanded}>
      <HarryButton onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <MessageCircle size={24} /> : <Brain size={24} />}
      </HarryButton>
      
      <HarryChat isExpanded={isExpanded}>
        <ChatHeader>
          <HarryAvatar>
            <Brain size={20} />
          </HarryAvatar>
          <HarryInfo>
            <HarryName>Harry AI</HarryName>
            <HarryStatus>Risk Management Mentor</HarryStatus>
          </HarryInfo>
          <Lightbulb size={18} />
        </ChatHeader>
        
        <ChatMessages>
          {messages.map(message => (
            <Message key={message.id} isFromHarry={message.isFromHarry}>
              {message.text}
            </Message>
          ))}
          
          {isTyping && (
            <TypingIndicator>
              <Brain size={16} />
              Harry is thinking...
            </TypingIndicator>
          )}
          
          {messages.length <= 1 && (
            <SuggestionButtons>
              {suggestions.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </SuggestionButton>
              ))}
            </SuggestionButtons>
          )}
        </ChatMessages>
      </HarryChat>
    </HarryContainer>
  );
};

export default HarryAI;