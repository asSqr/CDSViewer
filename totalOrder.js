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
        console.log(i);

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

    console.log(lists);

    let ps = [];

    for( let i = 0; i <= n; ++i ) {
      if( i in lists ) for( let v of lists[i] )
        ps.push(v);
    }

    console.log(ps);

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

    console.log( constraints );

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

    console.log( ps );

    return new totalOrder(ps);
  }

  showSpanningTree( ctx, sx, sy, bstep = 1, step = 30, radius = 5, applyLinearMap = false, base = 2 ) {
    const n = this.p.length;

    for( let border = 0; border < n; border += bstep ) {
      let hor = {};
      
      for( let i = 0; i < border; ++i )
        hor[this.p[i+1]] = true;

      let cx = sx, cy = sy;

      ctx.fillStyle = 'rgb(40,40,40)';
      R.circle( ctx, sx, sy, radius, true );

      for( let i = 0; i < n-1; ++i ) {
        let tx = cx, ty = cy;
        
        if( hor[i] ) {
          tx += step;
        } else {
          ty -= step;

          if( applyLinearMap ) {
            tx += step;
          }
        }

        ctx.strokeStyle = 'rgb(40,40,40)';
        R.line( ctx, cx, cy, tx, ty );
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