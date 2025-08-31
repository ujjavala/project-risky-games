import React from 'react';
import styled from 'styled-components';
import { Play, Clock, BarChart, Users } from 'lucide-react';
import { GameScenario } from '../../types/axile';

const ScenariosContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ScenariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ScenarioCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const ScenarioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.difficulty) {
      case 'beginner': return '#e6f7e6';
      case 'intermediate': return '#fff3cd';
      case 'advanced': return '#f8d7da';
      case 'expert': return '#d4edda';
      default: return '#e1e5e9';
    }
  }};
  color: ${props => {
    switch (props.difficulty) {
      case 'beginner': return '#28a745';
      case 'intermediate': return '#ffc107';
      case 'advanced': return '#dc3545';
      case 'expert': return '#6f42c1';
      default: return '#6c757d';
    }
  }};
`;

const ScenarioTitle = styled.h3`
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const ScenarioDescription = styled.p`
  color: #718096;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ScenarioMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
`;

const PlayButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const PageTitle = styled.h1`
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

interface ScenariosListProps {
  scenarios: GameScenario[];
  onScenarioSelect: (scenarioId: string) => void;
}

const ScenariosList: React.FC<ScenariosListProps> = ({ scenarios, onScenarioSelect }) => {
  return (
    <ScenariosContainer>
      <PageTitle>Risk Management Scenarios</PageTitle>
      <PageSubtitle>
        Interactive simulations designed to enhance your risk assessment and mitigation skills
      </PageSubtitle>
      
      <ScenariosGrid>
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id}>
            <ScenarioHeader>
              <div>
                <ScenarioTitle>{scenario.title}</ScenarioTitle>
                <DifficultyBadge difficulty={scenario.difficulty}>
                  {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                </DifficultyBadge>
              </div>
            </ScenarioHeader>
            
            <ScenarioDescription>
              {scenario.description}
            </ScenarioDescription>
            
            <ScenarioMeta>
              <MetaItem>
                <Clock size={16} />
                <span>{scenario.estimatedDuration} min</span>
              </MetaItem>
              <MetaItem>
                <BarChart size={16} />
                <span>{scenario.category}</span>
              </MetaItem>
              <MetaItem>
                <Users size={16} />
                <span>{scenario.objectives.length} objectives</span>
              </MetaItem>
            </ScenarioMeta>
            
            <PlayButton onClick={() => onScenarioSelect(scenario.id)}>
              <Play size={18} />
              Start Scenario
            </PlayButton>
          </ScenarioCard>
        ))}
      </ScenariosGrid>
    </ScenariosContainer>
  );
};

export default ScenariosList;