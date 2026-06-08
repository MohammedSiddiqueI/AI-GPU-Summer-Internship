import time
import psutil
import torch
from transformers import (
    AutoTokenizer,
    AutoModel,
    AutoModelForCausalLM
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

TEST_TEXT = """
Machine learning techniques are increasingly used for phishing detection.
Transformers provide strong contextual understanding.
"""

# -------------------------
# Load Models
# -------------------------

bert_model_name = "bert-base-uncased"
gpt_model_name = "gpt2"

print("Loading Models...")

bert_tokenizer = AutoTokenizer.from_pretrained(bert_model_name)
bert_model = AutoModel.from_pretrained(
    bert_model_name
).to(DEVICE)

gpt_tokenizer = AutoTokenizer.from_pretrained(gpt_model_name)

if gpt_tokenizer.pad_token is None:
    gpt_tokenizer.pad_token = gpt_tokenizer.eos_token

gpt_model = AutoModelForCausalLM.from_pretrained(
    gpt_model_name
).to(DEVICE)

# -------------------------
# Benchmark Function
# -------------------------

def benchmark(model, tokenizer, text, model_type):

    process = psutil.Process()

    memory_before = process.memory_info().rss / 1024**2

    tokens = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True
    )

    tokens = {k:v.to(DEVICE) for k,v in tokens.items()}

    start = time.time()

    with torch.no_grad():

        if model_type == "BERT":
            output = model(**tokens)

        else:
            output = model.generate(
                tokens["input_ids"],
                max_new_tokens=50
            )

    end = time.time()

    memory_after = process.memory_info().rss / 1024**2

    total_tokens = tokens["input_ids"].shape[1]

    return {
        "Latency(sec)": round(end-start,4),
        "Tokens": total_tokens,
        "Memory(MB)": round(
            memory_after-memory_before,
            2
        ),
        "Tokens/sec":
            round(total_tokens/(end-start),2)
    }

# -------------------------
# Run Benchmarks
# -------------------------

bert_results = benchmark(
    bert_model,
    bert_tokenizer,
    TEST_TEXT,
    "BERT"
)

gpt_results = benchmark(
    gpt_model,
    gpt_tokenizer,
    TEST_TEXT,
    "GPT"
)

# -------------------------
# Print Results
# -------------------------

print("\n===== Benchmark Results =====")

print("\nBERT")
for k,v in bert_results.items():
    print(k,":",v)

print("\nGPT")
for k,v in gpt_results.items():
    print(k,":",v)

print("\nModel Info")

print("BERT Context Window: 512")
print("GPT2 Context Window: 1024")

print("Device:", DEVICE)