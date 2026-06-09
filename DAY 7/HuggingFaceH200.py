# TOPIC 2 - HUGGING FACE ON NVIDIA H200
# Load a model on the GPU and see how much memory it uses.

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL = "Qwen/Qwen2.5-1.5B-Instruct"

# Check the GPU (on the lab box this shows the H200 with ~141 GB)
print("GPU:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU")

tok = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForCausalLM.from_pretrained(MODEL, torch_dtype=torch.bfloat16, device_map="auto")

# How much GPU memory the model takes
if torch.cuda.is_available():
    print("Model uses about", round(torch.cuda.memory_allocated()/1e9, 2), "GB of GPU memory")

# Generate one reply
msg = [{"role": "user", "content": "Explain what a GPU does in one sentence."}]
p = tok.apply_chat_template(msg, tokenize=False, add_generation_prompt=True)
ids = tok(p, return_tensors="pt").to(model.device)
out = model.generate(**ids, max_new_tokens=60, pad_token_id=tok.eos_token_id)
print("Reply:", tok.decode(out[0][ids["input_ids"].shape[1]:], skip_special_tokens=True).strip())

# The H200's big 141 GB memory is what lets you run bigger models and serve
# many users at once without running out of space.
