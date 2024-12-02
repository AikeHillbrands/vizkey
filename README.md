# Data Visualization Tool

Try out here: https://vizkey.aike.dev/

A lightweight frontend-only data visualization tool that allows you to render JSON or CSV data into interactive charts. Built with TypeScript, React, Vite, and Chart.js.

## Features

* Import JSON or CSV data through file upload or direct paste
* Dynamic data aggregation and grouping capabilities
* Interactive chart visualizations
* Browser-based processing - no backend required
* Support for multiple chart types
* Clean, modern UI built with Tailwind CSS
* Dark mode support with system-wide preference detection

## How It Works

### Data Input

The application provides two ways to input data:

* Paste JSON or CSV directly into the input field
* Drag and drop a JSON or CSV file

The tool automatically detects the data format and column types for further processing.

### Data Processing

#### Grouping & Aggregation

The app allows you to:

* Group data by one or more columns
* Apply various aggregation functions to numeric columns:
  * Sum
  * Average
  * Count
  * Min
  * Max
  * Percentiles (p25, p50, p75, p90, p95, p99)

Each grouping configuration can be:

* Added dynamically through the UI
* Removed individually with the delete button
* Modified on the fly with immediate visual feedback

#### Date Handling

* Automatic detection of date columns
* Date values can be truncated to different levels (year, month, day) for grouping

### Visualization Options

The processed data can be viewed in different formats:

* Table view (default)
* Bar chart
* Line chart
* Scatter plot

Each visualization type can be selected from a dropdown menu, with the chart updating automatically to reflect the current data processing configuration.

### Technical Details

* Built with React and TypeScript for type safety and better development experience
* Uses Chart.js for rendering visualizations
* Employs Vite for fast development and building
* Styled with Tailwind CSS for responsive design
  