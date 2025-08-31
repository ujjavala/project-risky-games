import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar, 
  Users, 
  Target, 
  Award,
  AlertTriangle,
  BookOpen,
  Clock,
  Zap,
  FileText,
  Mail
} from 'lucide-react';

const AnalyticsContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const HeaderControls = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ExportButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#4a5568'};
  border: 1px solid ${props => props.variant === 'primary' ? 'transparent' : '#e2e8f0'};
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
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div<{ trend: 'up' | 'down' | 'stable' }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.trend) {
      case 'up': return '#48bb78';
      case 'down': return '#e53e3e';
      default: return '#667eea';
    }
  }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100px;
    height: 100px;
    background: ${props => {
      switch (props.trend) {
        case 'up': return 'linear-gradient(135deg, #48bb78, #68d391)';
        case 'down': return 'linear-gradient(135deg, #e53e3e, #fc8181)';
        default: return 'linear-gradient(135deg, #667eea, #764ba2)';
      }
    }};
    border-radius: 50%;
    opacity: 0.1;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MetricChange = styled.div<{ trend: 'up' | 'down' | 'stable' }>`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => {
    switch (props.trend) {
      case 'up': return '#48bb78';
      case 'down': return '#e53e3e';
      default: return '#718096';
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
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
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.isActive ? '#667eea' : '#f7fafc'};
  }
`;

const InsightCard = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #667eea;
`;

const ReportSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    text-align: left;
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f7fafc;
    font-weight: 600;
    color: #4a5568;
  }

  tr:hover {
    background: #f7fafc;
  }
`;

const ProgressRing = styled.div<{ progress: number; size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0deg,
    #667eea ${props => props.progress * 3.6}deg,
    #e2e8f0 ${props => props.progress * 3.6}deg,
    #e2e8f0 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '${props => props.progress}%';
    position: absolute;
    width: ${props => props.size - 20}px;
    height: ${props => props.size - 20}px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
    color: #2d3748;
  }
