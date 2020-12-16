// parabola y = ax^2
const gInvPara = theta => {
  return 2*theta/(theta+1);
}

const gInv = gInvPara;

let C = {};

C.base = 2;
C.exp = 7;
C.size = Math.pow(C.base, C.exp);

C.V = generateVDC(C.base, C.exp);

C.cOrd = [];

for( let k = 0; k < C.size; ++k ) {
  const x = C.V[k]/C.size;
  C.cOrd.push(gInv(x));
}

console.log("cOrd", C.cOrd);

C.showSpanningTree = (cOrd, ctx, sx, sy, step, para = false) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgb(40,40,40)";

  const transX = cx => sx+cx*step;
  const transY = cy => sy-cy*step;
  const drawLineG = (ctx, cx, cy, nx, ny) => {
    R.line(ctx, transX(cx), transY(cy), transX(nx), transY(ny));
  }

  for( let k = 0; k < C.size; ++k ) {
    for( let x = 0; x <= k; ++x ) {
      const t = Math.ceil(k*cOrd[k]);
      let y = k-x;
      let nx = x;
      let ny = y;

      if( t == x ) {
        drawLineG(ctx, x, y, x+1, y);
        drawLineG(ctx, x, y, x, y+1);
      } else if( t < x ) {
        nx += 1;
        drawLineG(ctx, x, y, nx, ny);
      } else {
        ny += 1;
        drawLineG(ctx, x, y, nx, ny);
      }
    }
  }

  if( para ) {
    const n = C.size;

    ctx.strokeStyle = 'rgb(255,0,0)';

    for( let x = 0; x <= n; ++x ) {
      const y = n-x;
      const a = y/x/x;
      const f = x => a*x*x;

      for( let i = 0; i < x; ++i ) {
        drawLineG(ctx, i, f(i), i+1, f(i+1));
      }
    }
  }
}

/*C.calcHausdorff = (cOrd) => {
  const W = 100000;
  const id = (cx, cy) => cx*W+cy;
  const decomp = nid => { return { x: Math.floor(nid/W), y: nid-Math.floor(nid/W)*W } };

  let G = {};

  for( let k = 0; k <= C.size; ++k ) {
    for( let x = 0; x <= k; ++x ) {
      G[id(x,k-x)] = [];
    }
  }

  for( let k = 0; k < C.size; ++k ) {
    for( let x = 0; x <= k; ++x ) {
      const t = Math.ceil(k*cOrd[k]);
      let y = k-x;
      let nx = x;
      let ny = y;

      if( t == x ) {
        G[id(x+1,y)].push(id(x,y));
        G[id(x,y+1)].push(id(x,y));
      } else if( t < x ) {
        nx += 1;
        G[id(nx,ny)].push(id(x,y));
      } else {
        ny += 1;
        G[id(nx,ny)].push(id(x,y));
      }
    }
  }

  const bstep = 1;
  const euclid = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1-y1, 2)+Math.pow(x2-y2, 2));

  let ret = 0;

  for( let k = 0; k < C.size; ++k ) {
    for( let x = 1; x <= k; ++x ) {
      let cx = x;
      let cy = k-x;
      const a = cy/cx/cx;

      let used = {};
      used[id(cx,cy)] = true;

      while( true ) {
        let xs = [];

        for( let nid of G[id(cx,cy)] ) {
          if( !used[nid] )
            xs.push(nid);
        }

        if( xs.length == 0 ) {
          break;
        }

        //console.log(cx,cy);

        let {x: nx, y: ny} = decomp(xs[0]);

        for( let i = 0; i < bstep; ++i ) {
          const x = (bstep-i)/bstep*cx+i/bstep*nx;
          const y = (bstep-i)/bstep*cy+i/bstep*ny;

          let dist = 100000000000;

          for( let px = 0; px <= C.size; ++px ) {
            const py = a*px*px;

            //console.log(x, y, px, py, euclid(x,y,px,py));

            dist = Math.min( dist, euclid(x,y,px,py) );
          }

          console.log(x,y,dist);

          ret = Math.max( ret, dist );
        }

        cx = nx;
        cy = ny;
      }
    }
  }

  for( let k = 0; k < C.size; ++k ) {
    for( let x = 1; x <= k; ++x ) {
      let cx = x;
      let cy = k-x;
      const a = cy/cx/cx;

      for( let px = 0; px < C.size; ++px ) {  
        const py = a*px*px;

        let used = {};
        used[id(cx,cy)] = true;

        let dist = 1000000000;

        while( true ) {
          let xs = [];

          for( let nid of G[id(cx,cy)] ) {
            if( !used[nid] )
              xs.push(nid);
          }

          if( xs.length == 0 ) {
            break;
          }

          let {x: nx, y: ny} = decomp(xs[0]);

          for( let i = 0; i <= bstep; ++i ) {
            const x = (bstep-i)/bstep*cx+i/bstep*nx;
            const y = (bstep-i)/bstep*cy+i/bstep*ny;

            dist = Math.min( dist, euclid(x,y,px,py) );
          }

          cx = nx;
          cy = ny;
        }

        ret = Math.max( ret, dist );
      }
    }
  }

  return ret;
}*/

