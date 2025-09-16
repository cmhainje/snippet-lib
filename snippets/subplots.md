---
title: subplots
tags:
  - python
  - matplotlib
date: 2025-09-16
---

how to make a row of subplots with one shared colorbar Axes, optionally telling the plot Axes to share their x/y-axis limits.
if you just want a row of subplots with a shared colorbar Axes, this is achieveable with the `plt.subplots` method: just give it one extra column and make the last panel narrower by specifying `gridspec_kw=dict(width_ratios=[...])`.
but if you additionally want the subplots to all share their axis limits, it can be tricky to achieve without ruining the colorbar.

so here is a snippet I use _all the time_ to achieve this:

```python
def subplots_with_cax(ncols, size=3.5, sharex=False, sharey=False):
    fig = plt.figure(figsize=(ncols * size, size))
    gs  = fig.add_gridspec(1, ncols, width_ratios=[8] * ncols + [0.5])

    axs = np.empty((ncols,), dtype=object)
    axs[0] = fig.add_subplot(gs[0])
    for c in range(1, ncols):
        axs[c] = fig.add_subplot(
            gs[c],
            sharex=axs[0] if sharex else None,
            sharey=axs[0] if sharey else None,
        )

    cax = fig.add_subplots(gs[-1])
    return fig, axs, cax
```

sample usage:

```python
# data X with shape (4, N, 3)
# which we want to plot as four panels, each of which is
#   a 2D scatter plot of the first two dimensions
#   colored by the third dimension

norm = mpl.colors.Normalize()
cmap = plt.get_cmap('viridis')

fig, axs, cax = subplots_with_cax(X.shape[0], sharex=True, sharey=True)

for i in range(X.shape[0]):
    axs[i].scatter(X[i,:,0], X[i,:,1], c=X[i,:,2], norm=norm, cmap=cmap)

fig.colorbar(
    mpl.cm.ScalarMappable(norm, cmap),
    cax=cax,
    label='Color scale'
)

fig.tight_layout()  # usually necessary
plt.show()
```

all the `scatter` calls share a normalizer and colormap, from which we make a single custom colorbar.

