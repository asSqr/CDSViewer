class totalOrder {
  // 1-indexed
  constructor( ps ) {
    if( ps.every( v => v == -1 ) ) {
      this.p = [null].concat(ps);
      this.ip = {};

      return;
    }

    let nps = [].concat(ps);
    nps.unshift(null);
    this.p = nps;

    this.ip = {};
    this.p.map( (pi, idx) => {
      if( pi != null )
        this.ip[pi] = idx;
    } );
  }

  buildIp() {
    this.ip = {};
    this.p.map( (pi, idx) => {
      if( pi != null )
        this.ip[pi] = idx;
    } );
  }

  inv() {
    let nps = new Array(this.p.length-1);

    for( let i = 1; i < this.p.length; ++i ) {
      nps[this.p[i]] = i-1;
    }

    return new totalOrder(nps);
  }

  filter( pred ) {
    let nps = [];

    for( let i = 0; i < this.p.length; ++i ) if( this.p[i] != null && pred(this.p[i],i) )
      nps.push( this.p[i] );

    return new totalOrder(nps);
  }

  // <-(k)
  smaller( k ) {
    return this.filter( (x, i) => i <= k && x != null ).p.filter( x => x != null );
  }

  // (k)
  equal( k ) {
    return this.p[k];
  }

  // ->(k)
  larger( k ) {
    return this.filter( (x, i) => i >= k && x != null ).p.filter( x => x != null );
  }

  length() {
    return this.p.length;
  }

  twice( border ) {
    const n = this.p.length-1;
    let lists = {};

    for( let i = 0; i <= n; ++i )
      lists[i] = [];

    this.buildIp();

    let pair = {};

    for( let i = 0; i < n; ++i ) {
      const a = this.ip[i];
      const b = this.ip[i+1];

      if( a <= border && border < b ) {
        //console.log(i);

        pair[i] = pair[i+1] = true;

        lists[a] = lists[a].concat([2*i+1, 2*i+3]);
        lists[b] = lists[b].concat([2*i, 2*i+2]);
      }
    }

    for( let i = 0; i < n; ++i ) {
      if( pair[i] == undefined ) {
        let a = this.ip[i];
        lists[a] = lists[a].concat([2*i, 2*i+1]);
      }
    }

    //console.log(lists);

    let ps = [];

    for( let i = 0; i <= n; ++i ) {
      if( i in lists ) for( let v of lists[i] )
        ps.push(v);
    }

    //console.log(ps);

    return new totalOrder(ps);
  }

  twice2() {
    const n = this.p.length;

    let constraints = [];

    this.buildIp();

    for( let border = 0; border < n; ++border ) {
      let leftS = new Set([]);

      for( let i = 0; i < n-1; ++i ) {
        let a = this.ip[i];
        let b = this.ip[i+1];

        // right-up
        if( a <= border && border < b ) {
          leftS.add( 2*i );
          leftS.add( 2*i+2 );
          ++i;
        }
        /*let l = 0;

        // right-up
        while( i+l+1 < n && a <= border && border < b ) {
          ++l;
          
          if( l&1 )
            a = this.ip[i+l+1];
          else
            b = this.ip[i+l+1];
        }

        console.log( "border: ", border, "l: ", l );

        if( l ) {
          let acc = 0;
          let y = Math.floor(l/2);
          let x = l-y;
          
          let p = 2*i;

          while( p < 2*l ) {
            acc += y;

            leftS.add( p );
            ++p;

            if( acc >= x ) {
              acc -= x;
              ++p;
            }
          }
        }
        // up-right
        /*else if( b <= border && border < a ) {
          leftS.add( 2*i+1 );
          leftS.add( 2*i+3 );
          ++i;
        }*/ else {
          if( this.ip[i] <= border ) {
            leftS.add( 2*i );
            leftS.add( 2*i+1 );
          }
        }

        //i += l;
      }

      constraints.push( { border: border, leftS: leftS } );
    }

    //console.log( constraints );

    let ps = new Array(n*2-2);

    for( let i = 0; i < constraints.length-1; ++i ) {
      if( constraints[i].leftS.size && !constraints[i].leftS.isSubset( constraints[i+1].leftS ) ) {
        console.error( "[twice2] Subset Property violated." );
        console.error( constraints[i].leftS );
        console.error( constraints[i+1].leftS );
        console.error( constraints[i].border );
        console.error( constraints[i+1].border );

        return;
      }

      let p = constraints[i].border*2;

      for( let v of constraints[i+1].leftS.difference( constraints[i].leftS ) ) {
        ps[p] = v;
        ++p;
      }
    }

    //console.log( ps );

    return new totalOrder(ps);
  }

  showSpanningTree( ctx, sx, sy, bstep = 1, step = 30, radius = 5, showLine = false, stressSplit = false, showRedLine = false, applyLinearMap = false, base = 2 ) {
    const n = this.p.length;

    let memObj = {};

    ctx.lineWidth = 3;

    for( let border = 0; border < n; border += bstep ) {
      let hor = {};
      
      for( let i = 0; i < border; ++i )
        hor[this.p[i+1]] = true;

      let cx = sx, cy = sy;

      ctx.fillStyle = 'rgb(40,40,40)';
      R.circle( ctx, sx, sy, radius, true );

      for( let i = 0; i < n-1; ++i ) {
        let tx = cx, ty = cy;

        const j = (tx-sx)/step;
        const key = i+" "+j;

        if( !memObj[key] ) {
          memObj[key] = {};
        }

        memObj[key][hor[i] ? 'hor' : 'ver'] = true;
        
        if( hor[i] ) {
          tx += step;
        } else {
          ty -= step;

          if( applyLinearMap ) {
            tx += step;
          }
        }

        ctx.strokeStyle = ctx.fillStyle = 'rgb(40,40,40)';

        //if( stressSplit && i == n-3 )
          //ctx.strokeStyle = ctx.fillStyle = 'rgb(240,200,0)';

        R.line( ctx, cx, cy, tx, ty );
        
        ctx.strokeStyle = ctx.fillStyle = 'rgb(40,40,40)';
        
        R.circle( ctx, tx, ty, radius, true );

        cx = tx;
        cy = ty;
      }
    }

    if( applyLinearMap ) {
      let x = sx;

      for( let i = 0; i < n; ++i ) {
        ctx.strokeStyle = 'rgb(40, 40, 40, 0.2)';
        R.line( ctx, x, sy+step, x, sy-step*n );
        R.string( ctx, x+5, sy+step, i );

        x += step;
      }

      for( let i = 1; i < base; ++i ) {
        ctx.strokeStyle = 'rgb(255,0,0)';
        R.line( ctx, sx, sy, sx+step*n, sy-step/base*n*i );
      }
    } else if( showRedLine ) {
      for( let i = 0; i <= n; ++i ) {
        ctx.strokeStyle = 'rgb(255,0,0)';
        R.line( ctx, sx, sy, sx+step*(n-i), sy-step*i );
      }
    } else if( showLine ) {
      for( let i = 0; i < n-1; ++i ) {
        ctx.strokeStyle = 'rgb(40,40,40)';
        R.line( ctx, sx+step*i, sy, sx, sy-step*i );
      }
    }

    //console.log(memObj);

    if( stressSplit ) {
      for( let i = 0; i < n-1; ++i ) {
        for( let j = 0; j <= i; ++j ) {
          const key = i+" "+j;

          if( memObj[key]['hor'] && memObj[key]['ver'] ) {
            ctx.strokeStyle = ctx.fillStyle = 'rgb(240,200,0)';
            R.circle( ctx, sx+step*j, sy-step*(i-j), radius*1.2, true );
          }
        }
      }
    }
  }
}

