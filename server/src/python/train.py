import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Create the model
model = Sequential([
    Dense(128, activation='relu', input_shape=(1)),
    Dense(64, activation='relu'),
    Dense(1, activation='softmax')
])
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy']) # Compile the model
model.fit(x_train, y_train, epochs=10, batch_size=32) # Train the model
model.save('models/model.h5') # Save the model to a file