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