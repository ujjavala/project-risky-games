export interface OKRMStructure {
  objectives: Objective[];
  keyResults: KeyResult[];
  risks: Risk[];
  mitigations: Mitigation[];
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'operational' | 'compliance' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'completed' | 'at_risk';
  keyResults: string[];
  risks: string[];
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'operational' | 'compliance' | 'strategic' | 'reputational' | 'technological';
  probability: number;
  impact: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'avoided';
  objectiveIds: string[];
  mitigationIds: string[];
  owner: string;
  identifiedDate: string;
  lastReviewDate: string;
  naturalPatterns: string[];
}

export interface Mitigation {
  id: string;
  riskId: string;
  title: string;
  description: string;
  type: 'preventive' | 'corrective' | 'detective' | 'compensating';
  status: 'planned' | 'in_progress' | 'implemented' | 'ineffective';
  effectiveness: number;
  cost: number;
  implementationDate: string;
  owner: string;
}

export interface NaturalPattern {
  id: string;
  name: string;
  description: string;
  domain: string;
  frequency: number;
  historicalOccurrences: HistoricalOccurrence[];
  relatedRisks: string[];
}

export interface HistoricalOccurrence {
  id: string;
  date: string;
  description: string;
  impact: number;
  context: string;
  lessonsLearned: string[];
}

export interface SmartMatterNode {
  id: string;
  type: 'risk' | 'mitigation' | 'objective' | 'pattern';
  data: any;
  relationships: Relationship[];
}

export interface Relationship {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'causes' | 'mitigates' | 'impacts' | 'correlates' | 'precedes';
  strength: number;
  confidence: number;
}

export interface GameScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number;
  objectives: Objective[];
  initialRisks: Risk[];
  events: ScenarioEvent[];
  winConditions: WinCondition[];
  rewards: Reward[];
}

export interface ScenarioEvent {
  id: string;
  trigger: string;
  description: string;
  impact: EventImpact[];
  choices: Choice[];
  timestamp: number;
}

export interface EventImpact {
  type: 'risk_increase' | 'risk_decrease' | 'objective_change' | 'resource_change';
  targetId: string;
  magnitude: number;
}

export interface Choice {
  id: string;
  text: string;
  consequences: EventImpact[];
  cost: number;
  requiredEvidence: string[];
}

export interface WinCondition {
  id: string;
  type: 'risk_below_threshold' | 'objective_achieved' | 'time_limit' | 'resource_conservation';
  criteria: any;
}

export interface Reward {
  id: string;
  type: 'points' | 'badge' | 'unlock' | 'certificate';
  value: number;
  description: string;
}

export interface UserProgress {
  userId: string;
  completedScenarios: string[];
  badges: Badge[];
  totalScore: number;
  level: number;
  experiencePoints: number;
  riskAssessmentSkill: number;
  mitigationPlanningSkill: number;
  decisionMakingSkill: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedDate: string;
  category: string;
}