function CorbettRotator( n )
{
  function rotator( N ) {
    if( N == 2 )
      return [2];

    const rs = rotator(N-1);

    let xs = [];
    const ns = (new Array(N-1)).fill(N);

    for( let r of rs ) {
      xs = xs.concat(ns);
      xs.push( N+1-r );
    }

    xs = xs.concat(ns);

    return xs;
  }

  const rotate = ( ys, N ) => {
    let xs = [].concat(ys);
    const head = xs.shift();

    let ret = xs.splice( 0, N-1 ).concat([head]);

    return ret.concat( xs );
  }

  const rotatorList = rotator( n );

  let ps = [];
  let p = [];

  for( let i = n; i >= 1; --i )
    p.push( i );

  ps.push( p );

  for( let r of rotatorList ) {
    p = rotate( p, r );
    ps.push( p );
  }

  return ps;
}

// JavaScript Array permutation generator
// (optimized from CoffeeScript output: see ArrayPermutation.coffee)
(function() {
  var generatePermutation = function(perm, pre, post, n) {
    var elem, i, rest, len;
    if (n > 0)
      for (i = 0, len = post.length; i < len; ++i) {
        rest = post.slice(0);
        elem = rest.splice(i, 1);
        generatePermutation(perm, pre.concat(elem), rest, n - 1);
      }
    else
      perm.push(pre);
  };

  /*
  extend Array.prototype
  e.g. [0, 1, 2].permutation(2)
  => [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]
  */
  Array.prototype.permutation = function(n) {
    if (n == null) n = this.length;
    var perm = [];
    generatePermutation(perm, [], this, n);
    return perm;
  };
})();

