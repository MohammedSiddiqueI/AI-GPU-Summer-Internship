import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Load Kaggle dataset
df = pd.read_csv('train.csv')

# Select feature and target
X = df[['GrLivArea']]
y = df['SalePrice']

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

# Predict a new house
new_house = pd.DataFrame({'GrLivArea': [2000]})
predicted_price = model.predict(new_house)

print("Predicted Price:", predicted_price[0])

# Plot actual data points (test set)
plt.figure(figsize=(8, 6))
plt.scatter(
    X_test['GrLivArea'],
    y_test,
    color='blue',
    label='Actual Prices',
    alpha=0.5
)

# Sort values for a smooth regression line
sorted_idx = X_test['GrLivArea'].argsort()
X_sorted = X_test['GrLivArea'].iloc[sorted_idx]
y_pred_sorted = y_pred[sorted_idx]

# Plot regression line
plt.plot(
    X_sorted,
    y_pred_sorted,
    color='red',
    linewidth=2,
    label='Regression Line'
)

# Labels and title
plt.xlabel('GrLivArea (Living Area)')
plt.ylabel('SalePrice')
plt.title('House Price Prediction - Linear Regression')
plt.legend()
plt.grid(True)

plt.show()