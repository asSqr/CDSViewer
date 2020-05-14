class totalOrder {
  constructor( ps ) {
    this.p = ps;

    this.ip = new Array( ps.length ).fill( null );
    ps.forEach( (pi, idx) => this.ip[pi] = idx );
  }

  filter( pred ) {
    let nps = [];

    for( let i = 0; i < this.p.length; ++i ) if( pred(this.p[i],i) )
      nps.push( this.p[i] );

    return new totalOrder(nps);
  }

  // <-(k)
  smaller( k ) {
    return this.filter( (_, i) => i < k );
  }

  // (k)
  equal( k ) {
    return this.p[k];
  }

  // ->(k)
  larger( k ) {
    return this.filter( (_, i) => i > k );
  }

  length() {
    return this.p.length;
  }
}