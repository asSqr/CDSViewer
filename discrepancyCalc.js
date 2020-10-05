let ma2 = 0
let ma3 = 0

let id2 = []
let id3 = []

for( let i = 0; i < 10; ++i ) {
  id2.push([0,1])
  id3.push([0,1,2])
}

for( let i = 2; i < 10000; ++i ) {
  let S2D = dStar( id2, 2 )( i )
  let S3D = dStar( id3, 3 )( i )

  S2D /= Math.log(i)
  S3D /= Math.log(i)

  console.log("2");
  console.log( S2D );
  console.log("3");
  console.log( S3D );

  ma2 = Math.max( ma2, S2D )
  ma3 = Math.max( ma3, S3D )
}

console.log("ma2")
console.log(ma2)
console.log("ma3")
console.log(ma3)