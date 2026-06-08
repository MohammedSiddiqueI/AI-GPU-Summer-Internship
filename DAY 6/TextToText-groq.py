from groq import Groq

client =Groq(api_key="api_key")

response=client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role":"user",
            "content":"what is unit of current "
        }
    ]
)

print(response.choices[0].message.content)