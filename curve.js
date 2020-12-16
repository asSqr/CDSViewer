// parabola y = ax^2
const gInvPara = theta => {
  return 2*theta/(theta+1);
}

const gInv = gInvPara;

let C = {};

C.base = 2;
C.exp = 5;
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

function renderCurve( ctx, h ) {
  const step = 20;

  C.showSpanningTree( C.cOrd, ctx, 40, h-40, step, false );
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