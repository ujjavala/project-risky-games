import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Trophy, Star, Award, Target, Zap, Shield, Brain, TrendingUp } from 'lucide-react';
import { useAXiLE } from '../../hooks/useAXiLe';

const celebrationAnimation = keyframes`
  0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const AchievementContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const AchievementCard = styled.div<{ isUnlocked: boolean; rarity: string }>`
  background: ${props => {
    if (!props.isUnlocked) return '#f7fafc';
    switch (props.rarity) {
      case 'legendary': return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
      case 'epic': return 'linear-gradient(135deg, #9f7aea 0%, #b794f6 100%)';
      case 'rare': return 'linear-gradient(135deg, #4299e1 0%, #63b3ed 100%)';
      default: return 'linear-gradient(135deg, #48bb78 0%, #68d391 100%)';
    }
  }};
  color: ${props => props.isUnlocked ? 'white' : '#a0aec0'};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${props => props.isUnlocked ? css`${celebrationAnimation} 0.6s ease` : 'none'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.isUnlocked ? 
      'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)' : 'none'};
    background-size: 20px 20px;
    animation: ${css`${sparkleAnimation} 2s ease-in-out infinite`};
    pointer-events: none;
  }
`;

const AchievementIcon = styled.div<{ rarity: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: ${props => {
    switch (props.rarity) {
      case 'legendary': return '2rem';
      case 'epic': return '1.8rem';
      case 'rare': return '1.6rem';
      default: return '1.5rem';
    }
  }};
`;

const AchievementTitle = styled.h3`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const AchievementDescription = styled.p`
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    transition: width 0.3s ease;
  }
`;

const RewardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const BadgeShowcase = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
`;

const Badge = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  width: ${props => {
    switch (props.size) {
      case 'large': return '80px';
      case 'medium': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'large': return '80px';
      case 'medium': return '60px';
      default: return '40px';
    }
  }};
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => {
    switch (props.size) {
      case 'large': return '2rem';
      case 'medium': return '1.5rem';
      default: return '1rem';
    }
  }};
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const RecentUnlockNotification = styled.div`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin: 1rem 0;
  text-align: center;
  animation: ${css`${celebrationAnimation} 0.6s ease`};
`;

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'decision' | 'analysis' | 'learning' | 'mastery' | 'collaboration';
  requirements: {
    type: string;
    target: number;
    current: number;
  };
  rewards: {
    points: number;
    unlocks: string[];
  };
  isUnlocked: boolean;
  unlockedDate?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first_risk_identified',
    title: 'Risk Radar',
    description: 'Successfully identify your first risk in a scenario',
    icon: <Target size={24} />,
    rarity: 'common',
    category: 'learning',
    requirements: { type: 'risks_identified', target: 1, current: 0 },
    rewards: { points: 100, unlocks: ['risk_assessment_guide'] },
    isUnlocked: false
  },
  {
    id: 'evidence_master',
    title: 'Evidence Detective',
    description: 'Make 10 evidence-based decisions',
    icon: <Brain size={24} />,
    rarity: 'rare',
    category: 'decision',
    requirements: { type: 'evidence_decisions', target: 10, current: 0 },
    rewards: { points: 500, unlocks: ['advanced_analytics', 'pattern_library'] },
    isUnlocked: false
  },
  {
    id: 'scenario_speedrun',
    title: 'Crisis Ninja',
    description: 'Complete a scenario in under 15 minutes',
    icon: <Zap size={24} />,
    rarity: 'epic',
    category: 'mastery',
    requirements: { type: 'fast_completion', target: 1, current: 0 },
    rewards: { points: 1000, unlocks: ['time_challenge_mode'] },
    isUnlocked: false
  },
  {
    id: 'mitigation_expert',
    title: 'Shield Master',
    description: 'Successfully implement 25 risk mitigations',
    icon: <Shield size={24} />,
    rarity: 'epic',
    category: 'mastery',
    requirements: { type: 'mitigations_implemented', target: 25, current: 0 },
    rewards: { points: 1500, unlocks: ['custom_mitigation_builder'] },
    isUnlocked: false
  },
  {
    id: 'cross_domain_expert',
    title: 'Renaissance Risk Manager',
    description: 'Master all 6 risk domains (Financial, Operational, Tech, Environmental, Cultural, Political)',
    icon: <Award size={24} />,
    rarity: 'legendary',
    category: 'mastery',
    requirements: { type: 'domains_mastered', target: 6, current: 0 },
    rewards: { points: 5000, unlocks: ['expert_scenarios', 'ai_consulting_mode'] },
    isUnlocked: false
  },
  {
    id: 'team_leader',
    title: 'Crisis Commander',
    description: 'Lead 5 successful team collaborations',
    icon: <TrendingUp size={24} />,
    rarity: 'epic',
    category: 'collaboration',
    requirements: { type: 'team_successes', target: 5, current: 0 },
    rewards: { points: 2000, unlocks: ['leadership_scenarios'] },
    isUnlocked: false
  },
  {
    id: 'perfect_score',
    title: 'Flawless Execution',
    description: 'Achieve 100% score on any scenario',
    icon: <Star size={24} />,
    rarity: 'legendary',
    category: 'mastery',
    requirements: { type: 'perfect_scores', target: 1, current: 0 },
    rewards: { points: 3000, unlocks: ['perfection_badge', 'mentor_access'] },
    isUnlocked: false
  }
];

