'use strict';

/**
 * Created by devict on 03/01/15.
 * @param mazeWidth
 * @param mazeHeight
 * @param mapWidth
 * @param mapHeight
 */
var Graph = function (mazeWidth, mazeHeight, mapWidth, mapHeight) {
    this.width = mazeWidth;
    this.height = mazeHeight;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.cells = [];
    var self = this;
    /*
     Initialize graph with cells
     */
    this.initVertices();
};

Graph.prototype = {
    initVertices: function () {
        if (this.cells.length  == 0) {
            var newVertex;
            for (var i = 0; i < this.height; i++) {
                this.cells.push([]);
                for (var j = 0; j < this.width; j++) {
                    newVertex = new StoneVertex(i, j);
                    this.cells[i].push(newVertex);
                }
            }
        }else {
            for (i = 0; i < this.height; i++) {
                for (j = 0; j < this.width; j++) {
                    this.cells[i][j].neighbors = [];
                    this.cells[i][j].visited = false;
                }
            }
        }
    },
    /**
     *
     * @param i
     * @param j
     * @returns {Vertex}
     */
    getVertex: function (i, j) {
        var vertex;
        try {
            vertex = this.cells[i][j];
        } catch (e) {
            vertex = null;
        }
        if (typeof vertex === 'undefined') vertex = null;
        return vertex;
    }
    ,
    /**
     * Returns all neighbors of a vertex that are unlinked and have not been
     * visited
     * @param vertex
     * @returns {*|Array.<Vertex>}
     */
    getUnvisitedLinkedNeighborsForVertex: function (vertex) {
        return this.getLinkedNeighborsForVertex(vertex).filter(function (element) {
            return !element.visited;
        });
    }
    ,
    /**
     * Returns all neighbors of a vertex that are unlinked and have not been
     * visited
     * @param vertex
     * @returns {*|Array.<Vertex>}
     */
    getUnvisitedNeighborsForVertex: function (vertex) {
        return this.getInitialNeighborsForVertex(vertex).filter(function (element) {
            return !element.visited;
        });
    }
    ,
    /**
     * Returns all the neighbors of a vertex that don't form
     * a path with it
     * @returns {*|Array.<Vertex>}
     */
    getLinkedNeighborsForVertex: function (vertex) {
        var self = this;
        return self.getInitialNeighborsForVertex(vertex).filter(function (element) {
            return !self.areLinked(vertex, element);
        });
    }
    ,
    getLinkedNeighborsForMapVertex: function (vertex) {
        var self = this;
        return self.getInitialNeighborsForVertex(vertex).filter(function (element) {
            return !self.areLinked(vertex, element) && element.x > (self.width - 1);
        });
    }
    ,
    /**
     * Returns all the neighbors of a vertex that don't form
     * a path with it
     * @returns {*|Array.<Vertex>}
     */
    getUnLinkedNeighborsForVertex: function (vertex) {
        var self = this;
        return self.getInitialNeighborsForVertex(vertex).filter(function (element) {
            return self.areLinked(vertex, element);
        });
    }
    ,
    /**
     * Returns true if the vertices are linked with an edge,
     * false otherwise
     * @param vertex1
     * @param vertex2
     * @returns {boolean}
     */
    areLinked: function (vertex1, vertex2) {
        if (vertex1 === null || vertex2 === null) return false;
        return _.contains(vertex1.neighbors, vertex2) || _.contains(vertex2.neighbors, vertex1);
    }
    ,

    addEdge: function (vertex1, vertex2) {
        vertex1.neighbors.push(vertex2);
        vertex2.neighbors.push(vertex1);
    }
    ,

    /**
     * Returns all the neighbors of a vertex if the grid is fully linked
     * @param vertex
     * @returns {*|Array.<Vertex>}
     */
    getInitialNeighborsForVertex: function (vertex) {
        var neighbors = [];
        var topVertex = this.getVertex(vertex.x, vertex.y - 1);
        var rightVertex = this.getVertex(vertex.x + 1, vertex.y);
        var leftVertex = this.getVertex(vertex.x - 1, vertex.y);
        var bottomVertex = this.getVertex(vertex.x, vertex.y + 1);

        if (vertex.y > 0 && topVertex) {
            neighbors.push(topVertex);
        }
        if (vertex.x < this.width && rightVertex) {
            neighbors.push(rightVertex);
        }
        if (vertex.y < this.height && bottomVertex) {
            neighbors.push(bottomVertex);
        }
        if (vertex.x > 0 && leftVertex) {
            neighbors.push(leftVertex);
        }

        return neighbors;
    }
}
;