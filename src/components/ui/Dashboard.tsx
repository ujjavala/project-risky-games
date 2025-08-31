import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Target, Award } from 'lucide-react';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.1rem;
`;

interface DashboardProps {
  userProgress: {
    totalScore: number;
    level: number;
    riskAssessmentSkill: number;
    completedScenarios: string[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress }) => {
  const skillData = [
    { name: 'Risk Assessment', value: userProgress.riskAssessmentSkill, color: '#8884d8' },
    { name: 'Mitigation Planning', value: 58, color: '#82ca9d' },
    { name: 'Decision Making', value: 72, color: '#ffc658' },
    { name: 'Crisis Management', value: 43, color: '#ff7300' }
  ];

  const progressData = [
    { week: 'Week 1', scenarios: 2, score: 450 },
    { week: 'Week 2', scenarios: 4, score: 780 },
    { week: 'Week 3', scenarios: 3, score: 620 },
    { week: 'Week 4', scenarios: 5, score: 920 }
  ];

  const riskCategories = [
    { name: 'Financial', value: 35, color: '#8884d8' },
    { name: 'Operational', value: 28, color: '#82ca9d' },
    { name: 'Strategic', value: 22, color: '#ffc658' },
    { name: 'Compliance', value: 15, color: '#ff7300' }
  ];

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon color="#667eea">
              <TrendingUp size={20} />
            </StatIcon>
            <StatLabel>Total Score</StatLabel>
          </StatHeader>
          <StatValue>{userProgress.totalScore.toLocaleString()}</StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#f093fb">
              <Target size={20} />
            </StatIcon>
            <StatLabel>Current Level</StatLabel>
          </StatHeader>
          <StatValue>{userProgress.level}</StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#4facfe">
              <Award size={20} />
            </StatIcon>
            <StatLabel>Scenarios Completed</StatLabel>
          </StatHeader>
          <StatValue>{userProgress.completedScenarios.length}</StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#43e97b">
              <AlertTriangle size={20} />
            </StatIcon>
            <StatLabel>Risk Assessment Skill</StatLabel>
          </StatHeader>
          <StatValue>{userProgress.riskAssessmentSkill}%</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Weekly Progress</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scenarios" fill="#8884d8" />
              <Bar dataKey="score" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Risk Categories Mastered</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskCategories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {riskCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;