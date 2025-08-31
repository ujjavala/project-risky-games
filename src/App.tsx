import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/ui/Header';
import Dashboard from './components/ui/Dashboard';
import ScenariosList from './components/modules/ScenariosList';
import ScenarioPlayer from './components/modules/ScenarioPlayer';
import RiskSimulationEngine from './components/modules/RiskSimulationEngine';
import PremortemiSimulation from './components/modules/PremortemiSimulation';
import AchievementSystem from './components/gamification/AchievementSystem';
import ProgressTracker from './components/gamification/ProgressTracker';
import CrossDomainRiskMap from './components/visualization/CrossDomainRiskMap';
import AdvancedAnalytics from './components/analytics/AdvancedAnalytics';
import AdvancedAIChat from './components/ai/AdvancedAIChat';
import { AXiLEProvider } from './hooks/useAXiLe';
import { mockGameScenarios, mockUserProgress } from './data/mock/axileMockData';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f7fafc;
    color: #2d3748;
  }

  html {
    scroll-behavior: smooth;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  background: #f7fafc;
`;

function AppContent() {
  const [userProgress, setUserProgress] = useState(mockUserProgress);
  const [userAction, setUserAction] = useState<string>('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setUserAction(`selected scenario ${scenarioId}`);
  };

  const handleScenarioComplete = (score: number) => {
    setUserProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      level: Math.floor((prev.totalScore + score) / 1000) + 1,
      experiencePoints: prev.experiencePoints + score,
      completedScenarios: selectedScenarioId && !prev.completedScenarios.includes(selectedScenarioId)
        ? [...prev.completedScenarios, selectedScenarioId]
        : prev.completedScenarios
    }));
    setSelectedScenarioId(null);
    setUserAction(`completed scenario with score ${score}`);
  };

  const handleScenarioExit = () => {
    setSelectedScenarioId(null);
    setUserAction('exited scenario');
  };

  const selectedScenario = selectedScenarioId 
    ? mockGameScenarios.find(s => s.id === selectedScenarioId) 
    : null;

  return (
    <AppContainer>
      <Header 
        userLevel={userProgress.level} 
        userScore={userProgress.totalScore} 
      />
      
      <MainContent>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard userProgress={userProgress} />} 
          />
          <Route 
            path="/scenarios" 
            element={
              selectedScenario ? (
                <ScenarioPlayer 
                  scenario={selectedScenario}
                  onComplete={handleScenarioComplete}
                  onExit={handleScenarioExit}
                />
              ) : (
                <ScenariosList 
                  scenarios={mockGameScenarios}
                  onScenarioSelect={handleScenarioSelect}
                />
              )
            } 
          />
          <Route 
            path="/simulations" 
            element={
              <div>
                <RiskSimulationEngine 
                  onRiskSelected={(risk) => setUserAction(`selected risk simulation: ${risk.title}`)}
                  onDecisionMade={(decision) => setUserAction(`made decision: ${decision.type}`)}
                />
                <PremortemiSimulation />
              </div>
            } 
          />
          <Route 
            path="/achievements" 
            element={
              <div>
                <AchievementSystem />
                <ProgressTracker />
              </div>
            } 
          />
          <Route 
            path="/visualization" 
            element={<CrossDomainRiskMap />} 
          />
          <Route 
            path="/analytics" 
            element={<AdvancedAnalytics />} 
          />
        </Routes>
      </MainContent>
      
      <AdvancedAIChat />
    </AppContainer>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AXiLEProvider>
          <AppContent />
        </AXiLEProvider>
      </Router>
    </>
  );
}

export default App;
