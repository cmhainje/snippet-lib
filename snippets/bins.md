---
title: bins
tags:
  - python
date: 2025-09-10
---


often when analyzing data, I end up binning the data according to one variable and then, in each bin, computing some other quantity.
this could be something as simple as a histogram or maybe more complicated.
in order to bin your data, you need the bin _edges_; but to plot the data, you probably need the bin _centers_.
rather than manually computing the midpoint of the edges (and remembering to adjust the calculation if your bins are logarithmically spaced), I use this snippet to make both the bin edges and centers in one go.
also, I often find it useful to set the lowest bin edge to zero when the bins are logarithmically spaced, so that's included here too.


```python
def make_bins(lo, hi, num, log=True, zero=True):
    space = np.geomspace if log else np.linspace
    all_bins = space(lo, hi, 2 * num + 1)
    edges = all_bins[0::2]
    centers = all_bins[1::2]
    if zero:
        edges[0] = 0
    return edges, centers
```

sample usage:

```python
# data: x, y (ndarrays of same shape)

n_bins = 10
bin_e, bin_c = make_bins(1e-1, 1e2, n_bins, log=True, zero=True)

# use bin edges to compute per-bin quantities
y_means = np.zeros(n_bins)
for i in range(n_bins):
    mask = (x >= bin_e[i]) & (x < bin_e[i + 1])
    y_means[i] = np.average(y[mask])

# use bin centers to plot
plt.plot(bin_c, y_means)
plt.xscale('log')
plt.show()
```

