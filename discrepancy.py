import matplotlib.pyplot as plt

term = 1000

def phi(b,h,sigma,x):
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

  for j in range(1,term):
    x /= b
    ret += psiP(b,sigma[j-1],x)

  return ret

def DStarM(n,b,sigma):
  x = n
  ret = 0

  for j in range(1,term):
    x /= b
    ret += psiM(b,sigma[j-1],x)

  return ret

def DStar(n,b,sigma):
  return max(DStarP(n,b,sigma), DStarM(n,b,sigma))

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

w = omega(9)
ws = []

for i in range(term):
  ws.append(w)

'''xs = []
ys = []

for h in range(9):
  for i in range(100):
    x = i/100
    xs.append( x )
    #ys.append( psi(9,w,x) )
    ys.append( phi(9,h,w,x) )

plt.plot(xs, ys)
plt.show()'''