C.calcHausdorff = (cOrd) => {
  const W = 100000;
  const id = (cx, cy) => cx*W+cy;
  const decomp = nid => { return { x: Math.floor(nid/W), y: nid-Math.floor(nid/W)*W } };

  let G = {};

  for( let k = 0; k <= C.size; ++k ) {
    for( let x = 0; x <= k; ++x ) {
      G[id(x,k-x)] = [];
    }
  }

  for( let k = 0; k < C.size; ++k ) {
    for( let x = 0; x <= k; ++x ) {
      const t = Math.ceil(k*cOrd[k]);
      let y = k-x;
      let nx = x;
      let ny = y;

      if( t == x ) {
        G[id(x+1,y)].push(id(x,y));
        G[id(x,y+1)].push(id(x,y));
      } else if( t < x ) {
        nx += 1;
        G[id(nx,ny)].push(id(x,y));
      } else {
        ny += 1;
        G[id(nx,ny)].push(id(x,y));
      }
    }
  }

  const bstep = 1;
  const euclid = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1-y1, 2)+Math.pow(x2-y2, 2));

  let ret = 0;

  for( let k = 0; k < C.size; ++k ) {
    for( let x = 1; x < k; ++x ) {
      let cx = x;
      let cy = k-x;
      const a = cy/cx/cx;

      let used = {};
      used[id(cx,cy)] = true;

      while( true ) {
        let xs = [];

        for( let nid of G[id(cx,cy)] ) {
          if( !used[nid] )
            xs.push(nid);
        }

        if( xs.length == 0 ) {
          break;
        }

        let {x: nx, y: ny} = decomp(xs[0]);

        const z = nx+ny;

        const px = (-1+Math.sqrt(1+4*a*z))/(2*a);
        const py = z-px;

        const dist = Math.max(Math.abs(nx-px), Math.abs(ny-py));

        //console.log(px,py,nx,ny,dist);

        ret = Math.max(ret, dist);

        cx = nx;
        cy = ny;
      }
    }
  }

  return ret;
}

let fst = true;

function renderCurve( ctx, h ) {
  const step = 5;

  C.showSpanningTree( C.cOrd, ctx, 40, h-40, step, false );

  if( fst ) {
    console.log("Hausdorff: "+C.calcHausdorff(C.cOrd) );
    fst = false;
  }
}

function render()
{
  let cvs = document.getElementById('canvas');
  let cntnr = document.getElementById('container');
  let ctx = cvs.getContext('2d');

  const w = cvs.width, h = cvs.height;
  ctx.fillStyle = '#fafafa';
  ctx.fillRect( 0, 0, w, h );

  renderCurve(ctx, h);
}

setInterval( render, 1000/60 );