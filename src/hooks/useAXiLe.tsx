import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OKRMStructure, Risk, Mitigation, UserProgress, GameScenario } from '../types/axile';
import { mockOKRMStructure, mockUserProgress, mockGameScenarios } from '../data/mock/axileMockData';

interface AXiLEState {
  okrm: OKRMStructure;
  userProgress: UserProgress;
  gameScenarios: GameScenario[];
  currentScenario: GameScenario | null;
  isLoading: boolean;
  error: string | null;
}

type AXiLEAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_RISK'; payload: { riskId: string; updates: Partial<Risk> } }
  | { type: 'ADD_MITIGATION'; payload: Mitigation }
  | { type: 'UPDATE_USER_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'SELECT_SCENARIO'; payload: string }
  | { type: 'COMPLETE_SCENARIO'; payload: { scenarioId: string; score: number } }
  | { type: 'RESET_STATE' };

const initialState: AXiLEState = {
  okrm: mockOKRMStructure,
  userProgress: mockUserProgress,
  gameScenarios: mockGameScenarios,
  currentScenario: null,
  isLoading: false,
  error: null,
};

function axileReducer(state: AXiLEState, action: AXiLEAction): AXiLEState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'UPDATE_RISK': {
      const { riskId, updates } = action.payload;
      const updatedRisks = state.okrm.risks.map(risk =>
        risk.id === riskId ? { ...risk, ...updates } : risk
      );
      return {
        ...state,
        okrm: { ...state.okrm, risks: updatedRisks }
      };
    }

    case 'ADD_MITIGATION': {
      const updatedMitigations = [...state.okrm.mitigations, action.payload];
      return {
        ...state,
        okrm: { ...state.okrm, mitigations: updatedMitigations }
      };
    }

    case 'UPDATE_USER_PROGRESS': {
      return {
        ...state,
        userProgress: { ...state.userProgress, ...action.payload }
      };
    }

    case 'SELECT_SCENARIO': {
      const scenario = state.gameScenarios.find(s => s.id === action.payload);
      return {
        ...state,
        currentScenario: scenario || null
      };
    }

    case 'COMPLETE_SCENARIO': {
      const { scenarioId, score } = action.payload;
      const updatedCompletedScenarios = state.userProgress.completedScenarios.includes(scenarioId)
        ? state.userProgress.completedScenarios
        : [...state.userProgress.completedScenarios, scenarioId];
      
      const newTotalScore = state.userProgress.totalScore + score;
      const newLevel = Math.floor(newTotalScore / 1000) + 1;
      const newXP = state.userProgress.experiencePoints + score;

      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          completedScenarios: updatedCompletedScenarios,
          totalScore: newTotalScore,
          level: newLevel,
          experiencePoints: newXP
        },
        currentScenario: null
      };
    }

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

interface AXiLEContextValue {
  state: AXiLEState;
  actions: {
    updateRisk: (riskId: string, updates: Partial<Risk>) => void;
    addMitigation: (mitigation: Mitigation) => void;
    updateUserProgress: (updates: Partial<UserProgress>) => void;
    selectScenario: (scenarioId: string) => void;
    completeScenario: (scenarioId: string, score: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetState: () => void;
  };
}

const AXiLEContext = createContext<AXiLEContextValue | undefined>(undefined);

interface AXiLEProviderProps {
  children: ReactNode;
}

export const AXiLEProvider: React.FC<AXiLEProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(axileReducer, initialState);

  const actions = {
    updateRisk: (riskId: string, updates: Partial<Risk>) =>
      dispatch({ type: 'UPDATE_RISK', payload: { riskId, updates } }),
    
    addMitigation: (mitigation: Mitigation) =>
      dispatch({ type: 'ADD_MITIGATION', payload: mitigation }),
    
    updateUserProgress: (updates: Partial<UserProgress>) =>
      dispatch({ type: 'UPDATE_USER_PROGRESS', payload: updates }),
    
    selectScenario: (scenarioId: string) =>
      dispatch({ type: 'SELECT_SCENARIO', payload: scenarioId }),
    
    completeScenario: (scenarioId: string, score: number) =>
      dispatch({ type: 'COMPLETE_SCENARIO', payload: { scenarioId, score } }),
    
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),
    
    setError: (error: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    
    resetState: () =>
      dispatch({ type: 'RESET_STATE' })
  };

  return (
    <AXiLEContext.Provider value={{ state, actions }}>
      {children}
    </AXiLEContext.Provider>
  );
};

export const useAXiLE = (): AXiLEContextValue => {
  const context = useContext(AXiLEContext);
  if (context === undefined) {
    throw new Error('useAXiLE must be used within an AXiLEProvider');
  }
  return context;
};

export const useRiskManagement = () => {
  const { state, actions } = useAXiLE();
  
  const calculateRiskScore = (probability: number, impact: number): number => {
    return probability * impact;
  };
  
  const getRiskLevel = (riskScore: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (riskScore <= 0.25) return 'low';
    if (riskScore <= 0.5) return 'medium';
    if (riskScore <= 0.75) return 'high';
    return 'critical';
  };
  
  const getHighestPriorityRisks = (limit: number = 5) => {
    return state.okrm.risks
      .sort((a, b) => calculateRiskScore(b.probability, b.impact) - calculateRiskScore(a.probability, a.impact))
      .slice(0, limit);
  };
  
  const getMitigationsForRisk = (riskId: string) => {
    return state.okrm.mitigations.filter(mitigation => mitigation.riskId === riskId);
  };
  
  return {
    risks: state.okrm.risks,
    mitigations: state.okrm.mitigations,
    calculateRiskScore,
    getRiskLevel,
    getHighestPriorityRisks,
    getMitigationsForRisk,
    updateRisk: actions.updateRisk,
    addMitigation: actions.addMitigation,
  };
};