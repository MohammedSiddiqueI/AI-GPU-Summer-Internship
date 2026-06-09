# TOPIC 1 - PROMPT ENGINEERING
# Same task asked three ways, so students see better prompts give better answers.

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForCausalLM.from_pretrained(MODEL, torch_dtype=torch.bfloat16, device_map="auto")

def ask(text, n=120):
    msg = [{"role": "user", "content": text}]
    p = tok.apply_chat_template(msg, tokenize=False, add_generation_prompt=True)
    ids = tok(p, return_tensors="pt").to(model.device)
    out = model.generate(**ids, max_new_tokens=n, pad_token_id=tok.eos_token_id)
    return tok.decode(out[0][ids["input_ids"].shape[1]:], skip_special_tokens=True).strip()

# Zero-shot: just ask
print("Zero-shot:", ask("Is this review positive or negative? 'Broke in two days.'", 10))

# Few-shot: show the pattern first
print("Few-shot :", ask("good->Positive  bad->Negative  'fast and reliable'->", 5))

# Chain-of-thought: ask it to think step by step (gives smarter answers)
print("Step-by-step:", ask("Solve step by step: a train goes 60km in 1.5h. Average speed?"))
