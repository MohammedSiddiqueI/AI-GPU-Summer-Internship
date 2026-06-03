import numpy as np

# Inputs
inputs = np.array([1, 2, 3])

# Weights
weights = np.array([0.2, 0.8, -0.5])

# Bias
bias = 2

# Output
output = np.dot(inputs, weights) + bias

## THis i accessed via np.dot internally
# def dot(x, y):
#     result = 0
#     for i in range(len(x)):
#         result += x[i] * y[i]
#     return result

print("Neuron Output:", output)