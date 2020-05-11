class grid {
  constructor( width, height ) {
    this.width = width;
    this.height = height;

    this.orders = (new Array( this.height )).fill( null );
    this.orders.forEach( (_, i) => this.orders[i] = (new Array( this.width )).fill( null ) );

    this.dx = [ 1, 0, -1, 0 ];
    this.dy = [ 0, 1, 0, -1 ];
    this.P = [];
  }

  safe( i, j ) {
    return i >= 0 && i < this.height && j >= 0 && j < this.width;
  }

  setOrder( i, j, order ) {
    this.orders[i][j] = order;
    this.P.push( { i: i, j: j, order: order } );
  }

  // \mathcal{O} ordering
  pointCompare( p, q ) {
    if( p.i+p.j != q.i+q.j )
      return p.i+p.j < q.i+q.j;

    return p.j < q.j;
  }

  render( ctx, x, y, w, h ) {
    const getPos = ( i, j ) => {
      const size = Math.min( w, h );

      return { x: x+size/(this.width-1)*j, y: y+size/(this.height-1)*i };
    };

    for( let i = 0; i < this.height; ++i ) for( let j = 0; j < this.width; ++j ) {
      const cp = getPos( i, j );
      
      ctx.fillStyle = 'rgb(40,40,40)';
      R.circle( ctx, cp.x, cp.y, 5, true );
    }
  }

  keyHandler() {

  }

  // p, q: { i, j, order }, return: contracting line positions
  findContractingLine( p, q ) {
    const base = q.j-p.j;

    let layoutView = new Array(2).fill([]);
    let pC = p;
    let qC = q;
    
    //console.log( p );
    //console.log( q );

    p.order = p.order.filter( v => p.i+p.j+2-1 <= v && v < this.width+this.height+2-1 );

    let qOrderMap = {};

    let qI = [];
    for( let i = q.i+q.j+2; i < this.width+this.height+2; ++i ) {
      qI.push( i-1 );
    }

    qI.map( order => qOrderMap[order] = true );

    let contLines = [];
    let cnt = 0;

    console.log( p );
    console.log( q );
    console.log( p.order.length() );
    console.log( qI );
    console.log( base );

    let len = p.order.length();

    for( let i = 0; i <= len; ++i ) {
      const k = i-base+1;

      //console.log("Test");

      //console.log(k);
      //console.log(cnt);

      if( k == cnt ) {
        contLines.push( k );
      }

      if( i == p.length )
        break;

      layoutView[0].push( p.order[i] );
      //layoutView[1].push( i >= base ? q.order[i-base] : null );
    
      if( qOrderMap[p.order[i]] )
        ++cnt;
    }

    p = pC;
    q = qC;

    return contLines;
  }

  // Algorithm 3.1
  extendOrder() {
    for( let i = 0; i < this.height; ++i ) for( let j = 0; j < this.width; ++j ) if( this.orders[i][j] == null ) {
      let pj = { i: i, j: j, order: this.orders[i][j] };
      let P1 = [];
      let P2 = [];

      this.P.map( p => {
        (this.pointCompare( p, pj ) ? P1 : P2).push( p );
      } );

      //console.log( P1 );
      //console.log( P2 );

      // alpha[i] = \alpha_{i, j}
      let alpha = new Array( P1.length + 10 );

      P1.forEach( ( pi, idx ) => {
        alpha[idx] = this.findContractingLine( pi, pj );
      } );

      console.log( alpha );

      let D = [];
      for( let k = i+j+2; k <= this.hegiht+this.width-1; ++k )
        D.push( k );

      const Mj = pj.length;

      for( let k = 0; k < Mj; ++k ) {

      }
    }
  }
}