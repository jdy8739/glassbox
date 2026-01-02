# Python Environment Setup

This directory contains Python scripts for portfolio optimization calculations.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

### Option 1: Using pip directly

```bash
cd apps/backend/python
pip install -r requirements.txt
```

### Option 2: Using a virtual environment (Recommended)

```bash
cd apps/backend/python

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Verify Installation

Test the Python environment:

```bash
python3 efficient_frontier.py
```

Or use the backend health check endpoint:

```bash
curl http://localhost:4000/portfolio/health
```

## Dependencies

- **yfinance**: Fetch historical price data from Yahoo Finance
- **numpy**: Numerical computing
- **pandas**: Data manipulation and analysis
- **PyPortfolioOpt**: Portfolio optimization library
- **scipy**: Scientific computing
- **scikit-learn**: Machine learning utilities

## Troubleshooting

### Python command not found

Make sure Python 3 is installed:

```bash
python3 --version
```

If not installed, download from [python.org](https://www.python.org/downloads/)

### Permission denied errors

On macOS/Linux, you may need to use `sudo`:

```bash
sudo pip install -r requirements.txt
```

Or use a virtual environment (recommended).

### Module import errors

Make sure all dependencies are installed:

```bash
pip list
```

Verify that all packages from `requirements.txt` are listed.
