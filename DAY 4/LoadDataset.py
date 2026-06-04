# py -3.11 -m pip install transformers datasets torch torchvision pillow matplotlib scikit-learn
from datasets import load_dataset

dataset = load_dataset("dpdl-benchmark/plant_village")

print(dataset)
print(dataset["train"][0])