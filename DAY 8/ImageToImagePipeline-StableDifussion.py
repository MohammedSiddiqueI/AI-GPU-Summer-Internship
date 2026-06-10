pip install diffusers transformers accelerate torch pillow

from diffusers import StableDiffusionImg2ImgPipeline

from PIL import Image

import torch

# Select device

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Stable Diffusion Image-to-Image Model

pipe = StableDiffusionImg2ImgPipeline.from_pretrained(

"runwayml/stable-diffusion-v1-5",

torch_dtype=torch.float16 if device == "cuda" else torch.float32

)

pipe = pipe.to(device)

# Load Input Cat Image

init_image = Image.open("/content/images (5).jpg").convert("RGB")

init_image = init_image.resize((512, 512))

# Prompt

prompt = """

A cute fluffy white cat sitting in a magical garden,

highly detailed, realistic, cinematic lighting,

4k quality

"""# Generate New Image

result = pipe(

prompt=prompt,

image=init_image,

strength=0.6, # 0-1 (higher = more changes)

guidance_scale=7.5

)

generated_image = result.images[0]

# Save Output

generated_image.save("generated_cat.png")

print("Image generated successfully!")



# # Install dependencies
# # !pip install -U diffusers transformers accelerate safetensors torch pillow

# from diffusers import StableDiffusionImg2ImgPipeline
# from PIL import Image
# import torch

# # --------------------------------------------------
# # Device Setup
# # --------------------------------------------------
# device = "cuda" if torch.cuda.is_available() else "cpu"
# print("Using device:", device)

# # --------------------------------------------------
# # Load Stable Diffusion Img2Img Model
# # --------------------------------------------------
# pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
#     "runwayml/stable-diffusion-v1-5",
#     torch_dtype=torch.float16 if device == "cuda" else torch.float32,
#     safety_checker=None
# )

# # Memory optimizations
# if device == "cuda":
#     pipe.enable_attention_slicing()

# pipe = pipe.to(device)

# # --------------------------------------------------
# # Load and Prepare Input Image
# # --------------------------------------------------
# image_path = "sample_data/cat.jpg"  # Change to your image path

# init_image = Image.open(image_path).convert("RGB")
# init_image = init_image.resize((512, 512))

# print("Image loaded successfully")
# print("Size:", init_image.size)
# print("Mode:", init_image.mode)

# # --------------------------------------------------
# # Prompt
# # --------------------------------------------------
# prompt = (
#     "A demonic stupid cat with down syndromne sitting in a magical garden, "
#     "highly detailed, realistic, cinematic lighting, "
#     "ultra detailed, 4k quality, masterpiece"
# )

# negative_prompt = (
#     " bad anatomy"
# )

# # --------------------------------------------------
# # Generate Image
# # --------------------------------------------------
# generator = torch.Generator(device=device).manual_seed(42)

# if device == "cuda":
#     with torch.autocast("cuda"):
#         result = pipe(
#             prompt=prompt,
#             negative_prompt=negative_prompt,
#             image=init_image,
#             strength=0.6,
#             guidance_scale=7.5,
#             num_inference_steps=30,
#             generator=generator
#         )
# else:
#     result = pipe(
#         prompt=prompt,
#         negative_prompt=negative_prompt,
#         image=init_image,
#         strength=0.6,
#         guidance_scale=7.5,
#         num_inference_steps=30,
#         generator=generator
#     )

# generated_image = result.images[0]

# # --------------------------------------------------
# # Save Output
# # --------------------------------------------------
# output_path = "generated_cat.png"
# generated_image.save(output_path)

# print(f"Image generated successfully!")
# print(f"Saved as: {output_path}")
