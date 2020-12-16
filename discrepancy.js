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

// \sigma \in \mathfrak{S}_b \tau \in \mathfrak{S}_c
// Intrication
function multPerm(sigma, tau, b, c) {
  let ret = []

  for( let i = 0; i < b*c; ++i ) {
    const k1 = i-Math.floor(i/b)*b;
    const k2 = Math.floor(i/b);
    
    ret.push( c*sigma[k1]+tau[k2] );
  }

  return ret;
}

function omega(b) {
  const id2 = [0,1];

  if( b == 2 )
    return id2

  if( b%2 == 0 ) {
    return multPerm(id2, omega(Math.floor(b/2)), 2, Math.floor(b/2));
  } else {
    let ret = []

    for( let k = 0; k < b; ++k ) {
      const w = omega(b-1)
      const b2 = Math.floor(b/2);

      if( k == b2 ) {
        ret.push(b2)
      } else if( k < b2 ) {
        if( w[k] < b2 )
          ret.push( w[k] )
        else
          ret.push( w[k]+1 )
      } else {
        if( w[k-1] < b2 )
          ret.push( w[k-1] )
        else
          ret.push( w[k-1]+1 )
      }
    }

    return ret;
  }
}

let A = []

for( let h = 1; h < 1000; ++h ) {
  for( let i = h*(h-1)+1; i < h*h+1; ++i ) {
    A.push(i)
  }
}

function composePerm(tau, sigma, b) {
  let ret = []

  for( i = 0; i < b; ++i )
    ret.push(tau[sigma[i]]);

  return ret;
}

function sigmaA(sigma,b) {
  let tau = []
  for( let k = 0; k < b; ++k )
    tau.push(b-k-1);

  let ret = []

  for( let j = 0; j < b; ++j ) {
    if( A.indexOf(j) != -1 )
      ret.push(sigma);
    else
      ret.push(composePerm(tau, sigma, b));
  }

  return ret;
}

sigma60 = [0,15,30,40,2,48,20,35,8,52,23,43,12,26,55,4,32,45,17,37,6,50,28,10,57,21,41,13,33,54,1,25,46,18,38,5,49,29,9,58,22,42,14,34,53,3,27,47,16,36,7,51,19,44,31,11,56,24,39,59]
sigma60As = sigmaA(sigma60,60)

console.log('sigma60As', sigma60As);