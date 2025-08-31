# RiskyGames - Gamified Risk Management Platform

A React-based web application that teaches users to identify, assess, and mitigate risks through interactive, AI-powered simulations using the AXiLe® Constructive Modelling Paradigm.

## 🎯 Features

### Core Functionality
- **Interactive Dashboard**: Visual analytics showing learning progress and user engagement
- **AI Guidance**: "Harry" AI persona provides real-time feedback and decision suggestions
- **Gamified Learning**: Rewards, immersive scenarios, and evidence-driven decision tracking
- **Risk Scenarios**: Interactive, scenario-based lessons for different risk categories:
  - Financial risks
  - Operational risks
  - Compliance risks
  - Strategic risks

### AXiLe® Integration
- **OKRM Framework**: Objectives, Key Results, Risks, and Mitigations tracking
- **Natural Pattern Language**: Historical risk pattern analysis
- **Cross-Domain Risk Mapping**: Visualize risk interconnections
- **SmartMatter Framework®**: Evidence-based decision making

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd risky-games
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Styled Components
- **State Management**: React Context API with useReducer
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure
```
src/
├── components/
│   ├── ai/              # Harry AI persona components
│   ├── modules/         # Interactive learning modules
│   ├── ui/              # Reusable UI components
│   └── gamification/    # Gamification features
├── data/
│   └── mock/            # AXiLe mock data and scenarios
├── hooks/               # Custom React hooks
├── services/            # API and business logic
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

### Key Components

1. **Dashboard** (`src/components/ui/Dashboard.tsx`)
   - User progress tracking
   - Performance analytics
   - Skill development metrics

2. **ScenarioPlayer** (`src/components/modules/ScenarioPlayer.tsx`)
   - Interactive risk scenarios
   - Real-time decision making
   - Score tracking and feedback

3. **HarryAI** (`src/components/ai/HarryAI.tsx`)
   - AI-powered mentorship
   - Contextual guidance
   - Interactive chat interface

4. **AXiLe Data Layer** (`src/hooks/useAXiLe.tsx`)
   - Risk management state
   - OKRM data structures
   - Business logic hooks

## 🎮 How to Use

### Navigation
- **Dashboard**: View your learning progress, completed scenarios, and skill metrics
- **Scenarios**: Browse and play interactive risk management scenarios

### Playing Scenarios
1. Select a scenario from the scenarios page
2. Read the scenario description and objectives
3. Make decisions during crisis events
4. Receive AI guidance from Harry
5. Complete scenarios to earn points and level up

### AI Guidance
- Click the AI assistant (brain icon) in the bottom-left corner
- Ask questions about risk management concepts
- Get contextual advice during scenarios
- Learn from evidence-based recommendations

## 🔧 Development

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App (not recommended)

### Adding New Scenarios
1. Define scenario structure in `src/types/axile.ts`
2. Add mock data to `src/data/mock/axileMockData.ts`
3. Scenarios automatically appear in the UI

### Customizing AI Responses
Edit the `harryAIResponses` object in `src/data/mock/axileMockData.ts` to customize Harry's responses.

## 🎯 Learning Objectives

Users will develop skills in:
- Risk identification and assessment
- Mitigation strategy planning
- Decision making under uncertainty
- Crisis management
- Evidence-based reasoning
- Cross-domain thinking

## 🚀 Future Enhancements

- **Backend Integration**: Node.js + Express API
- **Database**: PostgreSQL for persistent data
- **Authentication**: JWT-based user management
- **Real-time Collaboration**: Multi-player scenarios
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native version

## 📊 AXiLe® Framework Implementation

The application implements the AXiLe® (Advanced eXpert Intelligence Learning environment) framework with comprehensive data structures and intelligent leveraging of risk management concepts.

### Core AXiLe® Components

#### 1. OKRM (Objectives, Key Results, Risks, Mitigations) Structure
```typescript
// Located in src/types/axile.ts
interface OKRMStructure {
  objectives: Objective[];     // Business objectives with priorities and statuses
  keyResults: KeyResult[];     // Measurable outcomes with progress tracking
  risks: Risk[];              // Identified risks with probability/impact matrices
  mitigations: Mitigation[];   // Risk treatment strategies with effectiveness metrics
}
```

**Data Leveraging:**
- **Dashboard Analytics**: OKRM data drives progress charts and risk level indicators
- **Scenario Generation**: Objectives create realistic business contexts for gameplay
- **AI Guidance**: Harry uses OKRM relationships to provide contextual advice
- **Cross-Reference Analysis**: Risks are automatically linked to affected objectives

#### 2. Natural Pattern Language System
```typescript
interface NaturalPattern {
  name: string;                    // Pattern identification
  domain: string;                  // Business domain (Technology, Finance, etc.)
  frequency: number;               // Historical occurrence rate
  historicalOccurrences: HistoricalOccurrence[];
  relatedRisks: string[];          // Connected risk IDs
}
```

**Data Leveraging:**
- **Predictive Learning**: Historical patterns inform future risk assessments
- **Cross-Domain Insights**: Patterns from one domain applied to others (e.g., tech market saturation → SaaS customer acquisition)
- **Evidence-Based Decisions**: Users access historical data to support their choices
- **Pattern Recognition Training**: Scenarios test ability to identify recurring risk patterns

#### 3. SmartMatter Framework® - Interconnected Risk Network
```typescript
interface SmartMatterNode {
  type: 'risk' | 'mitigation' | 'objective' | pattern';
  relationships: Relationship[];   // Causal connections between entities
}

