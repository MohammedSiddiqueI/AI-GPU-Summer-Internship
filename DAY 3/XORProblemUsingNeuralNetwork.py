from sklearn.neural_network import MLPClassifier

# XOR Dataset
X = [[0,0],
     [0,1],
     [1,0],
     [1,1]]

y = [0,1,1,0]

# Neural Network
model = MLPClassifier(hidden_layer_sizes=(4,),
                      max_iter=5000,
                      random_state=42)

model.fit(X, y)

print("Predictions:")
print(model.predict(X))