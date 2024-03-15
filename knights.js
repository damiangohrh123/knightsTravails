class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Graph {
  constructor () {
    this.board = [];
    this.adjList = new Map();
    this.buildBoard();
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
  constructor() {

  }

  knightMoves(startNode, endNode) {

  }
}

const chessBoard = new Graph;
const knight = new Knight();
console.log(chessBoard);
