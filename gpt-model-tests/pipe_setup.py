import torch
from transformers import pipeline

device = 0 if torch.cuda.is_available() else -1
dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float32

pipe = pipeline(
    "text-generation",
    model="openai-community/gpt2",
    trust_remote_code=True,
    device=device,
    torch_dtype=dtype
)