import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv('marks.csv')

# Features and target
X = df[['Study_Hours', 'Attendance', 'Assignment_Score']]
y = df['Final_Marks']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print("R2 Score:", r2_score(y_test, y_pred))
print("MSE:", mean_squared_error(y_test, y_pred))

# Predict a new student
new_student = pd.DataFrame({
    'Study_Hours': [9],
    'Attendance': [80],
    'Assignment_Score': [90]
})

predicted = model.predict(new_student)
print("Predicted Score:", predicted[0])

# Plot Actual vs Predicted
plt.figure(figsize=(8, 6))

plt.scatter(
    y_test,
    y_pred,
    color='green',
    alpha=0.20,
    label='Predictions'
)

# Perfect prediction line
min_val = min(y_test.min(), y_pred.min())
max_val = max(y_test.max(), y_pred.max())

plt.plot(
    [min_val, max_val],
    [min_val, max_val],
    color='red',
    linestyle='--',
    linewidth=2,
    label='Perfect Prediction'
)

plt.xlabel('Actual Marks')
plt.ylabel('Predicted Marks')
plt.title('Actual vs Predicted Marks')
plt.legend()
plt.grid(True)

plt.show()