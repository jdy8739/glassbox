#!/usr/bin/env python3
"""
Test script to verify all required dependencies are installed
"""

import sys
import json

def test_imports():
    results = {}

    # Test each import
    try:
        import yfinance
        results['yfinance'] = f"✓ OK (version: {yfinance.__version__})"
    except ImportError as e:
        results['yfinance'] = f"✗ MISSING: {str(e)}"

    try:
        import numpy
        results['numpy'] = f"✓ OK (version: {numpy.__version__})"
    except ImportError as e:
        results['numpy'] = f"✗ MISSING: {str(e)}"

    try:
        import pandas
        results['pandas'] = f"✓ OK (version: {pandas.__version__})"
    except ImportError as e:
        results['pandas'] = f"✗ MISSING: {str(e)}"

    try:
        from pypfopt import EfficientFrontier
        import pypfopt
        results['PyPortfolioOpt'] = f"✓ OK (version: {pypfopt.__version__})"
    except ImportError as e:
        results['PyPortfolioOpt'] = f"✗ MISSING: {str(e)}"

    try:
        import scipy
        results['scipy'] = f"✓ OK (version: {scipy.__version__})"
    except ImportError as e:
        results['scipy'] = f"✗ MISSING: {str(e)}"

    try:
        import sklearn
        results['scikit-learn'] = f"✓ OK (version: {sklearn.__version__})"
    except ImportError as e:
        results['scikit-learn'] = f"✗ MISSING: {str(e)}"

    return results

if __name__ == '__main__':
    print("Testing Python dependencies for Glassbox...")
    print("=" * 60)

    results = test_imports()

    all_ok = True
    for lib, status in results.items():
        print(f"{lib:20s}: {status}")
        if "MISSING" in status:
            all_ok = False

    print("=" * 60)

    if all_ok:
        print("✓ All dependencies are installed!")
        sys.exit(0)
    else:
        print("✗ Some dependencies are missing. Please run:")
        print("  pip3 install -r requirements.txt")
        sys.exit(1)
