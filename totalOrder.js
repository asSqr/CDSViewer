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

  const rotate = (ys, N) => {
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