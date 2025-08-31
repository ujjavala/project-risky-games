import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertTriangle, ArrowDown, ArrowRight, RotateCcw, Play, Pause, Clock, TrendingDown, X } from 'lucide-react';

const cascadeAnimation = keyframes`
  0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const failureAnimation = keyframes`
  0% { background: #f7fafc; }
  50% { background: #fed7d7; }
  100% { background: #f7fafc; }
`;

const PremortemiContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const ScenarioSetup = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FailureCascade = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const FailureNode = styled.div<{ 
  level: number; 
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}>`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-left: ${props => props.level * 2}rem;
  position: relative;
  animation: ${props => props.isActive ? cascadeAnimation : 'none'} 0.5s ease;
  border-left: 4px solid ${props => {
    switch (props.severity) {
      case 'critical': return '#e53e3e';
      case 'high': return '#dd6b20';
      case 'medium': return '#d69e2e';
      default: return '#38a169';
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 1rem;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${props => {
      switch (props.severity) {
        case 'critical': return '#e53e3e';
        case 'high': return '#dd6b20';
        case 'medium': return '#d69e2e';
        default: return '#38a169';
      }
    }};
    display: ${props => props.level > 0 ? 'block' : 'none'};
  }
`;

const DecisionTree = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const DecisionNode = styled.div<{ isSelected: boolean; outcome: 'success' | 'failure' | 'unknown' }>`
  background: ${props => {
    if (props.isSelected) {
      switch (props.outcome) {
        case 'success': return 'linear-gradient(135deg, #48bb78 0%, #68d391 100%)';
        case 'failure': return 'linear-gradient(135deg, #e53e3e 0%, #fc8181 100%)';
        default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    }
    return 'white';
  }};
  color: ${props => props.isSelected ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.isSelected ? 'transparent' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Timeline = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
`;

const TimelineStep = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    if (props.isCompleted) return '#48bb78';
    if (props.isActive) return '#667eea';
    return '#e2e8f0';
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -1.5rem;
    width: 2rem;
    height: 2px;
    background: ${props => props.isCompleted ? '#48bb78' : '#e2e8f0'};
    display: ${props => props.isActive ? 'none' : 'block'};
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const PlaybackControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button<{ variant?: 'danger' | 'success' | 'primary' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return '#e53e3e';
      case 'success': return '#48bb78';
      default: return '#667eea';
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ImpactMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div<{ trend: 'up' | 'down' | 'stable' }>`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: ${props => props.trend === 'down' ? failureAnimation : 'none'} 1s ease;
`;

const MetricValue = styled.div<{ isNegative: boolean }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.isNegative ? '#e53e3e' : '#48bb78'};
  margin-bottom: 0.5rem;
`;

interface FailureEvent {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  level: number;
  timestamp: number;
  triggers: string[];
  consequences: string[];
  preventable: boolean;
}

interface Decision {
  id: string;
  title: string;
  description: string;
  cost: number;
  effectiveness: number;
  outcome: 'success' | 'failure' | 'unknown';
  consequences: FailureEvent[];
}

const mockFailureScenario = {
  title: "Project Cascade Failure Analysis",
  description: "A critical system failure during peak business hours",
  initialTrigger: "Database server crashes during Black Friday sales",
  decisions: [
    {
      id: 'immediate_restart',
      title: 'Immediate System Restart',
      description: 'Restart all systems immediately to restore service quickly',
      cost: 50000,
      effectiveness: 30,
      outcome: 'failure' as const,
      consequences: [
        {
          id: 'data_corruption',
          title: 'Data Corruption Detected',
          description: 'Hasty restart causes data integrity issues',
          severity: 'high' as const,
          level: 1,
          timestamp: 5,
          triggers: ['immediate_restart'],
          consequences: ['customer_data_loss'],
          preventable: true
        }
      ]
    },
    {
      id: 'diagnostic_first',
      title: 'Run Diagnostics First',
      description: 'Perform thorough system diagnostics before any action',
      cost: 100000,
      effectiveness: 80,
      outcome: 'success' as const,
      consequences: []
    },
    {
      id: 'switch_backup',
      title: 'Switch to Backup Systems',
      description: 'Activate backup infrastructure while diagnosing main system',
      cost: 75000,
      effectiveness: 70,
      outcome: 'unknown' as const,
      consequences: [
        {
          id: 'backup_overload',
          title: 'Backup System Overload',
          description: 'Backup systems unable to handle full traffic load',
          severity: 'medium' as const,
          level: 1,
          timestamp: 10,
          triggers: ['switch_backup'],
          consequences: ['degraded_performance'],
          preventable: false
        }
      ]
    }
  ]
};

const cascadeEvents: FailureEvent[] = [
  {
    id: 'initial_failure',
    title: 'Database Server Crash',
    description: 'Primary database server fails during peak traffic',
    severity: 'critical',
    level: 0,
    timestamp: 0,
    triggers: [],
    consequences: ['service_unavailable'],
    preventable: false
  },
  {
    id: 'service_unavailable',
    title: 'Service Outage',
    description: 'Customer-facing services become unavailable',
    severity: 'critical',
    level: 1,
    timestamp: 2,
    triggers: ['initial_failure'],
    consequences: ['customer_complaints', 'revenue_loss'],
    preventable: true
  },
  {
    id: 'customer_complaints',
    title: 'Customer Complaints Surge',
    description: 'Support channels overwhelmed with complaints',
    severity: 'high',
    level: 2,
    timestamp: 15,
    triggers: ['service_unavailable'],
    consequences: ['reputation_damage'],
    preventable: true
  },
  {
    id: 'revenue_loss',
    title: 'Revenue Loss',
    description: 'Significant sales lost during outage period',
    severity: 'critical',
    level: 2,
    timestamp: 10,
    triggers: ['service_unavailable'],
    consequences: ['cash_flow_issues'],
    preventable: true
  },
  {
    id: 'reputation_damage',
    title: 'Brand Reputation Damage',
    description: 'Negative social media coverage and news reports',
    severity: 'high',
    level: 3,
    timestamp: 60,
    triggers: ['customer_complaints'],
    consequences: ['customer_churn'],
    preventable: true
  }
];

const PremortemiSimulation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [activeEvents, setActiveEvents] = useState<FailureEvent[]>([]);
  const [timeline, setTimeline] = useState(0);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    customers: 0,
    reputation: 0,
    recovery: 0
  });

  const steps = ['Setup', 'Decision Point', 'Cascade Analysis', 'Results'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep === 2) {
      interval = setInterval(() => {
        setTimeline(prev => {
          const newTime = prev + 5;
          
          // Add events that should trigger at this time
          const newEvents = cascadeEvents.filter(event => 
            event.timestamp <= newTime && 
            !activeEvents.find(ae => ae.id === event.id)
          );
          
          if (newEvents.length > 0) {
            setActiveEvents(prev => [...prev, ...newEvents]);
            updateMetrics(newEvents);
          }
          
          if (newTime >= 120) { // 2 minutes simulation
            setIsPlaying(false);
            setCurrentStep(3);
            return 120;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, activeEvents]);

  const updateMetrics = (events: FailureEvent[]) => {
    events.forEach(event => {
      setMetrics(prev => ({
        ...prev,
        revenue: prev.revenue - (event.severity === 'critical' ? 50000 : 
                                event.severity === 'high' ? 25000 : 
                                event.severity === 'medium' ? 10000 : 5000),
        customers: prev.customers - (event.severity === 'critical' ? 1000 : 
                                   event.severity === 'high' ? 500 : 
                                   event.severity === 'medium' ? 200 : 50),
        reputation: prev.reputation - (event.severity === 'critical' ? 20 : 
                                     event.severity === 'high' ? 15 : 
                                     event.severity === 'medium' ? 10 : 5),
        recovery: prev.recovery + (event.preventable ? 30 : 60)
      }));
    });
  };

  const handleDecisionSelect = (decision: Decision) => {
    setSelectedDecision(decision);
  };

  const startCascade = () => {
    setCurrentStep(2);
    setIsPlaying(true);
    setTimeline(0);
    setActiveEvents([cascadeEvents[0]]); // Start with initial failure
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSelectedDecision(null);
    setActiveEvents([]);
    setTimeline(0);
    setMetrics({ revenue: 0, customers: 0, reputation: 0, recovery: 0 });
  };

  return (
    <PremortemiContainer>
      <h2>Premortem "What If We Failed?" Simulation</h2>
      <p>Explore failure scenarios and their cascading effects through interactive decision trees</p>

      <Timeline>
        {steps.map((step, index) => (
          <TimelineStep
            key={index}
            isActive={currentStep === index}
            isCompleted={currentStep > index}
          >
            {index + 1}
          </TimelineStep>
        ))}
        <div style={{ marginLeft: '1rem', fontWeight: 'bold', color: '#4a5568' }}>
          {steps[currentStep]}
        </div>
      </Timeline>

      {currentStep === 0 && (
        <ScenarioSetup>
          <h3>{mockFailureScenario.title}</h3>
          <p>{mockFailureScenario.description}</p>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <strong>Initial Trigger:</strong> {mockFailureScenario.initialTrigger}
          </div>
          <ControlButton 
            onClick={() => setCurrentStep(1)} 
            style={{ marginTop: '2rem' }}
          >
            <ArrowRight size={16} />
            Begin Analysis
          </ControlButton>
        </ScenarioSetup>
      )}

      {currentStep === 1 && (
        <DecisionTree>
          <h3>Critical Decision Point</h3>
          <p>The system has failed. How do you respond? Each decision leads to different outcomes.</p>
          
          <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
            {mockFailureScenario.decisions.map(decision => (
              <DecisionNode
                key={decision.id}
                isSelected={selectedDecision?.id === decision.id}
                outcome={decision.outcome}
                onClick={() => handleDecisionSelect(decision)}
              >
                <h4>{decision.title}</h4>
                <p>{decision.description}</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Cost: ${decision.cost.toLocaleString()}</span>
                  <span>Success Rate: {decision.effectiveness}%</span>
                </div>
              </DecisionNode>
            ))}
          </div>

          <ControlPanel style={{ marginTop: '2rem' }}>
            <div>
              {selectedDecision && (
                <span>Selected: <strong>{selectedDecision.title}</strong></span>
              )}
            </div>
            <ControlButton 
              onClick={startCascade}
              disabled={!selectedDecision}
            >
              <Play size={16} />
              Run Simulation
            </ControlButton>
          </ControlPanel>
        </DecisionTree>
      )}

      {currentStep === 2 && (
        <>
          <ControlPanel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Clock size={16} />
              <span>Timeline: {Math.floor(timeline / 60)}:{(timeline % 60).toString().padStart(2, '0')}</span>
            </div>
            <PlaybackControls>
              <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play'}
              </ControlButton>
              <ControlButton onClick={resetSimulation} variant="danger">
                <RotateCcw size={16} />
                Reset
              </ControlButton>
            </PlaybackControls>
          </ControlPanel>

          <ImpactMetrics>
            <MetricCard trend={metrics.revenue < 0 ? 'down' : 'stable'}>
              <MetricValue isNegative={metrics.revenue < 0}>
                ${Math.abs(metrics.revenue).toLocaleString()}
              </MetricValue>
              <div>Revenue Impact</div>
            </MetricCard>
            <MetricCard trend={metrics.customers < 0 ? 'down' : 'stable'}>
              <MetricValue isNegative={metrics.customers < 0}>
                {Math.abs(metrics.customers).toLocaleString()}
              </MetricValue>
              <div>Customers Affected</div>
            </MetricCard>
            <MetricCard trend={metrics.reputation < 0 ? 'down' : 'stable'}>
              <MetricValue isNegative={metrics.reputation < 0}>
                {Math.abs(metrics.reputation)}%
              </MetricValue>
              <div>Reputation Score</div>
            </MetricCard>
            <MetricCard trend="up">
              <MetricValue isNegative={false}>
                {metrics.recovery} min
              </MetricValue>
              <div>Est. Recovery Time</div>
            </MetricCard>
          </ImpactMetrics>

          <FailureCascade>
            <h3>Failure Cascade Timeline</h3>
            {activeEvents.map((event, index) => (
              <FailureNode
                key={event.id}
                level={event.level}
                severity={event.severity}
                isActive={true}
              >
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>
                      T+{event.timestamp}min: {event.title}
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', color: '#4a5568' }}>{event.description}</p>
                    {event.preventable && (
                      <div style={{ 
                        padding: '0.5rem', 
                        background: '#fed7d7', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        color: '#9b2c2c'
                      }}>
                        ⚠️ This failure could have been prevented with different decisions
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    background: event.severity === 'critical' ? '#fed7d7' : 
                               event.severity === 'high' ? '#feebc8' : 
                               event.severity === 'medium' ? '#faf089' : '#c6f6d5',
                    color: event.severity === 'critical' ? '#9b2c2c' : 
                           event.severity === 'high' ? '#9c4221' : 
                           event.severity === 'medium' ? '#744210' : '#276749'
                  }}>
                    {event.severity}
                  </div>
                </div>
              </FailureNode>
            ))}
          </FailureCascade>
        </>
      )}

      {currentStep === 3 && (
        <div>
          <h3>Simulation Results</h3>
          <div style={{ 
            background: selectedDecision?.outcome === 'success' ? '#c6f6d5' : '#fed7d7',
            color: selectedDecision?.outcome === 'success' ? '#276749' : '#9b2c2c',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h2>Decision Outcome: {selectedDecision?.outcome === 'success' ? 'Success' : 'Failure'}</h2>
            <p>Your choice: "{selectedDecision?.title}" led to {selectedDecision?.outcome === 'success' ? 'successful resolution' : 'cascading failures'}</p>
          </div>

          <div style={{ background: '#f7fafc', padding: '2rem', borderRadius: '12px' }}>
            <h4>Key Lessons Learned:</h4>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li>Quick decisions often lead to unintended consequences</li>
              <li>Diagnostic approaches, while slower, prevent data corruption</li>
              <li>Backup systems need proper capacity planning</li>
              <li>Communication plans are critical during crisis management</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <ControlButton onClick={resetSimulation}>
              <RotateCcw size={16} />
              Try Again
            </ControlButton>
            <ControlButton onClick={() => setCurrentStep(1)} variant="success">
              <ArrowRight size={16} />
              Different Decision
            </ControlButton>
          </div>
        </div>
      )}
    </PremortemiContainer>
  );
};

export default PremortemiSimulation;