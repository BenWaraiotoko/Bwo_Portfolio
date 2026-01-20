/**
 * Knowledge Graph - Interactive visualization
 * Clean, readable graph with smart label handling
 * Uses D3.js v7
 */

class KnowledgeGraph {
  constructor(containerId, data, options = {}) {
    this.containerId = containerId;
    this.data = this.processData(data);
    this.options = {
      width: options.width || 900,
      height: options.height || 600,
      nodeRadius: options.nodeRadius || 6,
      centerNodeRadius: options.centerNodeRadius || 14,
      pageNodeRadius: options.pageNodeRadius || 10,
      contentNodeRadius: options.contentNodeRadius || 8,
      linkDistance: options.linkDistance || 80,
      chargeStrength: options.chargeStrength || -400,
      // Kanagawa colors
      colors: {
        node: options.nodeColor || '#7E9CD8',
        nodeHover: options.nodeHoverColor || '#A3D4D5',
        centerNode: options.centerNodeColor || '#E46876',
        pageNode: options.pageNodeColor || '#98BB6C',
        contentNode: options.contentNodeColor || '#7FB4CA',
        skillNode: options.skillNodeColor || '#957FB8',
        link: options.linkColor || '#54546D',
        linkHighlight: options.linkHighlightColor || '#E6C384',
        text: options.textColor || '#DCD7BA',
        textDim: options.textDimColor || '#727169',
        background: options.bgColor || '#1F1F28'
      },
      ...options
    };

    this.hoveredNode = null;
    this.isAnimating = false;
    this.init();
  }