const sz = 4;
let vs = [];

for( let i = 0; i < sz; ++i ) {
  vs.push((new Array(i+1)).fill([]));
}

// F weak CDR
vs[0][0] = [0,1];
vs[0][1] = [0,1];
vs[1][0] = [0];
vs[2][0] = [0];
vs[1][1] = [0,1];
vs[0][2] = [1];
vs[3][0] = [0,1];
vs[2][1] = [1];
vs[1][2] = [];
vs[0][3] = [0,1];

let stressPath = [
  { i: 0, j: 0, d: 1 },
  { i: 0, j: 1, d: 1 },
  { i: 0, j: 2, d: 1 },
  { i: 0, j: 3, d: 0 }
];

function drawSpanningTreeFromList(vs, ctx, sx, sy, bstep = 1, step = 30, radius = 5, stress = false) {
  ctx.lineWidth = 3;

  for( let i = 0; i < sz; ++i ) {
    ctx.strokeStyle = 'rgb(40,40,40)';
    R.line( ctx, sx+i*step, sy, sx, sy-i*step );
  }

  for( let i = 0; i <= sz; ++i ) for( let j = 0; j <= sz; ++j ) {
    if( i+j > sz )
      continue;

    const cx = sx+step*j;
    const cy = sy-step*i;
    let col = 'rgb(40,40,40)';

    if( i+j < sz ) {
      const len = vs[i][j].length;

      if( !len || len == 2 )
        col = len ? 'rgb(0,0,255)' : 'rgb(255,0,0)';

      ctx.strokeStyle = 'rgb(40,40,40)';
      
      for( let k = 0; k < len; ++k ) {
        let tx, ty;

        if( !vs[i][j][k] )
          tx = cx, ty = cy-step;
        else
          tx = cx+step, ty = cy;
        
        if( stress ) for( let stress of stressPath ) {
          if( stress.i == i && stress.j == j && stress.d == vs[i][j][k] ) {
            ctx.strokeStyle = 'rgb(240,200,0)';
            break;
          } else {
            ctx.strokeStyle = 'rgb(40,40,40)';
          }
        }

        R.line( ctx, cx, cy, tx, ty );
      }
    }

    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    R.circle( ctx, cx, cy, radius, true );
  }
}