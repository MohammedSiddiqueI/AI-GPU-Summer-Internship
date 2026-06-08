from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client(
    api_key=("api_key")
)

prompt = """
Create a futuristic AI laboratory with
students learning machine learning,
holographic displays, realistic style.
"""

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"]
    )
)

for i, part in enumerate(response.candidates[0].content.parts):

    if part.inline_data:

        image = Image.open(
            BytesIO(part.inline_data.data)
        )

        image.save(f"generated_image_{i}.png")

        print(f"Saved generated_image_{i}.png")