  processData(data) {
    // Filter out low-value tags (count <= 1) to reduce clutter
    const significantTags = new Set();
    data.nodes.forEach(n => {
      if (n.category === 'skill' && n.count > 1) {
        significantTags.add(n.id);
      }
      // Always keep primary tags
      if (n.category === 'skill' && ['tag-python', 'tag-sql', 'tag-docker', 'tag-data-engineering', 'tag-automation', 'tag-infrastructure'].includes(n.id)) {
        significantTags.add(n.id);
      }
    });

    // Filter nodes
    const filteredNodes = data.nodes.filter(n => {
      if (n.category === 'skill') {
        return significantTags.has(n.id);
      }
      return true;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));

    // Filter links to only include existing nodes
    const filteredLinks = data.links.filter(l =>
      nodeIds.has(l.source) && nodeIds.has(l.target)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container #${this.containerId} not found`);
      return;
    }

    // Responsive width
    const containerRect = container.getBoundingClientRect();
    this.options.width = containerRect.width || this.options.width;

    // Clear existing content
    container.innerHTML = '';

    // Create SVG
    this.svg = d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', this.options.height)
      .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
      .style('background-color', this.options.colors.background)
      .style('border-radius', '8px');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });

    this.svg.call(zoom);

    // Main group for all elements
    this.g = this.svg.append('g');

    // Create force simulation with better spacing
    this.simulation = d3.forceSimulation(this.data.nodes)
      .force('link', d3.forceLink(this.data.links)
        .id(d => d.id)
        .distance(d => this.getLinkDistance(d)))
      .force('charge', d3.forceManyBody()
        .strength(d => this.getChargeStrength(d)))
      .force('center', d3.forceCenter(
        this.options.width / 2,
        this.options.height / 2
      ))
      .force('collision', d3.forceCollide()
        .radius(d => this.getNodeRadius(d) + 30))
      .force('x', d3.forceX(this.options.width / 2).strength(0.05))
      .force('y', d3.forceY(this.options.height / 2).strength(0.05));

    this.render();
  }

  getLinkDistance(d) {
    const source = typeof d.source === 'object' ? d.source : this.data.nodes.find(n => n.id === d.source);
    const target = typeof d.target === 'object' ? d.target : this.data.nodes.find(n => n.id === d.target);

    // Shorter distance for center connections
    if (source?.isCenter || target?.isCenter) return 100;
    // Medium for page connections
    if (source?.category === 'page' || target?.category === 'page') return 90;
    // Longer for tag-to-tag
    return 70;
  }

  getChargeStrength(d) {
    if (d.isCenter) return -600;
    if (d.category === 'page') return -400;
    if (d.category === 'post' || d.category === 'project') return -350;
    return -250;
  }

  getNodeRadius(d) {
    if (d.isCenter) return this.options.centerNodeRadius;
    if (d.category === 'page') return this.options.pageNodeRadius;
    if (d.category === 'post' || d.category === 'project') return this.options.contentNodeRadius;
    return this.options.nodeRadius;
  }

  getNodeColor(d) {
    if (d.isCenter) return this.options.colors.centerNode;
    if (d.category === 'page') return this.options.colors.pageNode;
    if (d.category === 'post' || d.category === 'project') return this.options.colors.contentNode;
    return this.options.colors.skillNode;
  }

  shouldShowLabel(d) {
    // Always show labels for important nodes
    if (d.isCenter || d.category === 'page') return true;
    if (d.category === 'post' || d.category === 'project') return true;
    // Show skill labels only if hovered or connected to hovered
    return false;
  }

  truncateLabel(label, maxLength = 25) {
    if (label.length <= maxLength) return label;
    return label.substring(0, maxLength - 1) + '…';
  }

  render() {
    // Draw links
    this.links = this.g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.data.links)
      .enter()
      .append('line')
      .attr('class', 'graph-link')
      .style('stroke', this.options.colors.link)
      .style('stroke-opacity', 0.4)
      .style('stroke-width', 1.5);

    // Draw nodes
    this.nodes = this.g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.data.nodes)
      .enter()
      .append('circle')
      .attr('class', d => `graph-node ${d.category || ''}`)
      .attr('r', d => this.getNodeRadius(d))
      .style('fill', d => this.getNodeColor(d))
      .style('stroke', this.options.colors.background)
      .style('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(this.drag())
      .on('mouseover', (event, d) => this.handleNodeHover(event, d, true))
      .on('mouseout', (event, d) => this.handleNodeHover(event, d, false))
      .on('click', (event, d) => this.handleNodeClick(event, d));

    // Draw labels - always visible for important nodes
    this.labels = this.g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.data.nodes)
      .enter()
      .append('text')
      .attr('class', d => `graph-label ${d.category || ''}`)
      .text(d => this.truncateLabel(d.label))
      .style('fill', d => this.shouldShowLabel(d) ? this.options.colors.text : 'transparent')
      .style('font-size', d => d.isCenter ? '14px' : d.category === 'page' ? '12px' : '11px')
      .style('font-weight', d => d.isCenter || d.category === 'page' ? '600' : '400')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .style('pointer-events', 'none')
      .style('text-shadow', `0 1px 3px ${this.options.colors.background}`)
      .attr('dx', d => this.getNodeRadius(d) + 6)
      .attr('dy', 4);

    // Update positions on simulation tick
    this.simulation.on('tick', () => {
      // Keep nodes within bounds
      this.data.nodes.forEach(d => {
        const r = this.getNodeRadius(d);
        d.x = Math.max(r + 50, Math.min(this.options.width - r - 50, d.x));
        d.y = Math.max(r + 20, Math.min(this.options.height - r - 20, d.y));
      });

      this.links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      this.nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      this.labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  }

  drag() {
    const dragstarted = (event, d) => {
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event, d) => {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  handleNodeHover(event, d, isHover) {
    // Prevent hover effects during animation or if simulation stopped
    if (this.isAnimating) return;

    const node = d3.select(event.target);
    this.hoveredNode = isHover ? d : null;

    if (isHover) {
      // Enlarge hovered node
      node
        .transition()
        .duration(200)
        .attr('r', this.getNodeRadius(d) * 1.4)
        .style('fill', this.options.colors.nodeHover);

      // Get connected node IDs
      const connectedIds = new Set();
      connectedIds.add(d.id);
      this.data.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (sourceId === d.id) connectedIds.add(targetId);
        if (targetId === d.id) connectedIds.add(sourceId);
      });

      // Highlight connected links
      this.links
        .transition()
        .duration(200)
        .style('stroke', link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return (sourceId === d.id || targetId === d.id)
            ? this.options.colors.linkHighlight
            : this.options.colors.link;
        })
        .style('stroke-opacity', link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return (sourceId === d.id || targetId === d.id) ? 0.9 : 0.15;
        })
        .style('stroke-width', link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return (sourceId === d.id || targetId === d.id) ? 2.5 : 1;
        });

      // Dim non-connected nodes
      this.nodes
        .transition()
        .duration(200)
        .style('opacity', n => connectedIds.has(n.id) ? 1 : 0.3);

      // Show labels for connected nodes
      this.labels
        .transition()
        .duration(200)
        .style('fill', n => {
          if (connectedIds.has(n.id)) return this.options.colors.text;
          return 'transparent';
        });

    } else {
      // Reset node
      node
        .transition()
        .duration(200)
        .attr('r', this.getNodeRadius(d))
        .style('fill', this.getNodeColor(d));

      // Reset links
      this.links
        .transition()
        .duration(200)
        .style('stroke', this.options.colors.link)
        .style('stroke-opacity', 0.4)
        .style('stroke-width', 1.5);

      // Reset nodes
      this.nodes
        .transition()
        .duration(200)
        .style('opacity', 1);

      // Reset labels
      this.labels
        .transition()
        .duration(200)
        .style('fill', n => this.shouldShowLabel(n) ? this.options.colors.text : 'transparent');
    }
  }

  handleNodeClick(event, d) {
    if (d.url) {
      window.location.href = d.url;
    }
  }

  // Resize handler
  resize() {
    const container = document.getElementById(this.containerId);
    if (container) {
      const containerRect = container.getBoundingClientRect();
      this.options.width = containerRect.width;
      this.svg.attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
      this.simulation.force('center', d3.forceCenter(
        this.options.width / 2,
        this.options.height / 2
      ));
      this.simulation.force('x', d3.forceX(this.options.width / 2).strength(0.05));
      this.simulation.alpha(0.3).restart();
    }
  }

  // Pause simulation (for theme switch)
  pause() {
    this.isAnimating = true;
    this.simulation.stop();
  }

  // Resume simulation
  resume() {
    this.isAnimating = false;
    this.simulation.alpha(0.1).restart();
  }
}

// Auto-initialize graphs with data-graph attribute
document.addEventListener('DOMContentLoaded', () => {
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.knowledgeGraph) {
        window.knowledgeGraph.resize();
      }
    }, 250);
  });
});

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KnowledgeGraph;
}
