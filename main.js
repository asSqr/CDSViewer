document.onkeydown = event => {
  var keyEvent = event || window.event;

  if( keyEvent.keyCode == 13 )
    fl ^= true;
}

const n = 4;
let nFact = 1;

for( let i = 1; i <= n; ++i )
  nFact *= i;

grid = new grid( nFact, nFact );

let xs = [];

for( let i = 1; i <= n; ++i )
  xs.push( i );

const permutations = xs.permutation(n);

//const permutations = CorbettRotator(n);

for( let k = 1; k <= nFact; ++k ){
  for( let i = n+1; i < 2*nFact; ++i )
    permutations[k-1].push( i );

  //grid.setOrder( k, nFact+1-k, new totalOrder( permutations[k-1] ) );
  grid.setOrder( 1, 1, new totalOrder( permutations[k-1] ) );
  //console.log(grid.rayHausdorff( { i: 1, j: 1 } ));
}

/*
let xs = [3,2,1];

for( let k = 4; k < 2*nFact; ++k )
  xs.push( k );

grid.setOrder( 1, 1, new totalOrder( xs ) );*/

if( !grid.contractionPropertyCheck() )
  console.error( "Invalid Initial total orders" );

/*let used = [];

for( let i = 0; i < 4+4-2; ++i )
  used.push( false );

let cnt = 0;

let ps = [4,2,3,7,5,6];

//for( let i = 2; i < 4+4; ++i )
  //ps.push( i );

let ord = new totalOrder( ps );

grid.setOrder( 1, 1, ord );*/
else
  ;//grid.extendOrder();

let sigma = [];
const e = 2;
const base = 2;

//for( let i = 0; i < 2; ++i )
  //sigma.push(2-1-i);

let per = [];

//for( let i = 0; i < e+1; ++ i )
  //per.push([].concat(sigma));
  //per.push([].concat([2,0,1]));

let ps = generateVDC( base, e/*, per*/ );
//console.log("ps: ", ps);
//let ps = [0,4,2,6,1,5,3,7];

let ord = (new totalOrder( ps )).inv();

//console.log(ord);

//console.log( new totalOrder( [0,1,3,5,6,8,2,4,7] ).twice(5) );

/*let res = [];

for( let k = 1; k <= 7; ++k ) {
  let xs = [];

  for( let i = 0; i < k; ++i )
    xs.push( i );

  const permutations = xs.permutation(k);

  for( let p of permutations ) {
    console.log(p);
    let fromOrd = new totalOrder(p);
    let toOrd = (new totalOrder(p)).twice2();

    res.push( { fromOrd, toOrd } );
  }
}*/

document.onmousemove = event => {
  event = event || window.event;
  grid.setMousePos( event.clientX, event.clientY );
}

document.onmousedown = event => {
  grid.mouseButtonHandler();
}

let ptr = 1000;

let array = [];

for( let i = 0; i < 100; ++i )
  array.push( i );

for(var i = array.length - 1; i > 0; i--){
  var r = Math.floor(Math.random() * (i + 1));
  var tmp = array[i];
  array[i] = array[r];
  array[r] = tmp;
}

function render()
{
  let cvs = document.getElementById('canvas');
  let cntnr = document.getElementById('container');
  let ctx = cvs.getContext('2d');

  const w = cvs.width, h = cvs.height;
  ctx.fillStyle = '#fafafa';
  ctx.fillRect( 0, 0, w, h );

  //const ord = new totalOrder( array );

  const step = 150;

  renderCurve(ctx, h);

  //ord.showSpanningTree( ctx, 40, h-40, 1, step, 5, true, true );
  //drawSpanningTreeFromList( vs, ctx, 40, h-40, 1, step, 5, true );

  /*let [mord] = [...[ord]];
  let q = 1;
  const magnify = 3;

  for( let k = 0; k < magnify; ++k )
    mord = mord.twice2(), q *= 2;
  
  mord.showSpanningTree( ctx, 40, h-40, q, step/q, 0 );*/

  //res[ptr].fromOrd.showSpanningTree( ctx, 40, h-500, 1, 30 );
  //res[ptr].toOrd.showSpanningTree( ctx, 40, h-40, 2, 30 );

  //new totalOrder( [0,1,3,5,6,8,2,4,7] ).showSpanningTree( ctx, 40, h-40, 20 );

  //grid.render( ctx, w/2-(h-20)/2, 10, h-20, h-20 );
  //grid.renderCDS( ctx );
  grid.keyHandler();
}

setInterval( render, 1000/60 );