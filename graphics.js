const R = {
  line: ( ctx, x1, y1, x2, y2 ) => {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
  },
  circle: ( ctx, x, y, r, fill ) => {
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2, true );
    ctx.closePath();

    if( fill )
      ctx.fill();
    else
      ctx.stroke();
  },
  string: ( ctx, x, y, str ) => {
    ctx.fillText( str, x, y );
  }
};