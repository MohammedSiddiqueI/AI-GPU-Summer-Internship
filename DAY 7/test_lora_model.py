# --------------------------------------------------
# Load and use the trained LoRA adapter
# --------------------------------------------------

import torch
from transformers import AutoTokenizer
from peft import AutoPeftModelForCausalLM

ADAPTER_DIR = "./day7-adapter"

# Load tokenizer saved with the adapter
tokenizer = AutoTokenizer.from_pretrained(ADAPTER_DIR)

# Load PEFT model (base model + LoRA adapter)
model = AutoPeftModelForCausalLM.from_pretrained(
    ADAPTER_DIR,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)

model.eval()

# --------------------------------------------------
# Test prompt
# --------------------------------------------------

prompt = """### Instruction:
Explain what a GPU does in one sentence.

### Response:
"""

inputs = tokenizer(
    prompt,
    return_tensors="pt"
).to(model.device)

with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=80,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
    )

response = tokenizer.decode(
    outputs[0][inputs["input_ids"].shape[1]:],
    skip_special_tokens=True,
)

print("Reply:")
print(response.strip())

# --------------------------------------------------
# Optional: merge LoRA into base model
# --------------------------------------------------

merged_model = model.merge_and_unload()

merged_model.save_pretrained("./merged-model")
tokenizer.save_pretrained("./merged-model")

print("Merged model saved to ./merged-model")