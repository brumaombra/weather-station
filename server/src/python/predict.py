import tensorflow as tf


model = tf.keras.models.load_model('models/model.h5') # Load the model from the file

# Predict on a single input
def make_prediction(input_data):
    predictions = model.predict(input_data)
    return predictions

input_data = 'data'
prediction = make_prediction(input_data)
print(prediction)