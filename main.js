document.onkeydown = event => {
  var keyEvent = event || window.event;

  if( keyEvent.keyCode == 13 )
    fl ^= true;
}

const n = 3;
let nFact = 1;

for( let i = 1; i <= n; ++i )
  nFact *= i;

grid = new grid( nFact, nFact );

const permutations = CorbettRotator(n);

for( let k = 1; k <= nFact; ++k ){
  for( let i = n+1; i < 2*nFact; ++i )
    permutations[k-1].push( i );

  grid.setOrder( k, nFact+1-k, new totalOrder( permutations[k-1] ) );
}

if( !grid.contractionPropertyCheck() )
  console.error( "Invalid Initial total order" );

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
  grid.extendOrder();

document.onmousemove = event => {
  event = event || window.event;
  grid.setMousePos( event.clientX, event.clientY );
}

document.onmousedown = event => {
  grid.mouseButtonHandler();
}

function render()
{
  let cvs = document.getElementById('canvas');
  let cntnr = document.getElementById('container');
  let ctx = cvs.getContext('2d');

  const w = cvs.width, h = cvs.height;
  ctx.clearRect( 0, 0, w, h );

  grid.render( ctx, w/2-(h-20)/2, 10, h-20, h-20 );
  grid.renderCDS( ctx );
  grid.keyHandler();
}

setInterval( render, 1000/60 );