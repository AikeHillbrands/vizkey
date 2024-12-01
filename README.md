# Data Visualization Tool

A lightweight frontend-only data visualization tool that allows you to render JSON or CSV data into interactive charts. Built with TypeScript, React, Vite, and Chart.js.

## Features

- Import/paste JSON or CSV data
- Aggregate and group data dynamically
- Interactive charts and visualizations
- No backend required - runs entirely in the browser
- Multiple chart types support (bar, line, pie, etc.)
- Modern UI with Tailwind CSS

## Specifics

### Input
On the left, with full screen height, there is an input field to paste json or csv.
its possible to drag a file into it as well

### Aggregation
By default, the raw data is just passed to the vizualization
on the right, there is a sidebar where you can configure aggregations

there is a summarzie section that allows us to select one or more properties to group on
if something is group on, I can add different aggregations. if nothing is there to be grouped by, we pass the raw data. each group by can be deleted with an X next to it. The aggregation works like this:
1. you select a property (must be a number property)
2. you select an aggregation function:
- max
- min
- count
- average
- p<variable>
3. the data is 

### Filtering
There is a section that allows you to filter the data by entering a JS function that is applied on every record (similar to .filter(x=>...) in JS)

### Charting
By default, the data is just shown as a table, nothing done otherwise

its possible to select different visualization types from a dropdown:
- bar/row
- line
- scatter