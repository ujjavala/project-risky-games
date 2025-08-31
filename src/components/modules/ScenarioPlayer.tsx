import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Star,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { GameScenario } from '../../types/axile';

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ScenarioContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ScenarioHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ScenarioTitle = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2rem;
`;

const ScenarioMeta = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const GameInterface = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const StatusTitle = styled.h3`
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #48bb78, #38a169);
    transition: width 0.3s ease;
  }
`;

const EventCard = styled.div`
  background: #fffaf0;
  border: 2px solid #feb2b2;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${slideInFromRight} 0.5s ease;
`;

const EventTitle = styled.h3`
  color: #c53030;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChoiceButton = styled.button<{ isSelected: boolean }>`
  background: ${props => props.isSelected ? '#667eea' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.isSelected ? '#667eea' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    ${props => !props.isSelected && 'background: #f7fafc;'}
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ChoiceDetails = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'success': return '#48bb78';
      case 'danger': return '#e53e3e';
      default: return '#667eea';
    }
  }};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ScoreDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #48bb78;
  text-align: center;
`;

const RiskIndicator = styled.div<{ level: 'low' | 'medium' | 'high' | 'critical' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.level) {
      case 'low': return '#c6f6d5';
      case 'medium': return '#fef5e7';
      case 'high': return '#fed7d7';
      case 'critical': return '#feb2b2';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'low': return '#276749';
      case 'medium': return '#b7791f';
      case 'high': return '#c53030';
      case 'critical': return '#9b2c2c';
      default: return '#4a5568';
    }
  }};
`;

interface ScenarioPlayerProps {
  scenario: GameScenario;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({ scenario, onComplete, onExit }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentEvent = scenario.events[currentEventIndex];
  const progress = ((currentEventIndex + 1) / scenario.events.length) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };

  const handleChoiceConfirm = () => {
    if (!selectedChoice || !currentEvent) return;

    const choice = currentEvent.choices.find(c => c.id === selectedChoice);
    if (!choice) return;

    let newScore = score;
    choice.consequences.forEach(consequence => {
      if (consequence.type === 'risk_decrease') {
        newScore += 50;
      } else if (consequence.type === 'risk_increase') {
        newScore -= 25;
      } else if (consequence.type === 'objective_change') {
        newScore += consequence.magnitude > 0 ? 75 : -30;
      }
    });

    setScore(newScore);
    setSelectedChoice(null);

    if (currentEventIndex < scenario.events.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    } else {
      checkWinConditions(newScore);
    }
  };

  const checkWinConditions = (finalScore: number) => {
    const hasWon = finalScore > 200 && timeElapsed < scenario.estimatedDuration * 60;
    setGameState(hasWon ? 'completed' : 'failed');
    
    if (hasWon) {
      onComplete(finalScore);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'completed') {
    return (
      <ScenarioContainer>
        <StatusCard>
          <StatusTitle>
            <CheckCircle color="#48bb78" />
            Scenario Completed Successfully!
          </StatusTitle>
          <ScoreDisplay>{score} points</ScoreDisplay>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#4a5568' }}>
            You successfully navigated the risks and achieved the objectives!
          </p>
          <ActionButton variant="success" onClick={onExit} style={{ width: '100%', marginTop: '1rem' }}>
            <Star size={18} />
            Continue to Dashboard
          </ActionButton>
        </StatusCard>
      </ScenarioContainer>
    );
  }

  if (gameState === 'failed') {
    return (
      <ScenarioContainer>
        <StatusCard>
          <StatusTitle>
            <XCircle color="#e53e3e" />
            Scenario Incomplete
          </StatusTitle>
          <p style={{ textAlign: 'center', color: '#4a5568', margin: '1rem 0' }}>
            Don't worry! Risk management is about learning from challenges. Try again with a different approach.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ActionButton onClick={() => window.location.reload()} style={{ flex: 1 }}>
              Try Again
            </ActionButton>
            <ActionButton variant="danger" onClick={onExit} style={{ flex: 1 }}>
              Exit Scenario
            </ActionButton>
          </div>
        </StatusCard>
      </ScenarioContainer>
    );
  }

  return (
    <ScenarioContainer>
      <ScenarioHeader>
        <BackButton onClick={onExit}>
          <ArrowLeft size={16} />
          Exit Scenario
        </BackButton>
        <ScenarioTitle>{scenario.title}</ScenarioTitle>
        <ScenarioMeta>
          <span>Event {currentEventIndex + 1} of {scenario.events.length}</span>
          <span>•</span>
          <span>Score: {score}</span>
          <span>•</span>
          <span>Time: {formatTime(timeElapsed)}</span>
        </ScenarioMeta>
      </ScenarioHeader>

      <GameInterface>
        <MainContent>
          {currentEvent && (
            <EventCard>
              <EventTitle>
                <AlertTriangle size={20} />
                Crisis Event
              </EventTitle>
              <EventDescription>
                {currentEvent.description}
              </EventDescription>

              <ChoicesContainer>
                {currentEvent.choices.map(choice => (
                  <ChoiceButton
                    key={choice.id}
                    isSelected={selectedChoice === choice.id}
                    onClick={() => handleChoiceSelect(choice.id)}
                  >
                    {choice.text}
                    <ChoiceDetails>
                      Cost: ${choice.cost.toLocaleString()}
                      {choice.requiredEvidence.length > 0 && (
                        <div>Required evidence: {choice.requiredEvidence.join(', ')}</div>
                      )}
                    </ChoiceDetails>
                  </ChoiceButton>
                ))}
              </ChoicesContainer>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <ActionButton
                  onClick={handleChoiceConfirm}
                  disabled={!selectedChoice}
                >
                  Confirm Decision
                </ActionButton>
                <ActionButton
                  onClick={() => setIsPaused(!isPaused)}
                  style={{ background: isPaused ? '#48bb78' : '#e53e3e' }}
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  {isPaused ? 'Resume' : 'Pause'}
                </ActionButton>
              </div>
            </EventCard>
          )}
        </MainContent>

        <Sidebar>
          <StatusCard>
            <StatusTitle>
              <TrendingUp size={16} />
              Progress
            </StatusTitle>
            <ProgressBar progress={progress} />
            <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
              {Math.round(progress)}% Complete
            </div>
          </StatusCard>

          <StatusCard>
            <StatusTitle>
              <Clock size={16} />
              Current Score
            </StatusTitle>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', textAlign: 'center' }}>
              {score}
            </div>
          </StatusCard>

          <StatusCard>
            <StatusTitle>
              <AlertTriangle size={16} />
              Risk Level
            </StatusTitle>
            <div style={{ textAlign: 'center' }}>
              <RiskIndicator level={score > 300 ? 'low' : score > 150 ? 'medium' : score > 50 ? 'high' : 'critical'}>
                {score > 300 ? 'Low Risk' : score > 150 ? 'Medium Risk' : score > 50 ? 'High Risk' : 'Critical Risk'}
              </RiskIndicator>
            </div>
          </StatusCard>
        </Sidebar>
      </GameInterface>
    </ScenarioContainer>
  );
};

export default ScenarioPlayer;