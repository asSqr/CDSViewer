class grid {
  constructor( width, height ) {
    this.width = width;
    this.height = height;

    this.orders = {};
    this.used = {};

    for( let i = 1; i <= this.height; ++i ) for( let j = 1; j <= this.width; ++j ) {
      this.orders[i+","+j] = new totalOrder( (new Array(this.width+this.height-i-j)).fill(-1) );
      this.used[i+","+j] = false;
    }

    this.dx = [ 1, 0, -1, 0 ];
    this.dy = [ 0, 1, 0, -1 ];
    this.P = [];

    this.ptr = 0;
    this.endPoints = [];
  }

  safe( i, j ) {
    return i >= 0 && i < this.height && j >= 0 && j < this.width;
  }

  // 1-indexed
  getOrder( i, j ) {
    return this.orders[i+","+j];
  }

  // 1-indexed
  setOrder( i, j, argOrder, upd = true ) {
    this.orders[i+","+j] = argOrder;
    
    if( upd )
      this.P.push( { i: i, j: j, order: argOrder } );

    this.used[i+","+j] = true;
  }

  // \mathcal{O} ordering
  pointCompare( p, q ) {
    if( p.i+p.j != q.i+q.j )
      return p.i+p.j < q.i+q.j;

    return p.j < q.j;
  }

  getPos( i, j ) {
    i = i-1;
    j = j-1;
    const size = Math.min( this.w, this.h );
    i = this.height-1-i;

    return { x: this.x+size/(this.width-1)*j, y: this.y+size/(this.height-1)*i };
  }

  render( ctx, x, y, w, h ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    for( let i = 1; i <= this.height; ++i ) for( let j = 1; j <= this.width; ++j ) {
      const cp = this.getPos( i, j );
      
      ctx.fillStyle = 'rgb(40,40,40)';
      R.circle( ctx, cp.x, cp.y, 5, true );
    }
  }

  renderCDS( ctx ) {
    if( this.endPoints.length == 2 ) {
      let ci = this.endPoints[0].i, cj = this.endPoints[0].j;
      let gi = this.endPoints[1].i, gj = this.endPoints[1].j;

      let ord = this.getOrder( ci, cj ).p.filter( v => ci+cj <= v && v < gi+gj );
      let horizontalFlags = {};

      ord.forEach( (v, i) => horizontalFlags[v] = (i < gj-cj) );

      let cnt = 0;

      const drawLine = ( fi, fj, ti, tj ) => {
        const cCp = this.getPos(fi,fj), nCp = this.getPos(ti,tj);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(40,40,40)';
        R.line( ctx, cCp.x, cCp.y, nCp.x, nCp.y );
      };

      while( ci != gi && cj != gj ) {
        let ni, nj;

        if( horizontalFlags[ci+cj] ) {
          ni = ci, nj = cj+1;

          drawLine(ci,cj,ni,nj);
        }
        else {
          ni = ci+1, nj = cj;

          drawLine(ci,cj,ni,nj);
        }

        ci = ni;
        cj = nj;

        ++cnt;

        if( cnt >= 50 )
          break;
      }

      drawLine(ci,cj,gi,gj);
    }
  }

  keyHandler() {
    
  }

  setMousePos( x, y ) {
    this.mouseX = x;
    this.mouseY = y;
  }

  mouseButtonHandler() {
    for( let i = 1; i <= this.height; ++i ) for( let j = 1; j <= this.width; ++j ) {
      const cp = this.getPos( i, j );
      
      if( Math.sqrt((cp.x-this.mouseX)*(cp.x-this.mouseX)+(cp.y-this.mouseY)*(cp.y-this.mouseY)) <= 10.0 ) {
        this.endPoints[this.ptr] = { i: i, j: j, cp: cp };
        this.ptr = (this.ptr+1)%2;

        if( this.ptr == 0 && !(this.endPoints[0].i <= this.endPoints[1].i && this.endPoints[0].j <= this.endPoints[1].j) ) {
          this.endPoints = [];
        }
      }
    }
  }

  // p, q: { i, j, order }, return: contracting line positions
  findContractingLine( p, q ) {
    const base = q.j-p.j;

    let layoutView = new Array(2).fill([]);
    
    logInfo( p );
    logInfo( q );

    const pOrder = p.order.filter( v => p.i+p.j <= v && v < this.width+this.height );

    let qOrderMap = {};

    let qI = [];
    for( let i = q.i+q.j; i < this.width+this.height; ++i ) {
      qI.push( i );
    }

    qI.map( order => qOrderMap[order] = true );

    let contLines = [];
    let cnt = 0;

    /*logInfo( p );
    logInfo( q );
    logInfo( p.order );
    logInfo( qI );
    logInfo( base );*/

    let len = pOrder.length();

    if( base <= 0 )
      contLines.push( 0 );

    for( let i = 1; i <= len+base; ++i ) {
      const k = i-base;

      //logError("Test");

      if( qOrderMap[pOrder.p[i]] )
        ++cnt;

      /*logError(k);
      logError(cnt);
      logError( qOrderMap );
      logError( pOrder );
      logError( pOrder.p[i] );
      logError( base );*/

      if( k == cnt ) {
        contLines.push( k );
        /*logError( "contLines" );
        logError( contLines );*/
      }

      if( i == p.length )
        break;

      layoutView[0].push( pOrder.p[i] );
      //layoutView[1].push( i >= base ? q.order[i-base] : null );
    }

    if( contLines.length == 0 )
    {
      logError( "Error!!! could not find contracting line." );
      logError( p );
      logError( p.order.p );
      logError( q );
      logError( q.order.p );
    }

    return contLines;
  }

  contractionPropertyCheck() {
    let ps = [].concat(this.P);
    ps.sort( this.pointCompare );

    for( let i = 0; i < ps.length; ++i ) for( let j = 0; j < i; ++j )
    {
      const conts = this.findContractingLine( ps[i], ps[j] );

      /*logError( "Comparing: " );
      logError( ps[i] );
      logError( ps[j] );
      logError( conts );*/

      const base = ps[j].j-ps[i].j;

      const fl = conts.some( k => {
        const psI = ps[i].order.filter( v => ps[i].i+ps[i].j <= v && v < this.width+this.height );
        const psJ = ps[j].order.filter( v => ps[j].i+ps[j].j <= v && v < this.width+this.height );

        //logError( psI );
        //logError( psJ );

        return psI.p.every( x => {
          if( !(x in psJ) )
            return true;
          
          const kPrime = psI.ip[x]+base;
          const kPrime2 = psJ.ip[x];

          return kPrime2 <= k ? kPrime <= kPrime2 : kPrime >= kPrime2;
        });
      });

      if( !fl ) {
        logError( `violated: ${JSON.stringify(ps[i])} and ${JSON.stringify(ps[j])}` );

        return false;
      }
    }

    return true;
  }

  // Algorithm 3.1
  extendOrder() {
    logInfo(this);

    for( let i = 1; i <= this.height; ++i ) for( let j = 1; j <= this.width; ++j ) if( !this.used[i+","+j] ) {    
      if( i == 3 && j == 3 )
        debug = true;
      else
        debug = true;
      
      const Mj = this.height+this.width-i-j;
      this.used[i+","+j] = true;
      logInfo(this.orders);
      logInfo( "i: "+i+" j: "+j );
      logInfo("Initialization");
      logInfo( this.getOrder(i,j) );
      let pj = { i: i, j: j, order: this.getOrder( i, j ) };
      let P1 = [];
      let P2 = [];

      this.P.map( p => {
        (this.pointCompare( p, pj ) ? P1 : P2).push( p );
      } );

      logInfo( "P1: " );
      logInfo( P1 );
      logInfo( "P2: " );
      logInfo( P2 );

      // alpha[i] = \alpha_{i, j}
      let alpha = new Array( P1.length + 10 );

      P1.forEach( ( pi, idx ) => {
        const contLines = this.findContractingLine( pi, pj );
        alpha[idx] = contLines[0];
      } );

      // beta[l] = \beta_{l, j}
      let beta = new Array( P2.length + 10 );

      P2.forEach( ( pl, idx ) => {
        beta[idx] = pl.j-pj.j+1;
      } );

      logInfo("alpha");
      logInfo( alpha );
      logInfo( beta );

      let D = new Set([]);
      for( let k = pj.i+pj.j; k < this.height+this.width; ++k )
        D.add( k );

      for( let k = 1; k <= Mj; ++k ) {
        let L = new Set([]);
        let LMap = {};

        if( P1.length == 0 )
          L = D, logError(`Error!!! L is empty. whole D: ${toList(D)}`);
        else {
          P1.forEach( ( pi, idx ) => {
            const base = pj.j-pi.j;
            let equalList = -1;
            const pIOrder = pi.order.filter( v => pi.i+pi.j <= v && v < this.height+this.width );

            logInfo( `P1 loop: pi: ${JSON.stringify(pi)}, k: ${k}, alpha: ${alpha[idx]}, base: ${base}, pIOrder: ${JSON.stringify(pIOrder)}` );

            if( k <= alpha[idx] )
            {
              logInfo( "intersection" );
              logInfo(pi);
              logInfo(base);
              logInfo(pIOrder.smaller(base+k).p);
              logInfo(D);

              const smallerList = pIOrder.smaller(base+k);

              LMap[idx] = D.intersection( new Set(smallerList) );

              if( smallerList.length == 0 ) {
                logError( `Error!!! smallerList is empty. D: ${toList(D)}, smallerList: ${JSON.stringify(smallerList)}, base+k-1: ${base+k-1}, k: ${k}, pj: ${JSON.stringify(pj)}, pi.order: ${JSON.stringify(pi)}` );
              }

              // subset property check
              for( let key in LMap ) {
                if( !LMap[key].isSubset( LMap[idx] ) && !LMap[idx].isSubset( LMap[key] ) ) {
                  logError( "Error!!! Subset Property of Left Sets is violated." );
                }
              }
            }
            else if( k > alpha[idx] )
            {
              logInfo("equal");
              logInfo(pi);
              logInfo(base);
              logInfo(pIOrder.equal(base+k));
              logInfo(D);
              logInfo(pj);

              const largerList = pIOrder.larger(base+k);
              const smallerList = pIOrder.smaller(base+k-1);

              if( largerList.length == 0 ) {
                logError( `Error!!! largerList is empty. D: ${toList(D)}, smallerList: ${JSON.stringify(smallerList)}, largerSet: ${JSON.stringify(largerList)}, base+k-1: ${base+k-1}, k: ${k}, pj: ${JSON.stringify(pj)}, pi.order: ${JSON.stringify(pi)}` );
              }

              // smallerList is already placed check
              if( D.intersection( new Set(smallerList) ).size != 0 ) {
                logError( `Error!!! smallerList violated. D: ${toList(D)}, smallerList: ${JSON.stringify(smallerList)}, largerSet: ${JSON.stringify(largerList)}, base+k-1: ${base+k-1}, k: ${k}, pj: ${JSON.stringify(pj)}, pi.order: ${JSON.stringify(pi)}, alpha[idx]: ${alpha[idx]}` );
              }

              // Not Left Sets Property Check
              if( D.eqSet( new Set(largerList) ) ) {
                logError( "Error!!! Property of Not Left Sets is violated." );
                logError( largerList );
                logError( D );
                logError( pj );
                logError( k );
                logError( pIOrder );
              }

              if( D.has( pIOrder.equal(base+k) ) )
              {
                LMap[idx] = new Set([pIOrder.equal(base+k)]), logInfo("in D");
              
                if( equalList == -1 )
                  equalList = pIOrder.equal(base+k);
                else if( pIOrder.equal(base+k) != equalList )
                {
                  // Equal List is same check.
                  logError( "Error!!! Equal List Property is violated." );
                }
              }
              else {
                logInfo(pi);
                LMap[idx] = D.intersection( new Set(largerList) ), logInfo("not in D");
              }
            }
          } );

          let fst = true;

          //logError(`Error!!! L is empty when pi finished. LMap: ${JSON.stringify(LMap)}`);

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

        //logError( `Error!!! L is empty. before L is: ${toList(L)}` );

        if( L.size == 0 ) {
          logError( `Error!!! L is empty when pi finished. D: ${toList(D)}, P1: ${JSON.stringify(P1)}` );
        }
        
        // line 18
        P2.forEach( (pl, idx) => {
          if( k <= beta[idx] ) {
            const base = -(pl.j-pj.j);

            let plOrder = pl.order/*.filter( v => pl.i+pl.j <= v && v < this.width+this.height )*/;
            plOrder.buildIp();

            //logError( pl );
            //logError( plOrder );

            //logError( `Error!!! L is empty. L is: ${toList(L)}` );

            if( plOrder.equal(base+k) && D.has( plOrder.equal(base+k) ) ) {
              if( L.size != 0 && !L.has( plOrder.equal(base+k) ) ) {
                logError( `Error!!! L is empty. pl non-emptiness violated. L: ${toList(L)}, beta: ${JSON.stringify(beta)}, plOrder.p: ${JSON.stringify(plOrder.p)}, pj.order.p: ${JSON.stringify(pj.order.p)}, k: ${k}, D: ${toList(D)}, base: ${base}, pl: ${JSON.stringify(pl)}, pj: ${JSON.stringify(pj)}` );
              }

              let nL = new Set([]);
              
              for( let l of L ) if( l == plOrder.equal(base+k) )
                nL.add( l );

              L = nL;
            }
            else {
              let nL = new Set([]);

              //logInfo("count test");

              //logError( `Count Test Log: start L is ${toList(L)}` );

              for( let l of L )
              {
                // the count test
                if( (lambda => {
                  let plOrder = pl.order/*.filter( v => pl.i+pl.j <= v && v < this.width+this.height )*/;
                  plOrder.buildIp();

                  if( plOrder.p.filter( v => v == lambda ).length == 0 )
                    return true;

                  const base = pl.j > pj.j ? pl.j-pj.j : pj.j-pl.j;
                  const sign = (pl.j > pj.j ? 1 : -1);

                  const a = plOrder.ip[lambda]+sign*base-k;

                  if( a <= 0 ) {
                    logError( `Count Test Log: lambda: ${lambda}, a: ${a}, pl: ${JSON.stringify(pl)}, plOrder.p: ${JSON.stringify(plOrder.p)}, base: ${base}, sign: ${sign}, pj: ${JSON.stringify(pj)}, pj.order.p: ${JSON.stringify(pj.order.p)}, D: ${toList(D)}, k: ${k}, beta: ${JSON.stringify(beta[idx])}, L: ${toList(L)}` );
                  }

                  const ps = this.P.filter( p => {
                    const base = p.j > pj.j ? p.j-pj.j : pj.j-p.j;

                    let pOrder = p.order/*.filter( v => p.i+p.j <= v && v < this.width+this.height )*/;
                    pOrder.buildIp();

                    if( pOrder.p.filter( v => v == lambda ).length == 0 )
                      return false;

                    let idx = pOrder.ip[lambda]+(p.j > pj.j ? 1 : -1)*base;

                    // TODO: k+a？
                    return k <= idx && idx <= k+a;
                  } );

                  //logError(ps);
                  //logError(pj);

                  let Dk = new Set([]);
                  for( let d of D ) if( ps.every( p => {
                      const base = p.j > pj.j ? p.j-pj.j : pj.j-p.j;
                      const sign = (p.j > pj.j ? 1 : -1);

                      let pOrder = p.order/*.filter( v => p.i+p.j <= v && v < this.width+this.height )*/;
                      pOrder.buildIp();

                      //logError( pOrder );
                      //logError( d );
                      //logError( `k: ${k}, k+a: ${a}` );

                      return k <= pOrder.ip[d]+sign*base && pOrder.ip[d]+sign*base <= k+a;
                    }) )
                    Dk.add( d );

                  //logError( Dk );

                  //logError( `Count Test Log: Dk: ${toList(Dk)}, a: ${a}, size: ${Dk.size}` );

                  if( plOrder.p.filter( v => v == lambda ).length > 0 && D.has( lambda ) && !Dk.has( lambda ) ) {
                    logError( `Count Test Log: lambda has not passed the count test. lambda: ${lambda}, a: ${a}, pl: ${JSON.stringify(pl)}, plOrder.p: ${JSON.stringify(plOrder.p)}, base: ${base}, sign: ${sign}, pj: ${JSON.stringify(pj)}, pj.order.p: ${JSON.stringify(pj.order.p)}, D: ${toList(D)}, k: ${k}, beta: ${JSON.stringify(beta[idx])}, L: ${toList(L)}, Dk: ${toList(Dk)}, ps: ${JSON.stringify(ps)}` );
                  }

                  return Dk.size <= a;
                })( l ) ) {
                  nL.add( l );
                }
              }

              if( nL.size == 0 ) {
                logError( `Count Test Log: Error!!! nL is empty. L: ${toList(L)}, pj: ${JSON.stringify(pj)}` );
              }

              //logError( `Count Test Log: L is ${toList(L)}` );

              L = nL;
            }
          }
        } );

        let a;

        logError( `final result: pj: ${JSON.stringify(pj)}, k: ${k}, L: ${toList(L)}` );

        if( L.size == 0 )
        {
          logError( "Error!! L is empty when pl finished." );
          logError( pj );
          logError( k );
          logError( beta );
        }

        for( let l of L )
        {
          pj.order.p[k] = l;
          a = l;

          //logError( "Delete from D: "+l );

          D.delete(l);

          break;
        }

        logInfo(`a is: ${a}`);

        // line 25
        P2.forEach( (pl, idx) => {
          logInfo( "pl order p" );
          logInfo( pl );
          logInfo(pl.order.p);
          logInfo(a in pl.order.p);

          if( pl.order.p.filter( v => v == a ).length > 0 && k < beta[idx] ) {
            pl.order.buildIp();
            let x = pl.order.ip[a];

            logInfo( `x is: ${x}` );
            logInfo( pl.order.ip );

            if( x > beta[idx] ) {
              beta[idx] = x+1;
              logInfo( `beta: ${x+1}` );
            }
          }
        } );

        logInfo( "beta" );
        logInfo( beta );
      }

      this.getOrder( i, j ).buildIp();
      this.P.push( pj );
    }

    if( !this.contractionPropertyCheck() ) {
      logError( "Error!!! Result does not satisfy the contraction properties." );
    }
  }
}