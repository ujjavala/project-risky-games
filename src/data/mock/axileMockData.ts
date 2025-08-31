import {
  OKRMStructure,
  Objective,
  KeyResult,
  Risk,
  Mitigation,
  NaturalPattern,
  HistoricalOccurrence,
  GameScenario,
  ScenarioEvent,
  UserProgress,
  Badge
} from '../../types/axile';

export const mockObjectives: Objective[] = [
  {
    id: 'obj-001',
    title: 'Increase Annual Revenue by 25%',
    description: 'Drive revenue growth through new market expansion and customer acquisition',
    category: 'financial',
    priority: 'high',
    status: 'active',
    keyResults: ['kr-001', 'kr-002', 'kr-003'],
    risks: ['risk-001', 'risk-002']
  },
  {
    id: 'obj-002',
    title: 'Enhance Operational Efficiency',
    description: 'Streamline processes to reduce costs and improve service delivery',
    category: 'operational',
    priority: 'medium',
    status: 'active',
    keyResults: ['kr-004', 'kr-005'],
    risks: ['risk-003', 'risk-004']
  },
  {
    id: 'obj-003',
    title: 'Achieve SOX Compliance',
    description: 'Implement controls and processes to meet Sarbanes-Oxley requirements',
    category: 'compliance',
    priority: 'critical',
    status: 'at_risk',
    keyResults: ['kr-006', 'kr-007'],
    risks: ['risk-005', 'risk-006']
  }
];

export const mockKeyResults: KeyResult[] = [
  {
    id: 'kr-001',
    objectiveId: 'obj-001',
    title: 'Acquire 500 new enterprise customers',
    description: 'Target Fortune 1000 companies with our enterprise solution',
    target: 500,
    current: 287,
    unit: 'customers',
    dueDate: '2024-12-31',
    status: 'in_progress'
  },
  {
    id: 'kr-002',
    objectiveId: 'obj-001',
    title: 'Launch in 3 new geographic markets',
    description: 'Expand operations to APAC, EMEA, and LATAM regions',
    target: 3,
    current: 1,
    unit: 'markets',
    dueDate: '2024-10-15',
    status: 'in_progress'
  },
  {
    id: 'kr-006',
    objectiveId: 'obj-003',
    title: 'Complete SOX control testing',
    description: 'Test all financial controls for SOX compliance',
    target: 100,
    current: 65,
    unit: 'percent',
    dueDate: '2024-11-30',
    status: 'at_risk'
  }
];

export const mockRisks: Risk[] = [
  {
    id: 'risk-001',
    title: 'Market Saturation Risk',
    description: 'Increasing competition may limit our ability to acquire new customers at projected rates',
    category: 'strategic',
    probability: 0.6,
    impact: 0.8,
    riskLevel: 'high',
    status: 'assessed',
    objectiveIds: ['obj-001'],
    mitigationIds: ['mit-001', 'mit-002'],
    owner: 'Sarah Chen - VP Sales',
    identifiedDate: '2024-01-15',
    lastReviewDate: '2024-08-15',
    naturalPatterns: ['pattern-001']
  },
  {
    id: 'risk-002',
    title: 'Currency Exchange Risk',
    description: 'Fluctuations in foreign exchange rates may impact revenue from international markets',
    category: 'financial',
    probability: 0.7,
    impact: 0.6,
    riskLevel: 'medium',
    status: 'mitigated',
    objectiveIds: ['obj-001'],
    mitigationIds: ['mit-003'],
    owner: 'Marcus Rodriguez - CFO',
    identifiedDate: '2024-02-01',
    lastReviewDate: '2024-08-20',
    naturalPatterns: ['pattern-002']
  },
  {
    id: 'risk-005',
    title: 'SOX Control Deficiency',
    description: 'Current financial controls may not meet SOX requirements, leading to compliance failure',
    category: 'compliance',
    probability: 0.4,
    impact: 0.9,
    riskLevel: 'critical',
    status: 'identified',
    objectiveIds: ['obj-003'],
    mitigationIds: ['mit-005'],
    owner: 'Jennifer Liu - Head of Compliance',
    identifiedDate: '2024-03-10',
    lastReviewDate: '2024-08-25',
    naturalPatterns: ['pattern-003']
  }
];

export const mockMitigations: Mitigation[] = [
  {
    id: 'mit-001',
    riskId: 'risk-001',
    title: 'Diversified Customer Acquisition Strategy',
    description: 'Implement multi-channel approach targeting different market segments',
    type: 'preventive',
    status: 'in_progress',
    effectiveness: 0.7,
    cost: 250000,
    implementationDate: '2024-06-01',
    owner: 'Sarah Chen - VP Sales'
  },
  {
    id: 'mit-002',
    riskId: 'risk-001',
    title: 'Product Differentiation Initiative',
    description: 'Develop unique features that differentiate us from competitors',
    type: 'preventive',
    status: 'planned',
    effectiveness: 0.8,
    cost: 500000,
    implementationDate: '2024-09-01',
    owner: 'Alex Kumar - Head of Product'
  },
  {
    id: 'mit-003',
    riskId: 'risk-002',
    title: 'Currency Hedging Program',
    description: 'Implement forward contracts to hedge against currency fluctuations',
    type: 'preventive',
    status: 'implemented',
    effectiveness: 0.9,
    cost: 75000,
    implementationDate: '2024-04-01',
    owner: 'Marcus Rodriguez - CFO'
  }
];

