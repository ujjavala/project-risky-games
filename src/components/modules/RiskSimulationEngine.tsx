import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertTriangle, TrendingDown, TrendingUp, Clock, DollarSign, Shield, Globe, Users } from 'lucide-react';
import { Risk, GameScenario, ScenarioEvent } from '../../types/axile';

const pulseAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`;

const SimulationContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const SimulationHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
`;

const RiskTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const RiskTypeCard = styled.button<{ isActive: boolean; riskLevel: string }>`
  background: ${props => props.isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.isActive ? 'white' : '#4a5568'};
  border: 2px solid ${props => {
    if (props.isActive) return 'transparent';
    switch (props.riskLevel) {
      case 'critical': return '#e53e3e';
      case 'high': return '#dd6b20';
      case 'medium': return '#d69e2e';
      case 'low': return '#38a169';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${props => props.riskLevel === 'critical' ? pulseAnimation : 'none'} 2s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const RiskIcon = styled.div<{ riskLevel: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => {
    switch (props.riskLevel) {
      case 'critical': return '#fed7d7';
      case 'high': return '#feebc8';
      case 'medium': return '#faf089';
      case 'low': return '#c6f6d5';
      default: return '#e2e8f0';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
`;

const SimulationPanel = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MetricValue = styled.div<{ isNegative?: boolean }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.isNegative ? '#e53e3e' : '#38a169'};
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const ScenarioTimeline = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const TimelineEvent = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-left: 4px solid ${props => props.isActive ? '#667eea' : '#e2e8f0'};
  margin-bottom: 1rem;
  background: ${props => props.isActive ? '#f0f4ff' : 'transparent'};
  border-radius: 0 8px 8px 0;
