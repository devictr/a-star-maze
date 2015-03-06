'use strict';
/**
 * Created by devict on 03/01/15.
 */
var MazeHandler = function (mazeElementId, rows, cols) {
    this.element = $("#" + mazeElementId);
    this.width = this.element.width;
    this.height = this.element.height;
    this.rows = 5 || rows;
    this.cols = 5 || cols;
    this.mazeGenerator = new MazeGenerator(this.cols, this.rows);
};

MazeHandler.prototype = {
    generate: function () {
        this.mazeGenerator.startGeneration();
    },
    draw: function () {
        var graph = this.mazeGenerator.graph;
        this.element.empty();
        this.element.append($('<table>'));
        var tableRow;
        var currentCell;
        for (var i = 0; i < graph.width; i++) {
            tableRow = $('<tr>').appendTo(this.element.children("table"));
            for (var j = 0; j < graph.height; j++) {
                currentCell = graph.getVertex(i, j);
                var classes = {
                    rightWall: "right-wall",
                    leftWall: "left-wall",
                    topWall: "top-wall",
                    bottomWall: "bottom-wall"
                };
                for (var k = 0; k < currentCell.neighbors.length; k++) {
                    if (currentCell.neighbors[k].x == (currentCell.x + 1) && currentCell.neighbors[k].y == currentCell.y) {
                        delete classes.rightWall;
                    }
                    if (currentCell.neighbors[k].x == (currentCell.x - 1) && currentCell.neighbors[k].y == currentCell.y) {
                        delete classes.leftWall;
                    }
                    if (currentCell.neighbors[k].x == currentCell.x && currentCell.neighbors[k].y == (currentCell.y + 1)) {
                        delete classes.bottomWall;
                    }
                    if (currentCell.neighbors[k].x == currentCell.x && currentCell.neighbors[k].y == (currentCell.y - 1)) {
                        delete classes.topWall;
                    }
                }
                var classesString = "";
                for (var property in classes) {
                    if (classes.hasOwnProperty(property)) {
                        classesString += classes[property] + " ";
                    }
                }
                tableRow.append(currentCell.element.addClass(classesString));
            }
        }
    }
};