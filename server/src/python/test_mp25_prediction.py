from tensorflow import keras

# Main function
def main():
    input_data = []
    model = keras.models.load_model('models/mp25_prediction.keras') # Load the model
    model.predict(input_data) # Predict on a single input

# Call the main function only if the script is executed directly (not imported as a module)
if __name__ == "__main__":
    main()