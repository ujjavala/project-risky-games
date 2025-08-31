import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { TrendingUp, Users, Trophy, Target, Calendar, BarChart3, Zap, Medal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const progressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress); }
`;

const rankUpAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const ProgressContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.isActive ? '#667eea' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#4a5568'};
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.isActive ? '600' : '400'};

  &:hover {
    background: ${props => props.isActive ? '#667eea' : '#f7fafc'};
  }
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillRadar = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
`;

const LevelProgressCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const LevelNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  animation: ${rankUpAnimation} 0.5s ease;
`;

const XPBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const XPProgress = styled.div<{ progress: number }>`
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  transition: width 0.6s ease;
  width: ${props => props.progress}%;
`;

const LeaderboardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
`;

const LeaderboardEntry = styled.div<{ isCurrentUser?: boolean; rank: number }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: ${props => props.isCurrentUser ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    props.rank <= 3 ? '#f7fafc' : 'transparent'};
  color: ${props => props.isCurrentUser ? 'white' : '#4a5568'};
  border: ${props => props.rank <= 3 ? '2px solid #e2e8f0' : 'none'};
  position: relative;

  &::before {
    content: '${props => props.rank}';
    position: absolute;
    left: -0.5rem;
    top: -0.5rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => {
      if (props.rank === 1) return '#ffd700';
      if (props.rank === 2) return '#c0c0c0';
      if (props.rank === 3) return '#cd7f32';
      return '#718096';
    }};
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Avatar = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div<{ trend?: 'up' | 'down' | 'stable' }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => {
    switch (props.trend) {
      case 'up': return '#38a169';
      case 'down': return '#e53e3e';
      default: return '#667eea';
    }
  }};
  margin-bottom: 0.5rem;
`;

const MilestoneTracker = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  overflow-x: auto;
  padding: 1rem 0;
`;

const Milestone = styled.div<{ isCompleted: boolean; isCurrent: boolean }>`
  min-width: 120px;
  padding: 1rem;
  border-radius: 12px;
  background: ${props => {
    if (props.isCompleted) return 'linear-gradient(135deg, #48bb78 0%, #68d391 100%)';
    if (props.isCurrent) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    return '#f7fafc';
  }};
  color: ${props => (props.isCompleted || props.isCurrent) ? 'white' : '#4a5568'};
  text-align: center;
  position: relative;
  border: 2px solid ${props => props.isCurrent ? '#667eea' : 'transparent'};

  &::after {
    content: '';
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid ${props => 
      props.isCompleted ? '#48bb78' : props.isCurrent ? '#667eea' : '#e2e8f0'};
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
`;

interface ProgressData {
  week: string;
  score: number;
  scenarios: number;
  decisions: number;
}

interface LeaderboardUser {
  id: string;
  name: string;
  level: number;
  score: number;
  avatar: string;
  streak: number;
  badges: number;
}

const mockProgressData: ProgressData[] = [
  { week: 'Week 1', score: 450, scenarios: 2, decisions: 8 },
  { week: 'Week 2', score: 780, scenarios: 4, decisions: 15 },
  { week: 'Week 3', score: 920, scenarios: 3, decisions: 12 },
  { week: 'Week 4', score: 1250, scenarios: 5, decisions: 22 },
  { week: 'Week 5', score: 1580, scenarios: 4, decisions: 18 },
  { week: 'Week 6', score: 1890, scenarios: 6, decisions: 28 }
];

const mockLeaderboard: LeaderboardUser[] = [
  { id: '1', name: 'Sarah Chen', level: 12, score: 15420, avatar: '#667eea', streak: 15, badges: 23 },
  { id: '2', name: 'Marcus Rodriguez', level: 11, score: 14230, avatar: '#48bb78', streak: 8, badges: 19 },
  { id: '3', name: 'Alex Kumar', level: 10, score: 13150, avatar: '#ed8936', streak: 12, badges: 18 },
  { id: 'current', name: 'You', level: 3, score: 1250, avatar: '#9f7aea', streak: 4, badges: 7 },
  { id: '5', name: 'Jennifer Liu', level: 8, score: 11850, avatar: '#38b2ac', streak: 6, badges: 15 },
  { id: '6', name: 'David Park', level: 7, score: 9420, avatar: '#d53f8c', streak: 3, badges: 12 }
];

const skillData = [
  { skill: 'Risk Assessment', current: 85, target: 100 },
  { skill: 'Decision Making', current: 72, target: 100 },
  { skill: 'Crisis Management', current: 68, target: 100 },
  { skill: 'Pattern Recognition', current: 91, target: 100 },
  { skill: 'Evidence Analysis', current: 78, target: 100 },
  { skill: 'Team Leadership', current: 45, target: 100 }
];

