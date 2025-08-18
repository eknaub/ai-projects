from fastapi import FastAPI, Request
from pipe_setup import pipe

app = FastAPI()

@app.post("/generate")
async def generate(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    outputs = pipe(prompt, max_new_tokens=256)
    return {"generated_text": outputs[0]["generated_text"]}