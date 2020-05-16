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

  // 1-indexed
  getOrder( i, j ) {
    return this.orders[i-1][j-1];
  }

  // 1-indexed
  setOrder( i, j, order, upd = true ) {
    this.orders[i-1][j-1] = order;
    
    if( upd )
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

    p.order = p.order.filter( v => p.i+p.j <= v && v < this.width+this.height );

    let qOrderMap = {};

    let qI = [];
    for( let i = q.i+q.j; i < this.width+this.height; ++i ) {
      qI.push( i );
    }

    qI.map( order => qOrderMap[order] = true );

    let contLines = [];
    let cnt = 0;

    /*console.log( p );
    console.log( q );
    console.log( p.order );
    console.log( qI );
    console.log( base );*/

    let len = p.order.length();

    if( base == 0 )
      contLines.push( 0 );

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

      layoutView[0].push( p.order[i+1] );
      //layoutView[1].push( i >= base ? q.order[i-base] : null );
    
      if( qOrderMap[p.order[i+1]] )
        ++cnt;
    }

    p = pC;
    q = qC;

    if( contLines.length == 0 )
    {
      console.error( "Error!! could not find contracting line" );
      console.error( p );
      console.error( p.order.p );
      console.error( q );
      console.error( q.order.p );
    }

    return contLines;
  }

  // Algorithm 3.1
  extendOrder() {
    for( let i = 1; i <= this.height; ++i ) for( let j = 1; j <= this.width; ++j ) if( this.getOrder(i,j) == null ) {
      const Mj = this.height+this.width-i-j;
      this.setOrder( i, j, new totalOrder((new Array(Mj)).fill(-1)), false );
      let pj = { i: i, j: j, order: this.getOrder( i, j ) };
      let P1 = [];
      let P2 = [];

      this.P.map( p => {
        (this.pointCompare( p, pj ) ? P1 : P2).push( p );
      } );

      console.log( P1 );
      //console.log( P2 );

      // alpha[i] = \alpha_{i, j}
      let alpha = new Array( P1.length + 10 );

      P1.forEach( ( pi, idx ) => {
        alpha[idx] = this.findContractingLine( pi, pj );
      } );

      // beta[l] = \beta_{l, j}
      let beta = (new Array( P2.length + 10 )).fill(0);

      console.log( alpha );
      console.log( beta );

      let D = new Set([]);
      for( let k = i+j; k < this.height+this.width; ++k )
        D.add( k );

      let L = new Set([]);
      let LMap = {};

      for( let k = 1; k <= Mj; ++k ) {
        if( P1.length == 0 )
        {
          L = D;
        }
        else
        {
          P1.forEach( ( pi, idx ) => {
            const base = pj.j-pi.j;

            if( k <= alpha[idx] )
            {
              console.log( "intersection" );
              console.log(pi);
              console.log(base);
              console.log(pi.order.smaller(base+k).p);
              console.log(D);

              LMap[idx] = D.intersection( new Set(pi.order.smaller(base+k)) );
            }
            else if( k > alpha[idx] )
            {
              console.log("equal");
              console.log(pi);
              console.log(base);
              console.log(pi.order.equal(base+k));
              console.log(D);

              if( D.has( pi.order.equal(base+k) ) )
                LMap[idx] = new Set([pi.order.equal(base+k)]), console.log("in D");
              else {
                console.log(pi);
                LMap[idx] = new Set(pi.order.larger(base+k)), console.log("not in D");
              }
            }
          } );

          let fst = true;

          for( let l in LMap )
          {
            if( fst )
            {
              L = LMap[l];

              fst = false;
            }
            else
              L = L.intersection( LMap[l] );
          }
        }

        console.log( "before L is: " );
        console.log( L );
        
        // line 18
        P2.forEach( (pl, idx) => {
          if( k <= beta[idx] )
          {
            if( pl.order.equal(k) && D.has( pl.order.equal(k) ) )
              L = new Set([pl.order.equal(k)]);
            else
            {
              let nL = new Set([]);

              console.log("count test");

              for( let l of L )
              {
                // the count test
                if( (lambda => {
                  if( !(lambda in pl.order.p) )
                    return false;

                  const a = pl.order.ip[lambda]-k;

                  const ps = this.P.filter( p => {
                    if( !(lambda in p.order.p) )
                      return false;

                    let idx = p.order.ip[lambda];

                    return k <= idx && idx < k+a;
                  } );

                  let Dk = new Set([]);
                  for( let d of D ) if( ps.every( p => k <= p.order.ip[d] && p.order.ip[d] <= k+a ) )
                    Dk.add( d );

                  return Dk.length <= a;
                })( l ) ) {
                  nL.add( l );
                }
              }

              L = nL;
            }
          }
        } );

        let a;

        console.log( "L is: " );
        console.log( L );
        console.log( "k is: ");
        console.log( k );

        if( L.size == 0 )
        {
          console.error( "Error!! L is empty." );
          console.error( pj );
          console.error( k );
          console.error( beta );
        }

        for( let l of L )
        {
          pj.order.p[k] = l;
          a = l;

          D.delete(l);

          break;
        }

        // line 25
        P2.forEach( (pl, idx) => {
          if( a in pl.order.p && k <= beta[idx] )
          {
            let x = pl.order.ip[a];

            if( x > beta[idx] )
              beta[idx] = x+1;
          }
        } );

        console.log( "beta" );
        console.log( beta );
      }

      pj.order.buildIp();
      //this.P.push( pj );
    }
  }
}