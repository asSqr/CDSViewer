import matplotlib.pyplot as plt
import math

term = 1000

def phi(b,h,sigma,x):
  x -= int(x)
  k = int(x*b)%b+1

  ret = 0

  if h <= sigma[k-1]:
    for i in range(k):
      if sigma[i] < h: ret += 1

    ret -= h*x
  else:
    ret = (b-h)*x

    for i in range(k):
      if sigma[i] >= h:
        ret -= 1

  return ret

def psiP(b,sigma,x):
  ret = -100000000

  for h in range(b):
    ret = max(ret, phi(b,h,sigma,x))

  return ret

def psiM(b,sigma,x):
  ret = -100000000

  for h in range(b):
    ret = max(ret, -phi(b,h,sigma,x))

  return ret

def psi(b,sigma,x):
  return psiP(b,sigma,x)+psiM(b,sigma,x)

def DStarP(n,b,sigma):
  x = n
  ret = 0
  j = 1

  length = len(sigma)

  while True:
    x /= b
    ret += psiP(b,sigma[(j-1)%length],x)

    if x <= 1:
      break
      
    j += 1

  ret += x

  coef = x/b
  baseIdx = n%length

  dr = 1

  for k in range(length):
    dr *= b

  for k in range(length):
    print("coef: {}, dr: {}".format(coef, dr))
    ret -= coef*sigma[(baseIdx+k)%length][0]*dr/(dr-1)

    coef /= b

  return ret

def DStarM(n,b,sigma):
  x = n
  ret = 0
  j = 1

  length = len(sigma)

  while True:
    x /= b
    ret += psiM(b,sigma[(j-1)%length],x)

    if x <= 1:
      break
      
    j += 1

  coef = x/b
  baseIdx = n%length

  dr = 1

  for k in range(length):
    dr *= b

  for k in range(length):
    ret += coef*sigma[(baseIdx+k)%length][0]*dr/(dr-1)

    coef /= b

  return ret

def DStarF(n,b,sigma):
  x = n
  ret = 0
  j = 1
  
  length = len(sigma)

  while True:
    x /= b
    ret += psi(b,sigma[(j-1)%length],x)

    if x <= 1:
      break
      
    j += 1

  ret += x

  return ret

def DStar(n,b,sigma):
  ret = max(DStarP(n,b,sigma), DStarM(n,b,sigma))
  print("ret: {}, formula: {}".format(ret, DStarF(n,b,sigma)))

  return ret

# \sigma \in \mathfrak{S}_b \tau \in \mathfrak{S}_c
# Intrication
def multPerm(sigma, tau, b, c):
  ret = []

  for i in range(b*c):
    k1 = i%b
    k2 = i//b
    
    ret.append( c*sigma[k1]+tau[k2] )

  return ret

def omega(b):
  id2 = [0,1]

  if b == 2:
    return id2

  if b%2 == 0:
    return multPerm(id2, omega(b//2), 2, b//2)
  else:
    ret = []

    for k in range(b):
      w = omega(b-1)
      b2 = b//2

      if k == b2:
        ret.append(b2)
      elif k < b2:
        if w[k] < b2:
          ret.append( w[k] )
        else:
          ret.append( w[k]+1 )
      else:
        if w[k-1] < b2:
          ret.append( w[k-1] )
        else:
          ret.append( w[k-1]+1 )

    return ret

def revDigit( x, b, length, per = [] ):
  xs = []

  for i in range(length):
    if i < len(per):
      xs.append( per[i][x%b] )
    else:
      xs.append( x%b )

    x = x // b

  p = 0
  
  for x in xs:
    p *= b
    p += x

  return p

def generateVDC( b, n, per = [] ):
  p = 1
  for i in range(n):
    p *= b

  ret = []

  for i in range(p):
    ret.append( revDigit(i,b,n,per) )

  return ret

w = omega(9)
ws = [w]
ids = [[0,1]]

n = 10000

ma2 = 0
ma9 = 0

twos = []
ds = []
xs = []

for i in range(2,n):
  s2d = DStar(i, 2, ids)
  s9d = DStar(i, 9, ws)
  print("s2d: {}, s9d: {}".format(s2d, s9d))
  s2d /= math.log(i)
  s9d /= math.log(i)
  print(s2d)
  print(s9d)

  xs.append(i)
  twos.append(s2d)
  ds.append(s9d)

  ma2 = max( ma2, s2d )
  ma9 = max( ma9, s9d )

print(ma2)
print(ma9)

plt.plot(xs,twos)
plt.plot(xs,ds)

plt.show()

'''xs = []
ys = []

for h in range(9):
  for i in range(101):
    x = i/50
    xs.append( x )
    #ys.append( psi(9,w,x) )
    #ys.append( phi(9,h,w,x) )

plt.plot(xs, ys)
plt.show()'''