export const mockNaturalPatterns: NaturalPattern[] = [
  {
    id: 'pattern-001',
    name: 'Market Saturation Cycle',
    description: 'Technology markets typically saturate after 3-5 years of rapid growth',
    domain: 'Technology',
    frequency: 0.8,
    historicalOccurrences: [
      {
        id: 'occ-001',
        date: '2019-03-15',
        description: 'Mobile app market saturation led to increased customer acquisition costs',
        impact: 0.6,
        context: 'Similar SaaS companies experienced 40% increase in CAC',
        lessonsLearned: ['Diversify early', 'Focus on retention over acquisition']
      }
    ],
    relatedRisks: ['risk-001']
  },
  {
    id: 'pattern-002',
    name: 'Economic Uncertainty Currency Impact',
    description: 'Currency volatility increases during economic uncertainty periods',
    domain: 'Finance',
    frequency: 0.6,
    historicalOccurrences: [
      {
        id: 'occ-002',
        date: '2020-03-01',
        description: 'COVID-19 pandemic caused significant currency fluctuations',
        impact: 0.8,
        context: 'USD strengthened against emerging market currencies',
        lessonsLearned: ['Hedge early', 'Monitor geopolitical events']
      }
    ],
    relatedRisks: ['risk-002']
  }
];

export const mockGameScenarios: GameScenario[] = [
  {
    id: 'scenario-001',
    title: 'The Startup Expansion Crisis',
    description: 'A fast-growing startup faces multiple risks while trying to scale internationally',
    category: 'Strategic Risk Management',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    objectives: [mockObjectives[0]],
    initialRisks: [mockRisks[0], mockRisks[1]],
    events: [
      {
        id: 'event-001',
        trigger: 'time_based',
        description: 'A major competitor announces a similar product with lower pricing',
        impact: [
          {
            type: 'risk_increase',
            targetId: 'risk-001',
            magnitude: 0.2
          }
        ],
        choices: [
          {
            id: 'choice-001',
            text: 'Lower our pricing to match competitor',
            consequences: [
              {
                type: 'objective_change',
                targetId: 'obj-001',
                magnitude: -0.3
              }
            ],
            cost: 1000000,
            requiredEvidence: []
          },
          {
            id: 'choice-002',
            text: 'Invest in product differentiation',
            consequences: [
              {
                type: 'risk_decrease',
                targetId: 'risk-001',
                magnitude: -0.1
              }
            ],
            cost: 500000,
            requiredEvidence: ['market_research', 'competitive_analysis']
          }
        ],
        timestamp: 15
      }
    ],
    winConditions: [
      {
        id: 'win-001',
        type: 'objective_achieved',
        criteria: { objectiveId: 'obj-001', threshold: 0.8 }
      }
    ],
    rewards: [
      {
        id: 'reward-001',
        type: 'badge',
        value: 100,
        description: 'Strategic Risk Navigator - Successfully navigated a complex business expansion scenario'
      }
    ]
  }
];

export const mockUserProgress: UserProgress = {
  userId: 'user-001',
  completedScenarios: ['scenario-001'],
  badges: [
    {
      id: 'badge-001',
      name: 'Risk Identification Novice',
      description: 'Successfully identified 5 different types of risks',
      iconUrl: '/badges/risk-novice.png',
      earnedDate: '2024-08-15',
      category: 'Risk Assessment'
    }
  ],
  totalScore: 1250,
  level: 3,
  experiencePoints: 3750,
  riskAssessmentSkill: 65,
  mitigationPlanningSkill: 58,
  decisionMakingSkill: 72
};

export const mockOKRMStructure: OKRMStructure = {
  objectives: mockObjectives,
  keyResults: mockKeyResults,
  risks: mockRisks,
  mitigations: mockMitigations
};

export const harryAIResponses = {
  welcome: "Hello! I'm Harry, your AI risk management mentor. I'm here to guide you through complex risk scenarios and help you develop your decision-making skills. Ready to tackle some challenges?",
  riskIdentified: "Great observation! You've identified a significant risk. Now, let's think about the potential impact and probability. What evidence supports your assessment?",
  goodMitigation: "Excellent mitigation strategy! Your approach addresses the root cause and provides measurable outcomes. Consider also thinking about early warning indicators.",
  needsImprovement: "That's a start, but let's dig deeper. What additional factors might influence this situation? Remember, risks often interconnect in unexpected ways.",
  encouragement: "You're developing strong risk intuition! Remember, the best risk managers learn from both successes and failures. Keep questioning assumptions."
};