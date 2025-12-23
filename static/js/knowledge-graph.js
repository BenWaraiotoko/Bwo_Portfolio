/**
 * Knowledge Graph - Interactive visualization
 * Style inspired by ssp.sh (Second Brain)
 * Uses D3.js v7
 */

class KnowledgeGraph {
  constructor(containerId, data, options = {}) {
    this.containerId = containerId;
    this.data = data;
    this.options = {
      width: options.width || 800,
      height: options.height || 500,
      nodeRadius: options.nodeRadius || 8,
      centerNodeRadius: options.centerNodeRadius || 12,
      linkDistance: options.linkDistance || 120,
      chargeStrength: options.chargeStrength || -300,
      // Kanagawa colors
      colors: {
        node: options.nodeColor || '#7E9CD8',
        nodeHover: options.nodeHoverColor || '#A3D4D5',
        centerNode: options.centerNodeColor || '#E46876',
        link: options.linkColor || '#E6C384',
        text: options.textColor || '#C8C093',
        background: options.bgColor || '#16161D'
      },
      ...options
    };
    
    this.init();
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
      .style('border-radius', '6px');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });

    this.svg.call(zoom);

    // Main group for all elements
    this.g = this.svg.append('g');

    // Create force simulation
    this.simulation = d3.forceSimulation(this.data.nodes)
      .force('link', d3.forceLink(this.data.links)
        .id(d => d.id)
        .distance(this.options.linkDistance))
      .force('charge', d3.forceManyBody()
        .strength(this.options.chargeStrength))
      .force('center', d3.forceCenter(
        this.options.width / 2,
        this.options.height / 2
      ))
      .force('collision', d3.forceCollide()
        .radius(d => this.getNodeRadius(d) + 20));

    this.render();
  }

  getNodeRadius(d) {
    return d.isCenter ? this.options.centerNodeRadius : this.options.nodeRadius;
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
      .style('stroke-opacity', 0.6)
      .style('stroke-width', 2);

    // Draw nodes
    this.nodes = this.g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.data.nodes)
      .enter()
      .append('circle')
      .attr('class', d => `graph-node ${d.isCenter ? 'center' : ''}`)
      .attr('r', d => this.getNodeRadius(d))
      .style('fill', d => d.isCenter ? this.options.colors.centerNode : this.options.colors.node)
      .style('stroke', this.options.colors.background)
      .style('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(this.drag())
      .on('mouseover', (event, d) => this.handleNodeHover(event, d, true))
      .on('mouseout', (event, d) => this.handleNodeHover(event, d, false))
      .on('click', (event, d) => this.handleNodeClick(event, d));

    // Draw labels
    this.labels = this.g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.data.nodes)
      .enter()
      .append('text')
      .attr('class', 'graph-label')
      .text(d => d.label)
      .style('fill', this.options.colors.text)
      .style('font-size', '12px')
      .style('font-family', 'Inter, sans-serif')
      .style('pointer-events', 'none')
      .attr('dx', d => this.getNodeRadius(d) + 5)
      .attr('dy', 4);

    // Update positions on simulation tick
    this.simulation.on('tick', () => {
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
    const node = d3.select(event.target);
    
    if (isHover) {
      node
        .transition()
        .duration(200)
        .attr('r', this.getNodeRadius(d) * 1.3)
        .style('fill', this.options.colors.nodeHover);
      
      // Highlight connected links
      this.links
        .style('stroke-opacity', link => 
          link.source.id === d.id || link.target.id === d.id ? 1 : 0.2
        )
        .style('stroke-width', link =>
          link.source.id === d.id || link.target.id === d.id ? 3 : 2
        );
    } else {
      node
        .transition()
        .duration(200)
        .attr('r', this.getNodeRadius(d))
        .style('fill', d.isCenter ? this.options.colors.centerNode : this.options.colors.node);
      
      // Reset links
      this.links
        .style('stroke-opacity', 0.6)
        .style('stroke-width', 2);
    }
  }

  handleNodeClick(event, d) {
    if (d.url) {
      window.location.href = d.url;
    }
  }

  // Add a new node dynamically
  addNode(node) {
    this.data.nodes.push(node);
    this.simulation.nodes(this.data.nodes);
    this.render();
  }

  // Add a new link dynamically
  addLink(link) {
    this.data.links.push(link);
    this.simulation.force('link').links(this.data.links);
    this.render();
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
      this.simulation.alpha(0.3).restart();
    }
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
