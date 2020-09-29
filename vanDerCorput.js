function revDigit( x, b, len, per = [] ) {
  let xs = [];

  for( let i = 0; i < len; ++i ) {
    xs.push(per[i] && per[i].length ? per[i][x%b] : x%b);
    x = Math.floor(x/b);
  }

  console.log("xs: ",xs);

  let p = 0;
  
  for( let x of xs ) {
    p *= b;
    p += x;
  }

  return p;
}

function generateVDC( b, n, per = [] ) {
  let p = 1;
  for( let i = 0; i < n; ++i )
    p *= b;

  let ret = [];

  for( let i = 0; i < p; ++i )
    ret.push( revDigit(i,b,n,per) );

  return ret;
}