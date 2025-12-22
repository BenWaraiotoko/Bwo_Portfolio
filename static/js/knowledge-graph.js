/**
 * Knowledge Graph - Graphe interactif D3.js
 * Style Kanagawa comme ssp.sh
 */

// Couleurs Kanagawa
const colors = {
  bg: '#1F1F28',
  node: '#7FB4CA',        // Cyan pour nœuds normaux
  nodeCentral: '#E46876', // Rose corail pour nœud central
  link: '#E6C384',        // Doré pour les liens
  text: '#DCD7BA',        // Crème pour le texte
  hover: '#7E9CD8'        // Bleu au survol
};

// Initialisation du graphe
async function initKnowledgeGraph(containerId = 'knowledge-graph') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return;
  }

  // Dimensions
  const width = container.clientWidth || 800;
  const height = Math.max(600, window.innerHeight * 0.7);

  // Chargement des données
  let data;
  try {
    const response = await fetch('/data/graph.json');
    data = await response.json();
  } catch (error) {
    console.error('Erreur chargement graph.json:', error);
    container.innerHTML = '<p style="color: #E46876;">Erreur de chargement du graphe.</p>';
    return;
  }

  // Création du SVG
  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('background-color', colors.bg);

  // Conteneur pour zoom/pan
  const g = svg.append('g');

  // Simulation de forces
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links)
      .id(d => d.id)
      .distance(120))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(50));

  // Liens
  const link = g.append('g')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke', colors.link)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.6);

  // Nœuds
  const node = g.append('g')
    .selectAll('g')
    .data(data.nodes)
    .enter()
    .append('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // Cercles des nœuds
  node.append('circle')
    .attr('r', d => d.central ? 20 : 15)
    .attr('fill', d => d.central ? colors.nodeCentral : colors.node)
    .attr('stroke', colors.text)
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d.central ? 24 : 18)
        .attr('fill', colors.hover);
      
      // Afficher tooltip
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(`<strong>${d.label}</strong><br/>${d.description || d.category}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d.central ? 20 : 15)
        .attr('fill', d.central ? colors.nodeCentral : colors.node);
      
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    })
    .on('click', (event, d) => {
      if (d.url) {
        window.location.href = d.url;
      }
    });

  // Labels des nœuds
  node.append('text')
    .text(d => d.label)
    .attr('x', 0)
    .attr('y', d => d.central ? 35 : 30)
    .attr('text-anchor', 'middle')
    .attr('fill', colors.text)
    .attr('font-size', d => d.central ? '14px' : '12px')
    .attr('font-weight', d => d.central ? 'bold' : 'normal')
    .style('pointer-events', 'none')
    .style('user-select', 'none');

  // Tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class', 'graph-tooltip')
    .style('position', 'absolute')
    .style('background-color', colors.bg)
    .style('color', colors.text)
    .style('padding', '10px')
    .style('border', `1px solid ${colors.nodeCentral}`)
    .style('border-radius', '6px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('z-index', '1000')
    .style('font-size', '12px')
    .style('box-shadow', '0 4px 12px rgba(0,0,0,0.5)');

  // Zoom et pan
  const zoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Animation de la simulation
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // Fonctions de drag
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // Responsive
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = Math.max(600, window.innerHeight * 0.7);
    svg.attr('width', newWidth).attr('height', newHeight);
    simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
    simulation.alpha(0.3).restart();
  });
}

// Auto-initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('knowledge-graph')) {
    // Chargement de D3.js si pas déjà chargé
    if (typeof d3 === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
      script.onload = () => initKnowledgeGraph();
      document.head.appendChild(script);
    } else {
      initKnowledgeGraph();
    }
  }
});