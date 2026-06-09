# TOPIC 3 - LoRA / PEFT FINE-TUNING
# Teach the model a new trick by training only a tiny number of parameters.

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
from trl import SFTTrainer, SFTConfig

MODEL = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(MODEL)
tok.pad_token = tok.pad_token or tok.eos_token

# Load the model in 4-bit so it fits easily (the "Q" in QLoRA)
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.bfloat16)
model = AutoModelForCausalLM.from_pretrained(MODEL, quantization_config=bnb, device_map="auto")
model = prepare_model_for_kbit_training(model)

# Attach small LoRA adapters (the sticky notes); only these get trained
model = get_peft_model(model, LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05,
                       target_modules=["q_proj", "v_proj"], task_type="CAUSAL_LM"))
model.print_trainable_parameters()   # shows under 1% of parameters are trained

# A small set of example instructions to learn from
data = load_dataset("yahma/alpaca-cleaned", split="train[:200]").map(
    lambda e: {"text": f"### Instruction:\n{e['instruction']}\n\n### Response:\n{e['output']}"})

# Train, then save the tiny adapter (only a few MB)
SFTTrainer(model=model, train_dataset=data, processing_class=tok,
    args=SFTConfig(output_dir="./out", num_train_epochs=1, per_device_train_batch_size=4,
                   learning_rate=2e-4, bf16=True, max_seq_length=512,
                   dataset_text_field="text", report_to="none")).train()
model.save_pretrained("./day7-adapter")
print("Done - adapter saved.")
