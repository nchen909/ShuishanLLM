from transformers import AutoTokenizer, AutoModelForCausalLM
import warnings
from transformers import logging

logging.set_verbosity_warning()
warnings.filterwarnings("ignore")

tokenizer = AutoTokenizer.from_pretrained("ckpt", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("ckpt", trust_remote_code=True).cuda()

conversation = []
while(1):
    print("User >>> ",end='')
    prompt=input("")
    conversation.append({ 'role': 'user', 'content': prompt})
    inputs = tokenizer.apply_chat_template(conversation, return_tensors="pt").to(model.device)
    outputs = model.generate(inputs, max_new_tokens=512, do_sample=False, top_k=50, top_p=0.95, num_return_sequences=1, 
    eos_token_id=32021, pad_token_id=32021)
    print("Model >>> ")
    response=tokenizer.decode(outputs[0][len(inputs[0]):], skip_special_tokens=True)
    print(response)
    conversation.append({ 'role': 'assistant', 'content': response})