`;

const DecisionMatrix = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const DecisionCard = styled.button<{ impact: 'positive' | 'negative' | 'neutral' }>`
  background: white;
  border: 2px solid ${props => {
    switch (props.impact) {
      case 'positive': return '#38a169';
      case 'negative': return '#e53e3e';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

interface RiskSimulation {
  type: 'financial' | 'operational' | 'technological' | 'environmental' | 'cultural' | 'political';
  title: string;
  description: string;
  icon: React.ReactNode;
  probability: number;
  impact: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  scenarios: GameScenario[];
  metrics: {
    label: string;
    value: string;
    change: number;
  }[];
}

const riskSimulations: RiskSimulation[] = [
  {
    type: 'financial',
    title: 'Financial Risk Simulation',
    description: 'Market volatility, currency fluctuations, and liquidity crises',
    icon: <DollarSign size={24} />,
    probability: 0.7,
    impact: 0.8,
    riskLevel: 'high',
    scenarios: [],
    metrics: [
      { label: 'Revenue Impact', value: '$2.5M', change: -15 },
      { label: 'Cash Flow', value: '30 days', change: -50 },
      { label: 'Market Value', value: '$45M', change: -12 }
    ]
  },
  {
    type: 'operational',
    title: 'Operational Risk Simulation',
    description: 'Supply chain disruptions, system failures, and process breakdowns',
    icon: <Shield size={24} />,
    probability: 0.6,
    impact: 0.7,
    riskLevel: 'medium',
    scenarios: [],
    metrics: [
      { label: 'Downtime', value: '4.2 hrs', change: 180 },
      { label: 'Productivity', value: '67%', change: -33 },
      { label: 'Recovery Time', value: '2 days', change: 100 }
    ]
  },
  {
    type: 'technological',
    title: 'Technology Risk Simulation',
    description: 'Cybersecurity breaches, system obsolescence, and AI disruption',
    icon: <Globe size={24} />,
    probability: 0.8,
    impact: 0.9,
    riskLevel: 'critical',
    scenarios: [],
    metrics: [
      { label: 'Security Score', value: '72%', change: -28 },
      { label: 'Data at Risk', value: '125K records', change: 250 },
      { label: 'Recovery Cost', value: '$890K', change: 340 }
    ]
  },
  {
    type: 'environmental',
    title: 'Environmental Risk Simulation',
    description: 'Climate change impacts, natural disasters, and sustainability challenges',
    icon: <Globe size={24} />,
    probability: 0.5,
    impact: 0.8,
    riskLevel: 'medium',
    scenarios: [],
    metrics: [
      { label: 'Carbon Footprint', value: '450 tons', change: 25 },
      { label: 'Compliance Score', value: '83%', change: -17 },
      { label: 'Adaptation Cost', value: '$1.2M', change: 60 }
    ]
  },
  {
    type: 'cultural',
    title: 'Cultural Risk Simulation',
    description: 'Workplace culture shifts, diversity challenges, and team dynamics',
    icon: <Users size={24} />,
    probability: 0.4,
    impact: 0.6,
    riskLevel: 'medium',
    scenarios: [],
    metrics: [
      { label: 'Employee Satisfaction', value: '68%', change: -22 },
      { label: 'Turnover Rate', value: '18%', change: 80 },
      { label: 'Culture Score', value: '7.2/10', change: -15 }
    ]
  },
  {
    type: 'political',
    title: 'Political Risk Simulation',
    description: 'Regulatory changes, trade policies, and geopolitical tensions',
    icon: <Globe size={24} />,
    probability: 0.6,
    impact: 0.7,
    riskLevel: 'high',
    scenarios: [],
    metrics: [
      { label: 'Regulatory Burden', value: '$340K', change: 125 },
      { label: 'Market Access', value: '78%', change: -35 },
      { label: 'Compliance Days', value: '45 days', change: 200 }
    ]
  }
];

interface RiskSimulationEngineProps {
  onRiskSelected: (risk: RiskSimulation) => void;
  onDecisionMade: (decision: any) => void;
}

const RiskSimulationEngine: React.FC<RiskSimulationEngineProps> = ({ onRiskSelected, onDecisionMade }) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskSimulation | null>(null);
  const [simulationPhase, setSimulationPhase] = useState<'selection' | 'analysis' | 'decision'>('selection');
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [impactMetrics, setImpactMetrics] = useState<any>({});

  useEffect(() => {
    if (selectedRisk && simulationPhase === 'analysis') {
      const interval = setInterval(() => {
        setTimelineProgress(prev => {
          if (prev >= 100) {
            setSimulationPhase('decision');
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [selectedRisk, simulationPhase]);

  const handleRiskSelection = (risk: RiskSimulation) => {
    setSelectedRisk(risk);
    setSimulationPhase('analysis');
    setTimelineProgress(0);
    onRiskSelected(risk);
  };

  const handleDecision = (decision: any) => {
    onDecisionMade(decision);
    setSimulationPhase('selection');
    setSelectedRisk(null);
  };

  if (simulationPhase === 'selection') {
    return (
      <SimulationContainer>
        <SimulationHeader>
          <h2>Interactive Risk Simulation Engine</h2>
          <p>Select a risk domain to begin simulation analysis</p>
        </SimulationHeader>

        <RiskTypeSelector>
          {riskSimulations.map((risk) => (
            <RiskTypeCard
              key={risk.type}
              isActive={false}
              riskLevel={risk.riskLevel}
              onClick={() => handleRiskSelection(risk)}
            >
              <RiskIcon riskLevel={risk.riskLevel}>
                {risk.icon}
              </RiskIcon>
              <h3>{risk.title}</h3>
              <p>{risk.description}</p>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Probability: {(risk.probability * 100).toFixed(0)}%</span>
                <span>Impact: {(risk.impact * 100).toFixed(0)}%</span>
              </div>
            </RiskTypeCard>
          ))}
        </RiskTypeSelector>
      </SimulationContainer>
    );
  }

  if (simulationPhase === 'analysis' && selectedRisk) {
    return (
      <SimulationContainer>
        <SimulationHeader>
          <h2>{selectedRisk.title}</h2>
          <div>Progress: {timelineProgress}%</div>
        </SimulationHeader>

        <SimulationPanel>
          <h3>Real-Time Impact Analysis</h3>
          <MetricsGrid>
            {selectedRisk.metrics.map((metric, index) => (
              <MetricCard key={index}>
                <MetricValue isNegative={metric.change < 0}>
                  {metric.value}
                </MetricValue>
                <MetricLabel>{metric.label}</MetricLabel>
                <div style={{ 
                  color: metric.change < 0 ? '#e53e3e' : '#38a169',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem'
                }}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </MetricCard>
            ))}
          </MetricsGrid>

          <ScenarioTimeline>
            <h4>Simulation Timeline</h4>
            <TimelineEvent isActive={timelineProgress > 20}>
              <Clock size={16} style={{ marginRight: '1rem' }} />
              <div>
                <strong>T+0:</strong> Risk event initiated - {selectedRisk.description}
              </div>
            </TimelineEvent>
            <TimelineEvent isActive={timelineProgress > 40}>
              <TrendingDown size={16} style={{ marginRight: '1rem', color: '#e53e3e' }} />
              <div>
                <strong>T+1:</strong> Initial impact detected across affected systems
              </div>
            </TimelineEvent>
            <TimelineEvent isActive={timelineProgress > 60}>
              <AlertTriangle size={16} style={{ marginRight: '1rem', color: '#dd6b20' }} />
              <div>
                <strong>T+2:</strong> Secondary effects beginning to cascade
              </div>
            </TimelineEvent>
            <TimelineEvent isActive={timelineProgress > 80}>
              <TrendingUp size={16} style={{ marginRight: '1rem', color: '#38a169' }} />
              <div>
                <strong>T+3:</strong> Mitigation opportunities identified
              </div>
            </TimelineEvent>
          </ScenarioTimeline>
        </SimulationPanel>
      </SimulationContainer>
    );
  }

  if (simulationPhase === 'decision' && selectedRisk) {
    return (
      <SimulationContainer>
        <SimulationHeader>
          <h2>Decision Point: {selectedRisk.title}</h2>
          <p>Choose your response strategy</p>
        </SimulationHeader>

        <DecisionMatrix>
          <DecisionCard 
            impact="positive"
            onClick={() => handleDecision({ type: 'mitigate', impact: 'positive' })}
          >
            <h4>Immediate Mitigation</h4>
            <p>Deploy emergency response protocols and containment measures.</p>
            <div style={{ marginTop: '1rem', color: '#38a169' }}>
              ✓ Reduces immediate impact by 60%<br/>
              ✓ Prevents cascade effects<br/>
              ✗ High resource cost ($500K)
            </div>
          </DecisionCard>

          <DecisionCard 
            impact="neutral"
            onClick={() => handleDecision({ type: 'monitor', impact: 'neutral' })}
          >
            <h4>Monitor & Assess</h4>
            <p>Continue monitoring while gathering more information.</p>
            <div style={{ marginTop: '1rem', color: '#718096' }}>
              ✓ Low immediate cost<br/>
              ✓ Preserves options<br/>
              ✗ Risk may escalate
            </div>
          </DecisionCard>

          <DecisionCard 
            impact="negative"
            onClick={() => handleDecision({ type: 'accept', impact: 'negative' })}
          >
            <h4>Accept Risk</h4>
            <p>Accept the risk and focus resources elsewhere.</p>
            <div style={{ marginTop: '1rem', color: '#e53e3e' }}>
              ✓ No immediate resource drain<br/>
              ✗ Full impact realization<br/>
              ✗ Potential for escalation
            </div>
          </DecisionCard>
        </DecisionMatrix>
      </SimulationContainer>
    );
  }

  return null;
};

export default RiskSimulationEngine;