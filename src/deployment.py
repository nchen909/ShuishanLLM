import uvicorn
from fastapi import FastAPI
# transfomers是huggingface提供的一个工具，便于加载transformer结构的模型
# https://huggingface.co
from transformers import AutoTokenizer, AutoModelForCausalLM


app = FastAPI()


def load_model(model_path):
    tokenizer = AutoTokenizer.from_pretrained(
        "ckpt", trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        "ckpt", trust_remote_code=True).cuda()
    return tokenizer, model


tokenizer, model = load_model(model_path)
@app.get('/predict')
async def predict(input_text, max_length=256, top_p=0.6, num_return_sequences=5):
    prompt = input_text
    conversation=[]
    conversation.append({'role': 'user', 'content': prompt})
    print("conversation")
    inputs = tokenizer.apply_chat_template(
        conversation, return_tensors="pt").to(model.device)
    outputs = model.generate(inputs, max_new_tokens=512, do_sample=False, top_k=50, top_p=0.95, num_return_sequences=1,
                             eos_token_id=32021, pad_token_id=32021)
    response=tokenizer.decode(outputs[0][len(inputs[0]):], skip_special_tokens=True)

    return response

if __name__ == '__main__':
    #　在调试的时候开源加入一个reload=True的参数，正式启动的时候可以去掉
    uvicorn.run(app, host="0.0.0.0", port=6605, log_level="info")
