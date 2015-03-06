'use strict';
/**
 * Created by devict on 03/01/15.
 */
var Vertex = function (x, y) {
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.element = undefined;
    this.visited = false;
};

Vertex.prototype = {
    visit: function () {
        this.visited = true;
    }
};

var StoneVertex = function (x, y) {
    Vertex.call(this, x, y);
    this.cost = 10;
};

StoneVertex.prototype = Object.create(Vertex.prototype);
StoneVertex.prototype.constructor = StoneVertex;


var GrassVertex = function (x, y) {
    Vertex.call(this, x, y);
    this.cost = 10;
};

GrassVertex.prototype = Object.create(Vertex.prototype);
GrassVertex.prototype.constructor = GrassVertex;


var WaterVertex = function (x, y) {
    Vertex.call(this, x, y);
    this.cost = 500;
};

WaterVertex.prototype = Object.create(Vertex.prototype);
WaterVertex.prototype.constructor = WaterVertex;

var WoodVertex = function (x, y) {
    Vertex.call(this, x, y);
    this.cost = 1;
};

WoodVertex.prototype = Object.create(Vertex.prototype);
WoodVertex.prototype.constructor = WoodVertex;