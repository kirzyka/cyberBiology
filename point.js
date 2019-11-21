const POINT_TYPE_EMPTY = "0";
const POINT_TYPE_WALL = "X";
const POINT_TYPE_POISON = "P";
const POINT_TYPE_EAT = "E";
const POINT_TYPE_BOT = "B";

class Point {
    constructor (col, row, type) {
        this._col = col;
        this._row = row;
        this._type = type;
    }

    get col() {
        return this._col;
    }

    get row() {
        return this._row;
    }
    
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
}