const AchievementSystem: React.FC = () => {
  const { state } = useAXiLE();
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  useEffect(() => {
    updateAchievementProgress();
  }, [state.userProgress]);

  const updateAchievementProgress = () => {
    const updatedAchievements = userAchievements.map(achievement => {
      let current = achievement.requirements.current;

      switch (achievement.requirements.type) {
        case 'risks_identified':
          current = Math.min(achievement.requirements.target, 1); // Simulate progress
          break;
        case 'evidence_decisions':
          current = Math.min(achievement.requirements.target, state.userProgress.totalScore / 100);
          break;
        case 'fast_completion':
          current = state.userProgress.completedScenarios.length > 0 ? 1 : 0;
          break;
        case 'mitigations_implemented':
          current = Math.min(achievement.requirements.target, state.userProgress.totalScore / 50);
          break;
        case 'domains_mastered':
          current = Math.min(6, Math.floor(state.userProgress.level / 2));
          break;
        case 'perfect_scores':
          current = state.userProgress.totalScore > 2000 ? 1 : 0;
          break;
      }

      const wasUnlocked = achievement.isUnlocked;
      const isNowUnlocked = current >= achievement.requirements.target;

      if (!wasUnlocked && isNowUnlocked) {
        setRecentUnlock(achievement);
        setTimeout(() => setRecentUnlock(null), 3000);
      }

      return {
        ...achievement,
        requirements: { ...achievement.requirements, current },
        isUnlocked: isNowUnlocked,
        unlockedDate: isNowUnlocked && !wasUnlocked ? new Date().toISOString() : achievement.unlockedDate
      };
    });

    setUserAchievements(updatedAchievements);
  };

  const unlockedAchievements = userAchievements.filter(a => a.isUnlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.rewards.points, 0);
  const completionRate = Math.round((unlockedAchievements.length / userAchievements.length) * 100);

  return (
    <AchievementContainer>
      <h2>Achievement System</h2>
      <p>Track your progress and unlock rewards as you master risk management</p>

      <StatsPanel>
        <StatCard>
          <StatValue>{unlockedAchievements.length}</StatValue>
          <div>Achievements Unlocked</div>
        </StatCard>
        <StatCard>
          <StatValue>{totalPoints.toLocaleString()}</StatValue>
          <div>Achievement Points</div>
        </StatCard>
        <StatCard>
          <StatValue>{completionRate}%</StatValue>
          <div>Completion Rate</div>
        </StatCard>
        <StatCard>
          <StatValue>{userAchievements.filter(a => a.rarity === 'legendary' && a.isUnlocked).length}</StatValue>
          <div>Legendary Unlocked</div>
        </StatCard>
      </StatsPanel>

      {recentUnlock && (
        <RecentUnlockNotification>
          <Trophy size={32} style={{ marginBottom: '0.5rem' }} />
          <h3>Achievement Unlocked!</h3>
          <p>{recentUnlock.title}: {recentUnlock.description}</p>
          <p>+{recentUnlock.rewards.points} points earned!</p>
        </RecentUnlockNotification>
      )}

      <BadgeShowcase>
        <div>
          <h4>Your Badges</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {unlockedAchievements.slice(0, 5).map((achievement, index) => (
              <Badge key={achievement.id} size={index === 0 ? 'large' : index < 3 ? 'medium' : 'small'}>
                {achievement.icon}
              </Badge>
            ))}
          </div>
        </div>
      </BadgeShowcase>

      <AchievementGrid>
        {userAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            isUnlocked={achievement.isUnlocked}
            rarity={achievement.rarity}
          >
            <AchievementIcon rarity={achievement.rarity}>
              {achievement.icon}
            </AchievementIcon>
            <AchievementTitle>{achievement.title}</AchievementTitle>
            <AchievementDescription>{achievement.description}</AchievementDescription>
            
            {!achievement.isUnlocked && (
              <ProgressBar 
                progress={(achievement.requirements.current / achievement.requirements.target) * 100} 
              />
            )}

            <RewardInfo>
              <span>{achievement.rarity.toUpperCase()}</span>
              <span>{achievement.rewards.points} pts</span>
            </RewardInfo>

            {achievement.isUnlocked && achievement.unlockedDate && (
              <div style={{ 
                fontSize: '0.75rem', 
                opacity: 0.8, 
                textAlign: 'center', 
                marginTop: '0.5rem' 
              }}>
                Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
              </div>
            )}
          </AchievementCard>
        ))}
      </AchievementGrid>
    </AchievementContainer>
  );
};

export default AchievementSystem;