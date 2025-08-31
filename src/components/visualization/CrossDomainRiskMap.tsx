import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { Network, Filter, ZoomIn, ZoomOut, RotateCw, Eye, EyeOff } from 'lucide-react';

const VisualizationContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  position: relative;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.isActive ? '#667eea' : '#e2e8f0'};
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#4a5568'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;

  &:hover {
    border-color: #667eea;
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    border-color: #667eea;
  }
`;

const NetworkGraph = styled.div`
  width: 100%;
  height: 600px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
`;

const Legend = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  max-width: 250px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

const ColorDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const InfoPanel = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  max-width: 300px;
  transform: translateY(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease;
`;

const HeatmapContainer = styled.div`
  margin-top: 2rem;
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  margin-top: 1rem;
`;

const HeatmapCell = styled.div<{ intensity: number }>`
  aspect-ratio: 1;
  border-radius: 4px;
  background: ${props => {
    const opacity = props.intensity / 100;
    return `rgba(231, 76, 60, ${opacity})`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${props => props.intensity > 50 ? 'white' : '#2d3748'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FlowChart = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

interface RiskNode {
  id: string;
  title: string;
  domain: string;
  severity: number;
  probability: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface RiskLink {
  source: string;
  target: string;
  strength: number;
  type: 'causes' | 'amplifies' | 'triggers' | 'mitigates';
}

const riskNodes: RiskNode[] = [
  { id: 'fin-1', title: 'Market Volatility', domain: 'financial', severity: 85, probability: 70 },
  { id: 'fin-2', title: 'Currency Risk', domain: 'financial', severity: 60, probability: 80 },
  { id: 'ops-1', title: 'Supply Chain Disruption', domain: 'operational', severity: 90, probability: 45 },
  { id: 'ops-2', title: 'System Downtime', domain: 'operational', severity: 75, probability: 30 },
  { id: 'tech-1', title: 'Cybersecurity Breach', domain: 'technological', severity: 95, probability: 25 },
  { id: 'tech-2', title: 'Legacy System Failure', domain: 'technological', severity: 70, probability: 60 },
  { id: 'env-1', title: 'Climate Change Impact', domain: 'environmental', severity: 80, probability: 90 },
  { id: 'env-2', title: 'Regulatory Changes', domain: 'environmental', severity: 55, probability: 70 },
  { id: 'cul-1', title: 'Talent Shortage', domain: 'cultural', severity: 65, probability: 85 },
  { id: 'cul-2', title: 'Cultural Misalignment', domain: 'cultural', severity: 50, probability: 40 },
  { id: 'pol-1', title: 'Policy Changes', domain: 'political', severity: 75, probability: 55 },
  { id: 'pol-2', title: 'Trade War Escalation', domain: 'political', severity: 85, probability: 35 }
];

const riskLinks: RiskLink[] = [
  { source: 'fin-1', target: 'ops-1', strength: 0.8, type: 'amplifies' },
  { source: 'fin-1', target: 'cul-1', strength: 0.6, type: 'causes' },
  { source: 'ops-1', target: 'fin-2', strength: 0.7, type: 'triggers' },
  { source: 'tech-1', target: 'ops-2', strength: 0.9, type: 'causes' },
  { source: 'tech-1', target: 'fin-1', strength: 0.5, type: 'amplifies' },
  { source: 'env-1', target: 'ops-1', strength: 0.7, type: 'causes' },
  { source: 'env-1', target: 'pol-1', strength: 0.6, type: 'triggers' },
  { source: 'pol-1', target: 'fin-1', strength: 0.8, type: 'amplifies' },
  { source: 'pol-2', target: 'ops-1', strength: 0.9, type: 'causes' },
  { source: 'cul-1', target: 'tech-2', strength: 0.4, type: 'amplifies' },
  { source: 'cul-2', target: 'ops-2', strength: 0.3, type: 'causes' }
];

const domainColors = {
  financial: '#e74c3c',
  operational: '#f39c12',
  technological: '#3498db',
  environmental: '#27ae60',
  cultural: '#9b59b6',
  political: '#e67e22'
};

const domains = Object.keys(domainColors) as Array<keyof typeof domainColors>;

const CrossDomainRiskMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(domains);
  const [selectedNode, setSelectedNode] = useState<RiskNode | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [viewMode, setViewMode] = useState<'network' | 'heatmap' | 'flow'>('network');

  useEffect(() => {
    if (!svgRef.current || viewMode !== 'network') return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Filter nodes and links based on selected domains
    const filteredNodes = riskNodes.filter(node => selectedDomains.includes(node.domain));
    const filteredLinks = riskLinks.filter(link => 
      filteredNodes.some(node => node.id === link.source) &&
      filteredNodes.some(node => node.id === link.target)
    );

    const simulation = d3.forceSimulation(filteredNodes as any)
      .force('link', d3.forceLink(filteredLinks).id((d: any) => d.id).strength(d => (d as RiskLink).strength))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const g = svg.append('g');

    // Create arrow markers for directed edges
    const defs = svg.append('defs');
    
    Object.entries(domainColors).forEach(([domain, color]) => {
      defs.append('marker')
        .attr('id', `arrowhead-${domain}`)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', color)
        .style('stroke', 'none');
    });

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .join('line')
      .attr('stroke', d => {
        const sourceNode = filteredNodes.find(n => n.id === d.source);
        return sourceNode ? domainColors[sourceNode.domain as keyof typeof domainColors] : '#999';
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength * 10))
      .attr('marker-end', d => {
        const sourceNode = filteredNodes.find(n => n.id === d.source);
        return sourceNode ? `url(#arrowhead-${sourceNode.domain})` : '';
      });

    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(filteredNodes)
      .join('circle')
      .attr('r', d => 8 + (d.severity / 100) * 12)
      .attr('fill', d => domainColors[d.domain as keyof typeof domainColors])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 8 + (d.severity / 100) * 16);
        
        // Highlight connected links
        link.style('stroke-opacity', l => 
          (l.source === d.id || l.target === d.id) ? 1 : 0.1
        );
      })
      .on('mouseout', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 8 + (d.severity / 100) * 12);
        link.style('stroke-opacity', 0.6);
      });

    // Add drag behavior
    node.call(
      d3.drag<any, RiskNode>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = undefined;
          d.fy = undefined;
        }) as any
    );

    // Add labels
    const label = g.append('g')
      .selectAll('text')
      .data(filteredNodes)
      .join('text')
      .text(d => d.title)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dy', -20)
      .attr('fill', '#2d3748')
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

  }, [selectedDomains, viewMode]);

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const generateHeatmapData = () => {
    const matrix = domains.map((sourceDomain, i) => 
      domains.map((targetDomain, j) => {
        if (i === j) return { intensity: 0, label: `${sourceDomain}-${targetDomain}` };
        
        const connections = riskLinks.filter(link => {
          const sourceNode = riskNodes.find(n => n.id === link.source);
          const targetNode = riskNodes.find(n => n.id === link.target);
          return sourceNode?.domain === sourceDomain && targetNode?.domain === targetDomain;
        });
        
        const intensity = connections.reduce((sum, link) => sum + (link.strength * 100), 0);
        return { intensity: Math.min(intensity, 100), label: `${sourceDomain}-${targetDomain}` };
      })
    );
    return matrix;
  };

  return (
    <VisualizationContainer>
      <h2>Cross-Domain Risk Visualization</h2>
      <p>Interactive network showing risk interconnections across different domains</p>

      <ControlPanel>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Network size={20} />
          <span>View Mode:</span>
          <FilterGroup>
            <FilterButton 
              isActive={viewMode === 'network'} 
              onClick={() => setViewMode('network')}
            >
              Network
            </FilterButton>
            <FilterButton 
              isActive={viewMode === 'heatmap'} 
              onClick={() => setViewMode('heatmap')}
            >
              Heatmap
            </FilterButton>
            <FilterButton 
              isActive={viewMode === 'flow'} 
              onClick={() => setViewMode('flow')}
            >
              Flow Chart
            </FilterButton>
          </FilterGroup>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={16} />
          <span>Domains:</span>
          <FilterGroup>
            {domains.map(domain => (
              <FilterButton
                key={domain}
                isActive={selectedDomains.includes(domain)}
                onClick={() => toggleDomain(domain)}
              >
                {domain}
              </FilterButton>
            ))}
          </FilterGroup>
        </div>

        <ViewControls>
          <ControlButton onClick={() => setShowLegend(!showLegend)}>
            {showLegend ? <EyeOff size={16} /> : <Eye size={16} />}
          </ControlButton>
          <ControlButton onClick={() => window.location.reload()}>
            <RotateCw size={16} />
          </ControlButton>
        </ViewControls>
      </ControlPanel>

      {viewMode === 'network' && (
        <NetworkGraph>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
          />
          
          {showLegend && (
            <Legend>
              <h4 style={{ margin: '0 0 1rem 0' }}>Risk Domains</h4>
              {domains.map(domain => (
                <LegendItem key={domain}>
                  <ColorDot color={domainColors[domain]} />
                  <span style={{ textTransform: 'capitalize' }}>{domain}</span>
                </LegendItem>
              ))}
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: '0 0 0.5rem 0' }}>Node Size = Severity</h5>
                <h5 style={{ margin: '0 0 0.5rem 0' }}>Link Width = Strength</h5>
                <h5 style={{ margin: '0' }}>Arrows = Causation</h5>
              </div>
            </Legend>
          )}

          <InfoPanel isVisible={selectedNode !== null}>
            {selectedNode && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{selectedNode.title}</h4>
                <p style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize' }}>
                  Domain: {selectedNode.domain}
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  Severity: {selectedNode.severity}/100
                </p>
                <p style={{ margin: '0' }}>
                  Probability: {selectedNode.probability}%
                </p>
                <button
                  onClick={() => setSelectedNode(null)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </InfoPanel>
        </NetworkGraph>
      )}

      {viewMode === 'heatmap' && (
        <HeatmapContainer>
          <h3>Cross-Domain Risk Impact Matrix</h3>
          <p>Intensity shows how risks in one domain affect another</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
            <div></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', textAlign: 'center' }}>
              {domains.map(domain => (
                <div key={domain} style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {domain.slice(0, 3)}
                </div>
              ))}
            </div>
            
            {generateHeatmapData().map((row, i) => (
              <React.Fragment key={i}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {domains[i].slice(0, 3)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                  {row.map((cell, j) => (
                    <HeatmapCell
                      key={j}
                      intensity={cell.intensity}
                      title={`${domains[i]} → ${domains[j]}: ${cell.intensity.toFixed(1)}%`}
                    >
                      {cell.intensity > 20 ? Math.round(cell.intensity) : ''}
                    </HeatmapCell>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </HeatmapContainer>
      )}

      {viewMode === 'flow' && (
        <FlowChart>
          <h3>Risk Cascade Flow Analysis</h3>
          <p>How risks propagate through different domains over time</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h4>Initial Triggers</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {riskNodes.filter(n => n.domain === 'environmental' || n.domain === 'political').map(risk => (
                  <div 
                    key={risk.id}
                    style={{
                      padding: '1rem',
                      background: domainColors[risk.domain as keyof typeof domainColors],
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {risk.title}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4>Amplification Stage</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {riskNodes.filter(n => n.domain === 'financial' || n.domain === 'operational').map(risk => (
                  <div 
                    key={risk.id}
                    style={{
                      padding: '1rem',
                      background: domainColors[risk.domain as keyof typeof domainColors],
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {risk.title}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4>Final Impact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {riskNodes.filter(n => n.domain === 'technological' || n.domain === 'cultural').map(risk => (
                  <div 
                    key={risk.id}
                    style={{
                      padding: '1rem',
                      background: domainColors[risk.domain as keyof typeof domainColors],
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {risk.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#f7fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4>Key Insights</h4>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>Environmental risks often trigger political responses</li>
              <li>Political changes cascade into financial market volatility</li>
              <li>Financial stress amplifies operational challenges</li>
              <li>Operational failures impact technology and culture domains</li>
            </ul>
          </div>
        </FlowChart>
      )}
    </VisualizationContainer>
  );
};

export default CrossDomainRiskMap;