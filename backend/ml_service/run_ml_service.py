#!/usr/bin/env python3
import os
import sys
import subprocess
from pathlib import Path

def install_dependencies():
    print("Installing Python dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def run_ml_service():
    os.environ['FLASK_APP'] = 'study_plan_generator_v2.py'
    os.environ['FLASK_ENV'] = 'development'
    subprocess.run([sys.executable, "-m", "flask", "run", "--host=0.0.0.0", "--port=5002"], check=True)

def main():
    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    install_dependencies()
    run_ml_service()

if __name__ == "__main__":
    main()
