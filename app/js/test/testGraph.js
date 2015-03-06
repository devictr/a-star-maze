"use strict";
/**
 * Created by devict on 04/01/15.
 */
describe("graph", function () {
    "use strict";
    var graph;
    var SIZE = 20;

    beforeEach(function () {
        graph = new Graph(SIZE, SIZE);
    });

    describe('constructor', function () {
        it('should initialize a two dimensional array with cells', function () {
            for (var i = 0; i < SIZE; i++) {
                for (var j = 0; j < SIZE; j++) {
                    var cell = graph.cells[i][j];
                    expect(cell.x).toEqual(i);
                    expect(cell.y).toEqual(j);
                }
            }
        });
    });

    describe('getVertex', function () {
        it('should return a Vertex object', function () {
            var cell = graph.getVertex(5, 5);
            expect(Vertex.prototype.isPrototypeOf(cell)).toBeTruthy();
        });
        it('should not return a Vertex outside of the graph', function () {
            var cell = graph.getVertex(-1, -1);
            expect(cell).toBeNull();
        });
    });

    describe('getNeighboorsForTopLeftCell', function () {
        it('should return an array of two neighbors of type MazeWallVertex (no diagonal mouvement)', function () {
            var neighbors = graph.getInitialNeighborsForVertex(graph.getVertex(0, 0));
            expect(neighbors.length).toEqual(2);
            expect(MazeWallVertex.prototype.isPrototypeOf(neighbors[0])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(neighbors[1])).toBeTruthy();
        });
        it('should return an array of four neighbors of type MazeWallVertex (no diagonal mouvement)', function () {
            var neighbors = graph.getInitialNeighborsForVertex(graph.getVertex(5, 5));
            expect(neighbors.length).toEqual(4);
            expect(MazeWallVertex.prototype.isPrototypeOf(neighbors[0])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(neighbors[1])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(neighbors[2])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(neighbors[3])).toBeTruthy();
        });
    });

    describe('linked/unlinked Cells', function () {
        it('should return false for two MazeWallVertex objects (walls aren\'t linked)', function () {
            var cell1 = graph.getVertex(0, 0);
            var cell2 = graph.getVertex(1, 0);
            expect(graph.areLinked(cell1, cell2)).toBeFalsy();
        });
        it('should return true for two StoneVertex objects (floor cells are linked)', function () {
            var cell1 = new StoneVertex(0, 0);
            var cell2 = new StoneVertex(0, 1);
            expect(graph.areLinked(cell1, cell2)).toBeTruthy();
        });
        it('should return false for one StoneVertex and one MazeWallVertex (unlinked)', function () {
            var cell1 = new StoneVertex(0, 0);
            var cell2 = new MazeWallVertex(0, 1);
            expect(graph.areLinked(cell1, cell2)).toBeFalsy();
        });
    });

    describe('unlinked neighbors for a Vertex object', function () {
        it('should return an array of two MazeWallVertex objects for the top left cell', function () {
            var cell = graph.getVertex(0, 0);
            var unlinkedNeighbors = graph.getLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(2);
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[0])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[1])).toBeTruthy();
        });
        it('should return an array of four Cells even if they have been visited', function () {
            var cell = graph.getVertex(5, 5);
            graph.getVertex(4, 5).visit();
            graph.getVertex(6, 5).visit();
            graph.getVertex(5, 4).visit();
            graph.getVertex(5, 6).visit();
            var unlinkedNeighbors = graph.getLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(4);
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[0])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[1])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[2])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[3])).toBeTruthy();
        });
        it('should return two Cells if two of the neighbors are not walls', function () {
            var cell = graph.getVertex(5, 5);
            graph.getVertex(5, 5).__proto__ = StoneVertex.prototype;
            graph.getVertex(4, 5).__proto__ = StoneVertex.prototype;
            graph.getVertex(6, 5).__proto__ = StoneVertex.prototype;
            graph.getVertex(5, 6).visit();
            console.log(graph.areLinked(graph.getVertex(5, 5), graph.getVertex(6, 5)));
            var unlinkedNeighbors = graph.getLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(2);
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[0])).toBeTruthy();
            expect(MazeWallVertex.prototype.isPrototypeOf(unlinkedNeighbors[1])).toBeTruthy();
        });
    });

    describe('unvisited unlinked neighbors for a Vertex object', function () {
        it('should return an array of two MazeWallVertex objects for the top left cell', function () {
            var cell = graph.getVertex(0, 0);
            var unlinkedNeighbors = graph.getUnvisitedLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(2);
        });
        it('should return an empty array for the top left cell, having its neighbors visited', function () {
            var cell = graph.getVertex(0, 0);
            graph.getVertex(1, 0).visit();
            graph.getVertex(0, 1).visit();
            var unlinkedNeighbors = graph.getUnvisitedLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(0);
        });
        it('should return an array of 3 cells', function () {
            var cell = graph.getVertex(5, 5);
            graph.getVertex(5, 4).visit();
            var unlinkedNeighbors = graph.getUnvisitedLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(3);
        });
        it('should return an array of 2 cells', function () {
            var cell = graph.getVertex(5, 5);
            graph.getVertex(5, 4).visit();
            graph.getVertex(5, 5).__proto__ = StoneVertex.prototype;
            graph.getVertex(4, 5).__proto__ = StoneVertex.prototype;
            var unlinkedNeighbors = graph.getUnvisitedLinkedNeighborsForVertex(cell);
            expect(unlinkedNeighbors.length).toEqual(2);
        });
    });


});