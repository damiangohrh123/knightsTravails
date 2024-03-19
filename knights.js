class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Graph {
  constructor () {
    this.board = this.buildBoard();
    this.adjList = this.buildAdjList();
  }

  buildBoard() {
    let board = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        board.push(new Node(j, i));
      }
    }
    return board;
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
    let adjList = new Map();
    const possibleMoves = [
      [1, 2], [2, 1], [2, -1], [1, -2],
      [-1, -2], [-2, -1], [-2, 1], [-1, 2]
    ];

    for (const node of this.board) {
      const dxdyNodes = [];

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

      adjList.set(node, dxdyNodes);
    }

    return adjList;
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

class UI {
  constructor(knight) {
    this.buildChessBoard();

    // Access the the Knight class to call knightMoves
    this.knight = knight;

    // The knight position and count
    this.createKnight(3, 3);
    this.knightPos;
  }

  buildChessBoard() {
    const chessboardContainer = document.querySelector(".chessboard");
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        chessboardContainer.append(this.createSquare(i, j));
      }
    }
  }

  createSquare(x, y) {
    const square = document.createElement("div");

    // Add alternate colors to squares 
    const squareClass = ((x + y) % 2 === 0) ? "squareWhite" : "squareBlack";
    square.classList.add("chessboardSquare", squareClass);

    // Add unique ID to each square
    square.id = `${x}${y}`;

    // Add click event listener to each square
    square.addEventListener("click", () => {
      if (this.knightPos[0] !== x || this.knightPos[1] !== y) {
        this.selectEndSquare([x, y]);
        this.updateKnight(x, y);
      }
    });
    return square;
  }

  createKnight(x, y) {
    // Create img element and set image path
    const img = document.createElement("img");
    img.src = "./knight.webp";
    img.classList.add("knightImg");

    // Append img to knight container
    const knightContainer = document.createElement("div");
    knightContainer.classList.add("knightContainer");
    knightContainer.append(img);

    // Get the square which was clicked and append it to the square
    const square = document.getElementById(`${x}${y}`);
    this.knightPos = [x, y];
    square.append(knightContainer);
  }

  updateKnight(x, y) {
    // Remove current knight
    const knightContainer = document.querySelector(".knight");
    if (knightContainer) knightContainer.remove();

    // Create new knight at updated position
    this.createKnight(x, y);
  }

  selectEndSquare(end) {
    // Remove previous movement squares
    const movementSquares = document.querySelectorAll(".movementSquare");
    movementSquares.forEach(square => {
      square.classList.remove("movementSquare");
      square.textContent = "";
    });

    // Find all the moves for the knight from current pos to end pos
    const moves = this.knight.knightMoves(this.knightPos, end);

    // Highlight all the moves
    moves.forEach((move, index) => {
      const square = document.getElementById(`${move.x}${move.y}`);
      square.classList.add("movementSquare");
      square.textContent = (index === 0) ? "Start" : index;
    })
  }
}

// Knight and board logic
const chessBoard = new Graph;
const knight = new Knight(chessBoard.adjList);

// Create UI object
const UIElements = new UI(knight);

