# WreckCheck: Car Damage Detection System

This project provides a modular, production-ready pipeline for car damage detection using deep learning. It includes:

- Data augmentation and preprocessing scripts
- Model training and evaluation modules
- Utility functions
- Two user interfaces: a PyQt GUI and a web-based (Flask) app

## Project Structure

- `data_augmentation/` — Data augmentation scripts
- `preprocessing/` — Data preprocessing pipelines
- `model_training/` — Model definition, training, and evaluation
- `utils/` — Utility functions and helpers
- `gui/` — PyQt5-based desktop GUI
- `web/` — Flask-based web app (with HTML/CSS/JS)
- `dataset/` — Images and labels

## Quick Start

1. Install dependencies: `pip install -r requirements.txt`
2. Train the model: `python model_training/train.py`
3. Run the GUI: `python gui/app.py`
4. Run the web app: `python web/app.py`

See each folder for more details.
