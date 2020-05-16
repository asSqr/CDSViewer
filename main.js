document.onkeydown = event => {
  var keyEvent = event || window.event;

  if( keyEvent.keyCode == 13 )
    fl ^= true;
}

grid = new grid( 4, 4 );

let ps = [];

for( let i = 0; i < 100; ++i )
  ps.push( i );

let ord = new totalOrder( ps );

grid.setOrder( 0, 0, ord );

grid.extendOrder();

function render()
{
  let cvs = document.getElementById('canvas');
  let cntnr = document.getElementById('container');
  let ctx = cvs.getContext('2d');

  const w = cvs.width, h = cvs.height;
  ctx.clearRect( 0, 0, w, h );

  grid.render( ctx, w/2-(h-20)/2, 10, h-20, h-20 );
}

setInterval( render, 1000/60 );