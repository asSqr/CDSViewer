Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

Set.prototype.isSubset = function(superset) {
    for (var elem of this) {
        if (!superset.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.deleteElement = function(x) {
    let ret = new Set([]);

    for( let v of this ) if( v != x ) {
        ret.add( v );
    }

    return ret;
}

Set.prototype.eqSet = (bs) => {
    if (this.size !== bs.size) return false;
    for (var a of this) if (!bs.has(a)) return false;
    return true;
}

function isArray (item) {
    return Object.prototype.toString.call(item) === '[object Array]';
}

function isObject (item) {
    return typeof item === 'object' && item !== null && !isArray(item);
}

const deepClone = obj => {
    let r = {}
    for(var name in obj){
        console.log(obj[name])
        if(isObject(obj[name])){
            r[name] = deepClone(obj[name])
        }else{
            r[name] = obj[name]
        }
    }
    return r
}