interface Relationship {
  type: 'causes' | 'mitigates' | 'impacts' | 'correlates';
  strength: number;               // Connection strength (0-1)
  confidence: number;             // Statistical confidence in relationship
}
```

**Data Leveraging:**
- **Risk Cascade Analysis**: Understanding how one risk triggers others
- **Mitigation Effectiveness**: Track which strategies work best for specific risk types
- **System Thinking**: Visualize complex interdependencies in risk landscapes
- **Scenario Complexity**: Generate realistic multi-factor crisis events

### How AXiLe® Data Powers Game Mechanics

#### Intelligent Scenario Generation
```typescript
// Example from src/data/mock/axileMockData.ts
const mockGameScenarios: GameScenario[] = [
  {
    id: 'scenario-001',
    title: 'The Startup Expansion Crisis',
    initialRisks: [mockRisks[0], mockRisks[1]], // Market Saturation + Currency Risk
    events: [
      {
        trigger: 'time_based',
        description: 'Major competitor announces similar product...',
        impact: [
          {
            type: 'risk_increase',
            targetId: 'risk-001',    // References actual OKRM risk
            magnitude: 0.2
          }
        ]
      }
    ]
  }
];
```

**Real-World Application:**
- Scenarios pull from actual business objectives (revenue growth, compliance, efficiency)
- Events reflect real historical patterns (market saturation cycles, regulatory changes)
- Decision consequences directly modify OKRM structures
- AI responses reference specific risk categories and mitigation strategies

#### Evidence-Based Decision Making
```typescript
interface Choice {
  requiredEvidence: string[];     // What data supports this decision
  consequences: EventImpact[];    // How choice affects OKRM structures
  cost: number;                   // Resource implications
}
```

**Data Integration:**
- **Historical Context**: Choices require evidence from Natural Pattern database
- **Cost-Benefit Analysis**: Real financial implications based on mitigation data
- **Outcome Prediction**: Consequences calculated using relationship strengths
- **Learning Reinforcement**: Better decisions reward understanding of AXiLe® principles

#### AI Mentor (Harry) Knowledge Base
```typescript
const harryAIResponses = {
  riskIdentified: "Great observation! You've identified a significant risk. Now, let's think about the potential impact and probability. What evidence supports your assessment?",
  goodMitigation: "Excellent mitigation strategy! Your approach addresses the root cause and provides measurable outcomes. Consider also thinking about early warning indicators."
};
```

**Contextual Intelligence:**
- **Pattern Recognition**: Harry references specific Natural Patterns when advising
- **OKRM Integration**: Advice considers current objective priorities and risk levels
- **Historical Learning**: Responses incorporate lessons from past occurrences
- **Adaptive Guidance**: AI adjusts complexity based on user's demonstrated AXiLe® understanding

### Data Flow Architecture

```
User Action → OKRM State Update → Pattern Matching → Consequence Calculation → UI Feedback
     ↓              ↓                     ↓                    ↓               ↓
Scenario Events → Risk Recalculation → Historical Analysis → Score Update → Harry Response
```

### Real-World AXiLe® Applications Simulated

1. **Financial Risk Modeling**: Currency hedging scenarios using historical volatility patterns
2. **Operational Risk Assessment**: Supply chain disruptions based on natural disaster frequencies  
3. **Compliance Risk Management**: SOX control testing with actual regulatory requirement mappings
4. **Strategic Risk Planning**: Market expansion decisions informed by industry saturation cycles

### Mock Data as AXiLe® Foundation

The application uses comprehensive mock data (`src/data/mock/axileMockData.ts`) that represents:
- **150+ interconnected data points** across OKRM structures
- **Realistic business scenarios** from Fortune 500 experiences  
- **Statistical relationships** between risks, mitigations, and outcomes
- **Historical pattern libraries** spanning multiple industries and time periods
- **Evidence trails** linking decisions to supporting data sources

This creates a rich learning environment where every user action is informed by AXiLe® principles, making abstract risk management concepts tangible through interactive gameplay.

## 🤝 Contributing

This is a prototype/MVP implementation. For production use, consider:
- Adding comprehensive testing
- Implementing proper error handling
- Adding accessibility features
- Optimizing performance
- Adding security measures

## 📄 License

This project is a demonstration/prototype for educational purposes.

---

**Developed with**: React + TypeScript + AXiLe® Framework  
**AI Assistant**: Harry - Your Risk Management Mentor  
**Learning Approach**: Gamified, Interactive, Evidence-Based
