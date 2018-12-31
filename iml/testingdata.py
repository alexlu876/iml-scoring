import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly
import plotly.plotly as py
import plotly.graph_objs as go
import plotly.tools as tls

size = 1000
scale = 10
commutes = pd.Series(np.random.gamma(scale, size=size) ** 1.5)

commutes.plot.hist(grid=True, bins=20, rwidth=0.9, color='#607c8e')
plt.title = 'Commute time'
plt.xlabel = 'time'
plt.ylabel = 'freq'
plt.grid(axis='y', alpha=0.75)

fig = plt.gcf()
plotly_fig = tls.mpl_to_plotly(fig)
plotly.offline.plot(plotly_fig, auto_open=True)

