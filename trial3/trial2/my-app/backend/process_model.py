import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import numpy as np

print("Loading model from:", 'disasterfinal3.h5')
loaded_model = load_model('disasterfinal3.h5')

data = {
    'text': [
        "flood", "wildfire", "earthquake", "tornado", "tsunami", "hurricane", 
        "drought", "landslide", "avalanche", "cyclone", "storm", "volcano", 
        "blizzard", "heatwave", "typhoon", "hail", "lightning", "fog", 
        "mudslide", "sinkhole", "monsoon", "snowstorm", "windstorm", 
        "tidalwave", "thunderstorm", "sandstorm"
    ],
    'label': [
        "flood", "wildfire", "earthquake", "tornado", "tsunami", "hurricane", 
        "drought", "landslide", "avalanche", "cyclone", "storm", "volcano", 
        "blizzard", "heatwave", "typhoon", "hail", "lightning", "fog", 
        "mudslide", "sinkhole", "monsoon", "snowstorm", "windstorm", 
        "tidalwave", "thunderstorm", "sandstorm"
    ]
}

df = pd.DataFrame(data)

tokenizer = Tokenizer()
tokenizer.fit_on_texts(df['text'])  

label_encoder = LabelEncoder()
label_encoder.fit(df['label'])

test_df = pd.read_csv('data/input.csv')

print("Column names:", test_df.columns)

if 'Tweet' not in test_df.columns:
    raise ValueError("CSV file must contain a 'Tweet' column.")

max_len = 1  
X_test = tokenizer.texts_to_sequences(test_df['Tweet'])
X_test = pad_sequences(X_test, maxlen=max_len)

def predict_disaster_types(df, model, tokenizer, label_encoder):
    X = tokenizer.texts_to_sequences(df['Tweet'])
    X = pad_sequences(X, maxlen=max_len, padding='post', truncating='post')
    predictions = model.predict(X)
    predicted_labels = label_encoder.inverse_transform([np.argmax(p) for p in predictions])
    return predicted_labels

predicted_disasters = predict_disaster_types(test_df, loaded_model, tokenizer, label_encoder)

test_df['predicted_disaster'] = predicted_disasters

test_df.to_csv('data\output.csv', index=False)
test_df.to_json('data/output.json', index=False)

print("Predictions have been saved to 'predicted_disasters.csv'.")
