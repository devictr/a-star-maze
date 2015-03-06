'use strict';
/**
 * Maze generation object
 * @param width : number of columns
 * @param height : number of rows
 * @constructor
 * @param context
 */
var MazeGenerator = function (width, height, context) {
    this.graph = new Graph(width, height, width, height);
    this.startVertex = this.graph.getVertex(0, 0); // Start with the top left cell
    this.path = [];
    this.context = context;
    this.width = width;
    this.height = height;
};

MazeGenerator.prototype = {
    generateMaze: function () {
        var vertex = this.startVertex;
        var totalVertices = this.graph.width * this.graph.height;
        var visitedVertices = 1;
        var stack = [];
        while (visitedVertices < totalVertices) {
            vertex.visit();
            var neighbors = this.graph.getUnvisitedNeighborsForVertex(vertex);
            if (neighbors.length > 0) {
                var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                stack.push(vertex);
                this.graph.addEdge(vertex, randomNeighbor);
                vertex = randomNeighbor;
                visitedVertices++;
            } else {
                vertex = stack.pop();
            }
        }
    },
    generateMap: function () {
        var newVertex;
        var riverX = Math.floor((2. / 3.) * this.graph.width + this.graph.mapWidth);
        var bridgeY = Math.floor(Math.random() * this.graph.height);
        var currentCell, neighbors, exit, exitNeighbors;
        if (this.graph.cells.length !== this.graph.width + this.graph.mapWidth) {
            for (var i = this.graph.width; i < this.graph.width + this.graph.mapWidth; i++) {
                this.graph.cells.push([]);
                for (var j = 0; j < this.graph.height; j++) {
                    newVertex = new GrassVertex(i, j);
                    this.graph.cells[i].push(newVertex);
                }
            }

            for (j = 0; j < this.graph.height; j++) {
                this.graph.cells[riverX][j] = new WaterVertex(riverX, j);
            }
            this.graph.cells[riverX][bridgeY] = new WoodVertex(riverX, bridgeY);
            for (i = this.graph.width; i < this.graph.width + this.graph.mapWidth; i++) {
                for (j = 0; j < this.graph.height; j++) {
                    currentCell = this.graph.getVertex(i, j);
                    neighbors = this.graph.getLinkedNeighborsForMapVertex(currentCell);
                    for (var k = 0; k < neighbors.length; k++) {
                        this.graph.addEdge(currentCell, neighbors[k]);
                    }
                }
            }
            exit = this.graph.getVertex(this.graph.width - 1, this.graph.height - 1);
            exitNeighbors = this.graph.getLinkedNeighborsForVertex(exit);
            for (i = 0; i < exitNeighbors.length; i++) {
                this.graph.addEdge(exit, exitNeighbors[i]);
            }
        } else {
            for (j = 0; j < this.graph.height; j++) {
                if (WoodVertex.prototype.isPrototypeOf(this.graph.cells[riverX][j])) {
                    this.graph.cells[riverX][j].__proto__ = WaterVertex.prototype;
                }
            }
            this.graph.cells[riverX][bridgeY].prototype = WoodVertex.prototype;
            exit = this.graph.getVertex(this.graph.width - 1, this.graph.height - 1);
            exitNeighbors = this.graph.getLinkedNeighborsForVertex(exit);
            for (i = 0; i < exitNeighbors.length; i++) {
                this.graph.addEdge(exit, exitNeighbors[i]);
            }
            this.graph.addEdge(exit, this.graph.getVertex(this.graph.width, this.graph.height - 1));
        }
    },
    findBFSSolution: function () {
        var start = this.graph.getVertex(0, 0);
        var frontier = [start];
        var current, neighbors;
        var goal = this.graph.getVertex(this.graph.width * 2 - 1, this.graph.height - 1);
        var cameFrom = {};
        cameFrom[hash(start)] = null;
        while (frontier.length > 0) {
            current = frontier.shift();
            if (current == goal) {
                break;
            }
            neighbors = current.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                if (!_.contains(cameFrom, neighbors[i])) {
                    frontier.push(neighbors[i]);
                    cameFrom[hash(neighbors[i])] = current;
                }
            }
        }
        current = goal;
        this.path = [current];
        while (current != start) {
            current = cameFrom[hash(current)];
            this.path.push(current);
        }
        function hash(vertex) {
            return vertex.x + " " + vertex.y;
        }
    },
    findAStarSolution: function () {
        // Start at the top left of the graph
        var start = this.graph.getVertex(0, 0);
        // We want to sort by the difference of cost between two vertices
        var frontier = new PriorityQueue({
            comparator: function (a, b) {
                return b.priority - a.priority;
            }
        });
        frontier.queue({vertex: start, priority: 0}); // Store the start vertex
        var current, neighbors, newCost;

        //The goal is the bottom right vertex
        var goal = this.graph.getVertex(this.graph.width * 2 - 1, this.graph.height - 1);
        var cameFrom = {}; // Map to keep track of the path to a vertex
        var costSoFar = {}; // Map to keep track of the cost of the path to a vertex

        cameFrom[hash(start)] = null;
        costSoFar[hash(start)] = 0;

        while (frontier.length > 0) {
            current = frontier.dequeue();
            if (current == goal) {
                break;
            }
            neighbors = current.vertex.neighbors;
            for (var i = 0; i < neighbors.length; i++) { // For each neighbor
                newCost = costSoFar[hash(current.vertex)] + current.vertex.cost; // Calculate the new cost
                if (typeof costSoFar[hash(neighbors[i])] === 'undefined'
                    || newCost < costSoFar[hash(neighbors[i])]) { // If the cost is inferior or if we do not have it
                    costSoFar[hash(neighbors[i])] = newCost; // Add/update the cost in the map
                    // Enqueue the neighbor
                    frontier.queue({vertex: neighbors[i], priority: newCost + heurisitic(goal, neighbors[i])});
                    cameFrom[hash(neighbors[i])] = current.vertex; // Update the path to this vertex
                }
            }
        }
        /*
        Reconstruction of the path to the goal
         */
        current = goal;
        this.path = [current];
        while (current != start) {
            current = cameFrom[hash(current)];
            this.path.push(current);
        }
        /*
        Heuristic function (distance between two points)
         */
        function heurisitic(a, b) {
            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        }
        /*
        Hash function used to hash vertices in a JS object
         */
        function hash(vertex) {
            return vertex.x + " " + vertex.y;
        }
    },
    findDijkstraSolution: function () {
        var start = this.graph.getVertex(0, 0);
        var frontier = new PriorityQueue({
            comparator: function (a, b) {
                return b.priority - a.priority;
            }
        });
        frontier.queue({vertex: start, priority: 0});
        var current, neighbors, newCost;
        var goal = this.graph.getVertex(this.graph.width - 1, this.graph.height - 1);
        var cameFrom = {};
        var costSoFar = {};
        cameFrom[hash(start)] = null;
        costSoFar[hash(start)] = 0;
        while (frontier.length > 0) {
            current = frontier.dequeue();
            if (current == goal) {
                break;
            }
            neighbors = current.vertex.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                newCost = costSoFar[hash(current.vertex)] + current.vertex.cost;
                if (typeof costSoFar[hash(neighbors[i])] === 'undefined'
                    || newCost < costSoFar[hash(neighbors[i])]) {
                    costSoFar[hash(neighbors[i])] = newCost;
                    frontier.queue({vertex: neighbors[i], priority: newCost});
                    cameFrom[hash(neighbors[i])] = current.vertex;
                }
            }
        }
        current = goal;
        this.path = [current];
        while (current != start) {
            current = cameFrom[hash(current)];
            this.path.push(current);
        }

        function hash(vertex) {
            return vertex.x + " " + vertex.y;
        }
    },
    benchmark: function () {
        var start, end, time;
        var times = [];
        for (var i = 0; i < 1000; i++) {
            this.graph.initVertices();
            this.startVertex = this.graph.getVertex(0, 0); // Start with the top left cell
            this.generateMaze();
            start = performance.now();
            this.findAStarSolution();
            end = performance.now();
            time = end - start;
            times.push(time.toString().replace(".", ","));
        }
        $("#vals").html(times.join("\n"));
    },
    benchmarkWholeMap: function () {
        var start, end, time;
        var times = [];
        for (var i = 0; i < 1000; i++) {
            this.graph.initVertices();
            this.startVertex = this.graph.getVertex(0, 0); // Start with the top left cell
            this.generateMaze();
            this.generateMap();
            start = performance.now();
            this.findAStarSolution();
            end = performance.now();
            time = end - start;
            times.push(time.toString().replace(".", ","));
        }
        $("#vals").html(times.join("\n"));
    }
};