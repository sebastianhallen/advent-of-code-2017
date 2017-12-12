const fs = require('fs');
const sample = buildGraph(`0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`.split('\n').map(parse));

function parse(line) {
  const parsed = /^(\d+) \<-\> ([0-9, ]+)$/.exec(line)
  return {
    id: `${parseInt(parsed[1], 10)}`,
    connections: parsed[2].split(', ').map(i => `${parseInt(i, 10)}`),
  };
}

function buildGraph(tunnels) {
  const unconnectedGraph = tunnels.reduce((graph, tunnel) => {
    graph[tunnel.id] = { id: tunnel.id, connections: [] };
    return graph;
  }, {});

  return tunnels.reduce((graph, tunnel) => {
    tunnel.connections.forEach(connection => connect(graph, tunnel.id, connection));

    return graph;
  }, unconnectedGraph);
}

function span(graph, startPoint) {
  const visited = [];
  const next = [ graph[startPoint] ];

  while(next.length > 0) {
    const current = next.pop();
  
    if (!visited.includes(current.id)) {
      visited.push(current.id);
      const candidates = current.connections;

      candidates.forEach(candidate => {
        if (!next.includes(candidate.id) && !visited.includes(candidate.id)) {
          next.push(candidate);
        }
      });
    }
  }

  return visited;
}

function connect(graph, self, other) {
  if (!hasConnectionTo(graph, self, other)) {
    graph[self].connections.push(graph[other]);
  }
  if (!hasConnectionTo(graph, other, self)) {
    graph[other].connections.push(graph[self]);
  }
}

function hasConnectionTo(graph, self, other) {
  return graph[self].connections.filter(connection => connection.id === other).length;
}

function solve(graph, startPoint) {
  return span(graph, startPoint); 
}

const answer = span(sample, '0');
console.log(answer);
console.log(answer.length);

fs.readFile('day12.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  const graph = buildGraph(input);
  const subgraph = span(graph, '0');
  console.log(subgraph.length);
});