const milestones = [
  { title: 'Novice', target: 500, icon: <Target size={20} />, completed: true },
  { title: 'Apprentice', target: 1000, icon: <TrendingUp size={20} />, completed: true },
  { title: 'Practitioner', target: 2500, icon: <Medal size={20} />, completed: false },
  { title: 'Expert', target: 5000, icon: <Trophy size={20} />, completed: false },
  { title: 'Master', target: 10000, icon: <Zap size={20} />, completed: false }
];

const ProgressTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'progress' | 'leaderboard' | 'skills'>('progress');
  const [currentXP, setCurrentXP] = useState(1250);
  const [currentLevel, setCurrentLevel] = useState(3);

  const nextLevelXP = currentLevel * 1000;
  const levelProgress = ((currentXP % 1000) / 1000) * 100;
  const currentMilestone = milestones.findIndex(m => currentXP < m.target);

  useEffect(() => {
    // Simulate real-time progress updates
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance each second
        setCurrentXP(prev => prev + Math.floor(Math.random() * 10) + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'progress' as const, label: 'Progress', icon: <BarChart3 size={16} /> },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: <Users size={16} /> },
    { id: 'skills' as const, label: 'Skills', icon: <Target size={16} /> }
  ];

  return (
    <ProgressContainer>
      <h2>Progress Tracking & Leaderboard</h2>
      <p>Monitor your learning journey and compete with peers</p>

      <TabNavigation>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </Tab>
        ))}
      </TabNavigation>

      {activeTab === 'progress' && (
        <>
          <ProgressGrid>
            <div>
              <h3>Learning Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={3} />
                  <Line type="monotone" dataKey="scenarios" stroke="#48bb78" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <LevelProgressCard>
              <div style={{ textAlign: 'center' }}>
                <h4>Current Level</h4>
                <LevelNumber>{currentLevel}</LevelNumber>
                <div>Level Progress</div>
                <XPBar>
                  <XPProgress progress={levelProgress} />
                </XPBar>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {currentXP % 1000} / 1000 XP to Level {currentLevel + 1}
                </div>
              </div>
            </LevelProgressCard>
          </ProgressGrid>

          <MilestoneTracker>
            {milestones.map((milestone, index) => (
              <Milestone
                key={index}
                isCompleted={milestone.completed}
                isCurrent={index === currentMilestone}
              >
                {milestone.icon}
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {milestone.title}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {milestone.target.toLocaleString()} XP
                </div>
              </Milestone>
            ))}
          </MilestoneTracker>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <StatCard>
              <StatValue trend="up">42</StatValue>
              <div>Scenarios Completed</div>
            </StatCard>
            <StatCard>
              <StatValue trend="up">156</StatValue>
              <div>Decisions Made</div>
            </StatCard>
            <StatCard>
              <StatValue trend="up">89%</StatValue>
              <div>Success Rate</div>
            </StatCard>
            <StatCard>
              <StatValue trend="stable">4</StatValue>
              <div>Day Streak</div>
            </StatCard>
          </div>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <LeaderboardContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Global Leaderboard</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#718096' }}>
              <span><Calendar size={14} style={{ marginRight: '0.25rem' }} />This Week</span>
            </div>
          </div>

          {mockLeaderboard
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
              <LeaderboardEntry
                key={user.id}
                rank={index + 1}
                isCurrentUser={user.id === 'current'}
              >
                <Avatar color={user.avatar}>
                  {user.name.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    Level {user.level} • {user.streak} day streak • {user.badges} badges
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {user.score.toLocaleString()}
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>points</div>
                </div>
              </LeaderboardEntry>
            ))}

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <h4>Weekly Challenges</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
                <Trophy size={20} color="#ffd700" />
                <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Speed Challenge</div>
                <div style={{ fontSize: '0.8rem', color: '#718096' }}>Complete 3 scenarios in 30 min</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Reward: +500 XP</div>
              </div>
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
                <Target size={20} color="#667eea" />
                <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Perfect Score</div>
                <div style={{ fontSize: '0.8rem', color: '#718096' }}>Achieve 100% on any scenario</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Reward: +750 XP</div>
              </div>
            </div>
          </div>
        </LeaderboardContainer>
      )}

      {activeTab === 'skills' && (
        <SkillRadar>
          <h3>Skill Development Radar</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#667eea"
                fill="#667eea"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#e2e8f0"
                fill="transparent"
                strokeDasharray="5 5"
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          
          <div style={{ marginTop: '2rem' }}>
            <h4>Skill Recommendations</h4>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>Focus Area: Team Leadership</strong>
                <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                  Complete collaborative scenarios to improve your leadership skills. Current: 45/100
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>Strength: Pattern Recognition</strong>
                <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                  Excellent pattern identification skills! Use this to mentor others. Current: 91/100
                </p>
              </div>
            </div>
          </div>
        </SkillRadar>
      )}
    </ProgressContainer>
  );
};

export default ProgressTracker;