`;

// Mock data for analytics
const performanceData = [
  { month: 'Jan', scenarios: 12, decisions: 45, accuracy: 78 },
  { month: 'Feb', scenarios: 18, decisions: 67, accuracy: 82 },
  { month: 'Mar', scenarios: 22, decisions: 89, accuracy: 85 },
  { month: 'Apr', scenarios: 28, decisions: 112, accuracy: 88 },
  { month: 'May', scenarios: 35, decisions: 134, accuracy: 91 },
  { month: 'Jun', scenarios: 42, decisions: 156, accuracy: 94 }
];

const skillDistribution = [
  { name: 'Risk Assessment', value: 85, color: '#667eea' },
  { name: 'Decision Making', value: 72, color: '#48bb78' },
  { name: 'Crisis Management', value: 68, color: '#ed8936' },
  { name: 'Pattern Recognition', value: 91, color: '#9f7aea' },
  { name: 'Team Leadership', value: 45, color: '#e53e3e' },
  { name: 'Evidence Analysis', value: 78, color: '#38b2ac' }
];

const domainMastery = [
  { domain: 'Financial', completed: 15, total: 20, mastery: 75 },
  { domain: 'Operational', completed: 12, total: 18, mastery: 67 },
  { domain: 'Technology', completed: 8, total: 15, mastery: 53 },
  { domain: 'Environmental', completed: 6, total: 12, mastery: 50 },
  { domain: 'Cultural', completed: 4, total: 10, mastery: 40 },
  { domain: 'Political', completed: 3, total: 8, mastery: 38 }
];

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'skills' | 'reports'>('overview');
  const [timeRange, setTimeRange] = useState('6months');
  const [userFilter, setUserFilter] = useState('all');

  const generateReport = (type: 'pdf' | 'csv' | 'excel') => {
    // Simulate report generation
    alert(`Generating ${type.toUpperCase()} report...`);
  };

  const sendReport = () => {
    alert('Report sent to your email!');
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <TrendingUp size={16} /> },
    { id: 'performance' as const, label: 'Performance', icon: <Target size={16} /> },
    { id: 'skills' as const, label: 'Skills', icon: <Award size={16} /> },
    { id: 'reports' as const, label: 'Reports', icon: <FileText size={16} /> }
  ];

  const metrics = [
    {
      label: 'Total Learning Hours',
      value: '127.5',
      change: '+23%',
      trend: 'up' as const,
      icon: <Clock size={20} />,
      color: '#667eea'
    },
    {
      label: 'Scenarios Completed',
      value: '42',
      change: '+18%',
      trend: 'up' as const,
      icon: <BookOpen size={20} />,
      color: '#48bb78'
    },
    {
      label: 'Decision Accuracy',
      value: '94%',
      change: '+6%',
      trend: 'up' as const,
      icon: <Target size={20} />,
      color: '#ed8936'
    },
    {
      label: 'Risk Identification Speed',
      value: '2.3min',
      change: '-15%',
      trend: 'up' as const,
      icon: <Zap size={20} />,
      color: '#9f7aea'
    }
  ];

  return (
    <AnalyticsContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Advanced Analytics & Reporting</h2>
          <p>Comprehensive insights into learning progress and risk management skills</p>
        </div>
        
        <FilterGroup>
          <Calendar size={16} />
          <FilterSelect value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </FilterSelect>
          
          <Users size={16} />
          <FilterSelect value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="all">All Users</option>
            <option value="team">My Team</option>
            <option value="individual">Individual</option>
          </FilterSelect>
        </FilterGroup>
      </div>

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

      {activeTab === 'overview' && (
        <>
          <MetricsGrid>
            {metrics.map((metric, index) => (
              <MetricCard key={index} trend={metric.trend}>
                <MetricHeader>
                  <MetricIcon color={metric.color}>
                    {metric.icon}
                  </MetricIcon>
                  <MetricChange trend={metric.trend}>
                    {metric.change}
                    <TrendingUp size={14} />
                  </MetricChange>
                </MetricHeader>
                <MetricValue>{metric.value}</MetricValue>
                <MetricLabel>{metric.label}</MetricLabel>
              </MetricCard>
            ))}
          </MetricsGrid>

          <InsightCard>
            <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#667eea" />
              AI-Generated Insights
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Your pattern recognition skills have improved 15% this month - excellent progress!</li>
              <li>Consider focusing on team leadership scenarios to balance your skill portfolio</li>
              <li>Your decision speed has increased significantly while maintaining high accuracy</li>
              <li>Financial risk scenarios show the highest engagement - explore similar complexities in other domains</li>
            </ul>
          </InsightCard>

          <ChartsGrid>
            <ChartCard>
              <ChartTitle>
                <TrendingUp size={20} />
                Learning Progress Over Time
              </ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="scenarios" stroke="#667eea" strokeWidth={3} />
                  <Line type="monotone" dataKey="accuracy" stroke="#48bb78" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <ChartTitle>
                <Award size={20} />
                Skill Distribution
              </ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsGrid>
        </>
      )}

      {activeTab === 'performance' && (
        <>
          <ChartsGrid>
            <ChartCard>
              <ChartTitle>Monthly Decision Accuracy Trends</ChartTitle>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Domain Mastery Progress</ChartTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {domainMastery.map((domain, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ minWidth: '100px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {domain.domain}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        background: '#e2e8f0', 
                        height: '20px', 
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: '#667eea',
                          height: '100%',
                          width: `${domain.mastery}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                    <div style={{ minWidth: '60px', textAlign: 'right', fontSize: '0.9rem' }}>
                      {domain.completed}/{domain.total}
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </ChartsGrid>

          <ChartCard>
            <ChartTitle>Performance Radar</ChartTitle>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={skillDistribution}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#667eea"
                  fill="#667eea"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      {activeTab === 'skills' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {skillDistribution.map((skill, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <ProgressRing progress={skill.value} size={120} />
                <h4 style={{ margin: '1rem 0 0.5rem 0' }}>{skill.name}</h4>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                  {skill.value >= 80 ? 'Expert' : 
                   skill.value >= 60 ? 'Proficient' : 
                   skill.value >= 40 ? 'Developing' : 'Beginner'}
                </p>
              </div>
            ))}
          </div>

          <ChartCard>
            <ChartTitle>Skill Development Timeline</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#667eea" name="Decision Accuracy" />
                <Line type="monotone" dataKey="scenarios" stroke="#48bb78" name="Scenarios Completed" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      {activeTab === 'reports' && (
        <ReportSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Generate Custom Reports</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ExportButton onClick={() => generateReport('pdf')} variant="primary">
                <Download size={16} />
                Export PDF
              </ExportButton>
              <ExportButton onClick={() => generateReport('csv')}>
                <Download size={16} />
                Export CSV
              </ExportButton>
              <ExportButton onClick={sendReport}>
                <Mail size={16} />
                Email Report
              </ExportButton>
            </div>
          </div>

          <DataTable>
            <thead>
              <tr>
                <th>Date</th>
                <th>Scenario</th>
                <th>Domain</th>
                <th>Score</th>
                <th>Time</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-08-30</td>
                <td>Financial Crisis Management</td>
                <td>Financial</td>
                <td>94%</td>
                <td>12:30</td>
                <td>92%</td>
              </tr>
              <tr>
                <td>2024-08-29</td>
                <td>Supply Chain Disruption</td>
                <td>Operational</td>
                <td>87%</td>
                <td>15:45</td>
                <td>89%</td>
              </tr>
              <tr>
                <td>2024-08-28</td>
                <td>Cybersecurity Breach Response</td>
                <td>Technology</td>
                <td>91%</td>
                <td>18:20</td>
                <td>95%</td>
              </tr>
              <tr>
                <td>2024-08-27</td>
                <td>Climate Risk Assessment</td>
                <td>Environmental</td>
                <td>85%</td>
                <td>22:15</td>
                <td>88%</td>
              </tr>
              <tr>
                <td>2024-08-26</td>
                <td>Team Communication Crisis</td>
                <td>Cultural</td>
                <td>79%</td>
                <td>25:30</td>
                <td>82%</td>
              </tr>
            </tbody>
          </DataTable>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: '#f7fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Report Insights</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Average Score:</strong> 87.2%
              </div>
              <div>
                <strong>Total Scenarios:</strong> 42
              </div>
              <div>
                <strong>Improvement Rate:</strong> +12% monthly
              </div>
              <div>
                <strong>Best Domain:</strong> Technology (91% avg)
              </div>
            </div>
          </div>
        </ReportSection>
      )}
    </AnalyticsContainer>
  );
};

export default AdvancedAnalytics;