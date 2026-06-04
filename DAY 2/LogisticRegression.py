import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

# Load dataset
data = pd.read_csv('titanic.csv')

# Features
X = data[['Pclass', 'Age', 'Fare']].copy()
X['Age'] = X['Age'].fillna(X['Age'].mean())

# Target
y = data['Survived']

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Prediction
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# New passenger
new_passenger = pd.DataFrame({
    'Pclass': [1],
    'Age': [30],
    'Fare': [80]
})

prediction = model.predict(new_passenger)

print(
    "Passenger Survived"
    if prediction[0] == 1
    else "Passenger Did Not Survive"
)