# TOPIC 3 (part 2) - USE THE TRAINED ADAPTER
# Run this after 3_lora_finetuning has saved ./day7-adapter

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

MODEL = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(MODEL)

# Load the big base model, then stick the tiny trained adapter on top
base = AutoModelForCausalLM.from_pretrained(MODEL, torch_dtype=torch.bfloat16, device_map="auto")
model = PeftModel.from_pretrained(base, "./day7-adapter")

# Ask it something
prompt = "### Instruction:\nExplain what a GPU does in one sentence.\n\n### Response:\n"
ids = tok(prompt, return_tensors="pt").to(model.device)
out = model.generate(**ids, max_new_tokens=80, pad_token_id=tok.eos_token_id)
print("Reply:", tok.decode(out[0][ids["input_ids"].shape[1]:], skip_special_tokens=True).strip())

# Optional: merge the adapter into the base model for fast deployment
merged = model.merge_and_unload()
print("Adapter merged into the model - ready to deploy.")
