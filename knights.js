class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Graph {
  constructor () {
    // Board
    this.board = [];
    this.buildBoard();

    // Adjacency list
    this.adjList = new Map();
    this.buildAdjList();
  }

  buildBoard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.board.push(new Node(j, i));
      }
    }
  }

  // Returns a node based on row and col input
  findNode(x, y) {
    for (const node of this.board) {
      if (node.x === x && node.y === y) {
        return node;
      }
    }
    return null; // Return null if node is not found
  }

  buildAdjList() {
    const possibleMoves = [
      [1, 2], [2, 1], [2, -1], [1, -2],
      [-1, -2], [-2, -1], [-2, 1], [-1, 2]
    ];

    for (const node of this.board) {
      const dxdyNodes =[];

      for (const [x, y] of possibleMoves) {
        // Calculate the possible moves from the node
        let dx = node.x + x;
        let dy = node.y + y;

        // Make sure node is within the bounds of the board
        if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7) {
          // Find the node then push into dxdyNode
          const dxdyNode = this.findNode(dx, dy);
          dxdyNodes.push(dxdyNode);
        }
      }
      this.adjList.set(node, dxdyNodes);
    }
  }
}

class Knight {
  constructor(adjList) {
    this.adjList = adjList;
  }

  knightMoves(start, end) {
    // Convert startNode and endNode input from array to Node object
    const startNode = chessBoard.findNode(start[0], start[1]);
    const endNode = chessBoard.findNode(end[0], end[1]);

    let queue = [startNode];
    
    // Keep track of visited nodes
    let visitedNodes = new Map().set(startNode, true);

    // Map to keep track of parents. Used to create the shortest path back
    let parentMap = new Map().set(startNode, null);
    
    while (queue.length > 0) {
      // Dequeue node from queue
      let currentNode = queue.shift();

      // Check if current node is the end node
      if (currentNode === endNode) {
        const shortestPath = [];
        let node = endNode;

        // Trace back from end node to start node
        while (node !== startNode) {
          shortestPath.unshift(node);
          node = parentMap.get(node);
        }
        shortestPath.unshift(startNode);

        return shortestPath;
      }

      // Explore the child nodes (adjList)
      for (const childNode of this.adjList.get(currentNode)) {

        // If child node has not been visited, enqueue it and push to visited nodes. Then create parentMap.
        if (!visitedNodes.has(childNode)) {
          queue.push(childNode);
          visitedNodes.set(childNode, true);
          parentMap.set(childNode, currentNode);
        }
      }
    }
  }
}

const chessBoard = new Graph;
const knight = new Knight(chessBoard.adjList);
console.log(knight.knightMoves([3, 3], [1, 5]));
