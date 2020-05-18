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