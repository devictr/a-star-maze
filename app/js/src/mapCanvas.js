/**
 * Created by devict on 08/01/15.
 */
var MapCanvas = function (graph, rows, cols) {
    "use strict";
    this.canvas = document.getElementById("maze");
    this.width = this.canvas.width / 2;
    this.height = this.canvas.height;
    this.rows = 40 || rows;
    this.cols = 40 || cols;
    this.cellWidth = (this.width / (this.cols));
    this.cellHeight = this.height / (this.rows);
    this.context = this.canvas.getContext('2d');
    this.mazeGenerator = new MazeGenerator(this.cols, this.rows, this.context);
};

MapCanvas.prototype = {
    generate: function () {
        "use strict";
        this.mazeGenerator.generateMaze();
        this.mazeGenerator.generateMap();
    },
    solve: function() {
        "use strict";
        this.mazeGenerator.findAStarSolution();
        //this.mazeGenerator.findDijkstraSolution();

        this.drawSolution();
    },
    draw: function () {
        "use strict";
        this.context.strokeStyle = "rgb(139, 174, 133)";
        this.context.fillStyle = "rgb(100, 100, 100)";
        this.context.globalAlpha = 1;
        this.context.lineWidth = 10;
        this.drawBorders();
        this.drawMaze();
        this.context.globalAlpha = 0.1;
        this.fillMaze();
        this.drawMap();

    },
    drawBorders: function () {
        "use strict";
        this.drawLine(this.width, 0, this.width, this.height);
        this.drawLine(0, 0, this.width, 0);
        this.drawLine(0, this.height, 0, 0);
        this.drawLine(this.width, this.height, 0, this.height);
    },
    drawLine: function (x1, y1, x2, y2) {
        "use strict";
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    },
    drawMap: function () {
        "use strict";
        this.context.clearRect(this.width, 0, this.cellWidth * this.width, this.cellHeight * this.height);
        this.context.globalAlpha = 1;
        var graph = this.mazeGenerator.graph;
        var currentCell;
        for (var i = graph.width; i < graph.width + graph.mapWidth; i++) {
            for (var j = 0; j < graph.height; j++) {
                currentCell = graph.getVertex(i, j);
                if (GrassVertex.prototype.isPrototypeOf(currentCell)) {
                    this.context.fillStyle = "rgb(167, 208, 159)";
                }
                else if (WaterVertex.prototype.isPrototypeOf(currentCell)) {
                    this.context.fillStyle = "rgb(115, 190, 241)";
                }
                else if (WoodVertex.prototype.isPrototypeOf(currentCell)) {
                    this.context.fillStyle = "rgb(140, 108, 83)";
                }
                this.context.fillRect(currentCell.x * this.cellWidth, currentCell.y * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
    },
    drawMaze: function () {
        "use strict";
        var graph = this.mazeGenerator.graph;
        var drawnEdges = [];

        function isDrawn(cell1, cell2) {
            return _.find(drawnEdges, function (edge) {
                    return _.contains(edge, cell1) && _.contains(edge, cell2);
                }) != undefined;
        }

        for (var i = 0; i < graph.width; i++) {
            for (var j = 0; j < graph.height; j++) {
                var cell = graph.cells[i][j];
                var topCell = graph.getVertex(cell.x, cell.y - 1);
                var leftCell = graph.getVertex(cell.x - 1, cell.y);
                var rightCell = graph.getVertex(cell.x + 1, cell.y);
                var bottomCell = graph.getVertex(cell.x, cell.y + 1);
                var x1, x2, y1, y2;
                if (!isDrawn(cell, topCell) && !graph.areLinked(cell, topCell)) {
                    x1 = cell.x * this.cellWidth;
                    y1 = cell.y * this.cellHeight;
                    x2 = x1 + this.cellWidth;
                    y2 = y1;

                    this.drawLine(x1, y1, x2, y2);
                    drawnEdges.push([cell, topCell]);
                }

                if (!isDrawn(cell, leftCell) && !graph.areLinked(cell, leftCell)) {
                    x2 = x1;
                    y2 = y1 + this.cellHeight;

                    this.drawLine(x1, y1, x2, y2);
                    drawnEdges.push([cell, leftCell]);
                }

                if (!isDrawn(cell, rightCell) && !graph.areLinked(cell, rightCell)) {
                    x1 = (cell.x * this.cellWidth) + this.cellWidth;
                    y1 = cell.y * this.cellHeight;
                    x2 = x1;
                    y2 = y1 + this.cellHeight;

                    this.drawLine(x1, y1, x2, y2);
                    drawnEdges.push([cell, rightCell]);
                }

                if (!isDrawn(cell, bottomCell) && !graph.areLinked(cell, bottomCell)) {
                    x1 = cell.x * this.cellWidth;
                    y1 = (cell.y * this.cellHeight) + this.cellHeight;
                    x2 = x1 + this.cellWidth;
                    y2 = y1;

                    this.drawLine(x1, y1, x2, y2);
                    drawnEdges.push([cell, bottomCell]);
                }
            }
        }
        this.context.clearRect(this.width - this.cellWidth, this.height - this.cellHeight, 100, 100);
    },
    fillMaze: function () {
        "use strict";
        var graph = this.mazeGenerator.graph;
        for (var i = 0; i < graph.width; i++) {
            for (var j = 0; j < graph.height; j++) {
                this.context.fillRect(graph.getVertex(i, j).x * this.cellWidth, graph.getVertex(i, j).y * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
    },
    drawSolution: function() {
        "use strict";
        var graph = this.mazeGenerator.graph;
        var path = this.mazeGenerator.path;
        var self = this;
        for (var i = 0; i < path.length; i++) {
            this.context.fillStyle = "#E7101B";
            this.context.globalAlpha = 0.2;
            var x = path[i].x * this.cellWidth;
            var y = path[i].y * this.cellWidth;
            setTimeout(function (x, y) {
                return function() {
                    self.context.fillRect(x, y, self.cellWidth, self.cellHeight);
                };
            }(x, y), 5 * i);
        }
    },
    benchmark: function() {
        "use strict";
        this.mazeGenerator.benchmark();
    }
};