import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { User, Trophy, Settings, Home, GamepadIcon, BarChart3, Award, Network, Zap } from 'lucide-react';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: white;
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  background: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

interface HeaderProps {
  userLevel?: number;
  userScore?: number;
}

const Header: React.FC<HeaderProps> = ({ userLevel = 1, userScore = 0 }) => {
  const location = useLocation();
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo to="/dashboard">RiskyGames</Logo>
          <Navigation>
            <NavLink 
              to="/dashboard" 
              $isActive={location.pathname === '/dashboard'}
            >
              <Home size={16} />
              Dashboard
            </NavLink>
            <NavLink 
              to="/scenarios" 
              $isActive={location.pathname === '/scenarios'}
            >
              <GamepadIcon size={16} />
              Scenarios
            </NavLink>
            <NavLink 
              to="/simulations" 
              $isActive={location.pathname === '/simulations'}
            >
              <Zap size={16} />
              Simulations
            </NavLink>
            <NavLink 
              to="/achievements" 
              $isActive={location.pathname === '/achievements'}
            >
              <Award size={16} />
              Achievements
            </NavLink>
            <NavLink 
              to="/visualization" 
              $isActive={location.pathname === '/visualization'}
            >
              <Network size={16} />
              Risk Map
            </NavLink>
            <NavLink 
              to="/analytics" 
              $isActive={location.pathname === '/analytics'}
            >
              <BarChart3 size={16} />
              Analytics
            </NavLink>
          </Navigation>
        </LeftSection>
        
        <UserInfo>
          <UserStats>
            <Trophy size={16} />
            <span>Level {userLevel}</span>
            <span>•</span>
            <span>{userScore.toLocaleString()} pts</span>
          </UserStats>
          <IconButton>
            <User size={18} />
          </IconButton>
          <IconButton>
            <Settings size={18} />
          </IconButton>
        </UserInfo>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;