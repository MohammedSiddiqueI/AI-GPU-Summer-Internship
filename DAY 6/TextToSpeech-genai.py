# from google import genai
# from google.genai import types
# import wave

# client = genai.Client(
#     api_key=("api_key")
# )

# response = client.models.generate_content(
#     model="gemini-2.5-flash-preview-tts",
#     contents="Explain theory of relativity",
#     config=types.GenerateContentConfig(
#         response_modalities=["AUDIO"],
#         speech_config=types.SpeechConfig(
#             voice_config=types.VoiceConfig(
#                 prebuilt_voice_config=types.PrebuiltVoiceConfig(
#                     voice_name="Kore"
#                 )
#             )
#         )
#     )
# )

# audio_data = response.candidates[0].content.parts[0].inline_data.data

# with open("output.wav", "wb") as f:
#     f.write(audio_data)

# print("Audio saved as output.wav")


from google import genai
from google.genai import types


client = genai.Client(
    api_key=("api_key")
)

user_prompt = input("Ask Gemini: ")

# Step 1: Generate response
text_response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=user_prompt
)

answer = text_response.text

print("\nGemini Response:\n")
print(answer)

# Step 2: Convert response to speech
audio_response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=answer,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Kore"
                )
            )
        )
    )
)

audio_data = (
    audio_response.candidates[0]
    .content.parts[0]
    .inline_data.data
)

with open("gemini_response.wav", "wb") as f:
    f.write(audio_data)

print("\nSpeech saved as gemini_response.wav")