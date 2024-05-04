import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from dotenv import load_dotenv
import mysql.connector
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load the env variables
def loadEnvVariables():
    print('Loading the env variables...')
    load_dotenv('../../.env') # Read the env variables
    user = os.getenv('MYSQL_USER') # DB user
    password = os.getenv('MYSQL_PASSWORD') # DB password
    host = os.getenv('MYSQL_IP') # DB host
    database = os.getenv('MYSQL_DATABASE_NAME') # DB name
    if None in [user, password, host, database]:
        raise ValueError("Error while loading the envoirement variables")
    return user, password, host, database

# Get the data from the database
def connectToDatabase(user, password, host, database):
    print('Getting the data from the database...')
    config = {
        'user': user,
        'password': password,
        'host': host,
        'database': database,
        'raise_on_warnings': True
    }

    # Connect to the database and get the data
    try:
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        query = "SELECT temperature, humidity, pressure, gas, pm25 FROM measurements;"
        cursor.execute(query)
        result = cursor.fetchall()
        data = pd.DataFrame(result, columns=['temperature', 'humidity', 'pressure', 'gas', 'pm25'])
        print(f'Extracted {len(data)} records with {data.shape[1]} columns')
    except mysql.connector.Error as e:
        print(f"Error in connecting to the database or executing the query: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()
    
    return data

# Normalize the data
def normalizeData(data):
    print('Normalizing the data...')
    features = data[['temperature', 'humidity', 'pressure', 'gas']] # Select the features
    target = data['pm25'] # Select the label
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42) # Divide the training set and the test set
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train) # Normalize the training set
    X_test_scaled = scaler.transform(X_test) # Normalize the test set
    return X_train_scaled, y_train, X_test_scaled, y_test
    
# Train the neural network
def trainNetwork(X_train, y_train):
    print('Training the network...')
    model = Sequential([
        Dense(64, input_dim=4, activation='relu'), # 4 inputs: temperature, humidity, pressure and gas
        Dense(32, activation='relu'),
        Dense(1) # 1 output: PM2.5
    ])

    # Train the model
    try:
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X_train, y_train, epochs=50, batch_size=10, validation_split=0.2)
    except Exception as e:
        print(f"An error occurred during training: {e}")
        raise

    return model

# Evaluate the network
def evaluateNetwork(model, X_test, y_test):
    test_loss = model.evaluate(X_test, y_test)
    print(f"Test loss: {test_loss}")
    predictions = model.predict(X_test)
    return predictions

# Save the model
def saveModel(model):
    try:
        os.makedirs('models', exist_ok=True) # Ensure the directory exists
        model.save('models/mp25_prediction.keras') # Save the model to a file
        print('Model saved')
    except Exception as e:
        print(f"Failed to save the model: {e}")
        raise

# Main function
def main():
    user, password, host, database = loadEnvVariables() # Load the env variables
    data = connectToDatabase(user, password, host, database) # Get the data from the database
    X_train_scaled, y_train, X_test_scaled, y_test = normalizeData(data) # Normalize the data
    model = trainNetwork(X_train_scaled, y_train) # Train the network
    predictions = evaluateNetwork(model, X_test_scaled, y_test) # Evaluate the network
    saveModel(model) # Save the model to a file

# Call the main function only if the script is executed directly (not imported as a module)
if __name__ == "__main__":
    main()