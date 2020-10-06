const phi = h => ( b, sigma ) => x => {
  x -= Math.floor(x);
  const k = Math.floor(x*b)%b+1;

  let ret = 0;

  if( h <= sigma[k-1] ) {
    for( let i = 0; i < k; ++i ) {
      if( sigma[i] < h )
        ret += 1;
    }

    ret -= h*x;
  } else {
    ret += (b-h)*x;

    for( let i = 0; i < k; ++i ) {
      if( sigma[i] >= h )
        ret -= 1;
    }
  }

  return ret;
}

const psiP = ( b, sigma ) => x => {
  let ret = -Infinity;

  for( let h = 0; h < b; ++h )
    ret = Math.max( ret, phi(h)(b,sigma)(x) );

  return ret;
}

const psiM = ( b, sigma ) => x => {
  let ret = -Infinity;

  for( let h = 0; h < b; ++h )
    ret = Math.max( ret, -phi(h)(b,sigma)(x) );

  return ret;
}

const dP = ( Sigma, b ) => N => {
  let x = N;
  let ret = 0;

  for( let j = 1; j <= Sigma.length; ++j ) {
    x /= b;
    ret += psiP( b, Sigma[j-1] )(x);
  }

  return ret;
}

const dM = ( Sigma, b ) => N => {
  let x = N;
  let ret = 0;

  for( let j = 1; j <= Sigma.length; ++j ) {
    x /= b;
    ret += psiM( b, Sigma[j-1] )(x);
  }

  return ret;
}

const dStar = ( Sigma, b ) => N => {
  return Math.max( dP(Sigma,b)(N), dM(Sigma,b)(N) );
}

const omega = ( b ) => {

}