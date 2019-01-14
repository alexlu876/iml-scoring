import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly
import plotly.plotly as py
import plotly.graph_objs as go
import plotly.tools as tls
dict = {}
dict[0] = 2
dict[1] = 5
dict[2] = 8
dict[3] = 11
dict[4] = 12
dict[5] = 8
dict[6] = 4
commutes = pd.Series(dict)

commutes.plot.hist(grid=True, color='#607c8e')
plt.title = 'Commute time'
plt.xlabel = 'time'
plt.ylabel = 'freq'
plt.grid(axis='y', alpha=0.25)

fig = plt.gcf()
plotly_fig = tls.mpl_to_plotly(fig)
plotly.offline.plot(plotly_fig, auto_open=True)

