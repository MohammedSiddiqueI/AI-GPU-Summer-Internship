# Day 2

## Using liner regression on Problem 1
```py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Load Kaggle dataset
data = pd.read_csv('train.csv')
df = pd.DataFrame(data)
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
new_house = [[2000]]
predicted_price = model.predict(new_house)
print("Predicted Price:", predicted_price[0])
 Plot actual data points (test set)
plt.scatter(X_test, y_test, color='blue', label='Actual Prices', alpha=0.3)

# Plot regression line
plt.plot(X_test, y_pred, color='red', label='Regression Line')

# Labels
plt.xlabel('GrLivArea (Living Area)')
plt.ylabel('SalePrice')
plt.title('House Price Prediction - Linear Regression')
plt.legend()
plt.show()

```

## Using Logistic Regression on Problem 2

```py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix


# Load dataset
data = pd.read_csv('titanic.csv')

# Select features
X = data[['Pclass', 'Age', 'Fare']]

# Fill missing Age values
X['Age'] = X['Age'].fillna(X['Age'].mean())

# Target variable
y = data['Survived']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create model
model = LogisticRegression()

# Train model
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Accuracy
print("Accuracy:", accuracy_score(y_test, y_pred))

# Confusion Matrix
print(confusion_matrix(y_test, y_pred))

# New passenger prediction
new_passenger = [[1, 30, 80]]
prediction = model.predict(new_passenger)

if prediction[0] == 1:
    print("Passenger Survived")
else:
    print("Passenger Did Not Survive")

```

## using Linear regression on student marks problem 

```py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Load Kaggle dataset
data = pd.read_csv('marks.csv')
df = pd.DataFrame(data)
# Select feature and target
X = df[['Study_Hours','Attendance','Assignment_Score']]
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

# Predict a new house
new_student = [[9,80,90]]
predicted = model.predict(new_student)
print("Predicted score:", predicted[0])



plt.figure(figsize=(8, 6))

plt.scatter(y_test, y_pred, color='green', alpha=0.2)

# Perfect prediction line
plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    color='red',
    linestyle='--'
)

plt.xlabel('Actual Marks')
plt.ylabel('Predicted Marks')
plt.title('Actual vs Predicted Marks')
plt.show()

```
## using Logistic Regression on student marks problem 
```py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Load data
df = pd.read_csv('marks.csv')

# Create target column
df['Pass'] = (df['Final_Marks'] >= 40).astype(int)
# Features
X = df[['Study_Hours', 'Attendance', 'Assignment_Score']]

# Target
y = df['Pass']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# print("\nClassification Report:")
# print(classification_report(y_test, y_pred))

# New student
new_student = pd.DataFrame({
    'Study_Hours': [9],
    'Attendance': [80],
    'Assignment_Score': [90]
})

prediction = model.predict(new_student)
probability = model.predict_proba(new_student)

print("Pass Prediction:", prediction[0])
print("Probability of Pass:", probability[0][1])

```