# Hospital eTicketing System

## Setup and Running the Application

Firstly, If you don't have Python 3.x.x to your PC, [download](https://www.python.org/downloads/) and install to your PC.

Make sure that you have Python is installed successfully in you PC by using this command:

```
python --version
```

Creating a virtual environment to the project directory:

```
python -m venv ./.venv
```

To activate virtual environment (with powershell):

```
cd .venv/Scripts
./activate
cd ../../
```

Install pip packages via command line after activating the virtual environment:

```
pip install -r requirements.txt
```

To run, use command:

```
python app.py
```

and go to http://127.0.0.1:5000 (or location that said the command line message)