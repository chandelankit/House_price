from flask import Flask, request, jsonify, send_from_directory
import pickle
import json
import numpy as np

app = Flask(__name__, static_folder="../client", template_folder="../client")

# Global variables for model and data
__locations = None
__data_columns = None
__model = None

# Function to get estimated price
def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

# Function to load saved artifacts
import os

def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    # Get the directory of the current file
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Load columns.json
    with open(os.path.join(base_dir, "columns.json"), "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # first 3 columns are sqft, bath, bhk

    # Load the model
    if __model is None:
        with open(os.path.join(base_dir, 'banglore_home_prices_model.pickle'), 'rb') as f:
            __model = pickle.load(f)
    print("loading saved artifacts...done")


# Function to get location names
def get_location_names():
    return __locations

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'app.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route('/get_location_names', methods=['GET'])
def get_location_names_route():
    response = jsonify({
        'locations': get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    total_sqft = float(request.form['total_sqft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])

    response = jsonify({
        'estimated_price': get_estimated_price(location, total_sqft, bhk, bath)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server...")
    load_saved_artifacts()
    app.run(debug=False, host="0.0.0.0", port=5000)

    # Debugging print statements (optional)
    print(get_location_names())
    print(get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    print(get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    print(get_estimated_price('Kalhalli', 1000, 2, 2))  # other location
    print(get_estimated_price('Ejipura', 1000, 2, 2))  # other location
