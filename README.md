# 水杉大模型

中文增强的代码大模型
# 水杉大模型细节

| 项目           | 详情                                                                                                  |
|----------------|-------------------------------------------------------------------------------------------------------|
| 开发机构       | 华东师范大学数据学院                                                                                  |
| 开发者         | nuochen、wujwyi                                                                                          |
| 变体           | 在不同数据指令微调的多个版本。所有变体都为7B 参数。                                                     |
| 提问           | 同时支持代码和自然语言。                                                                              |
| 回答           | 同时支持代码和自然语言。                                                                              |
| 模型架构       | 水杉大模型使用自回归语言模型LLaMA2 7B作为底层架构，支持最大4096词元的输入。                             |
| 模型日期       | 水杉大模型及其变体自2023年8月开始训练，正持续探索中。                                                   |
| 状态           | 一个在离线数据集上训练的静态模型。未来版本将在社区反馈后发布。                                          |
| 许可           | 水杉大模型暂时闭源。                                                                                  |
| 访问链接       | 水杉大模型可通过FastAPI进行交互，访问链接如下([http://link/predict?input_text=question](http://link/predict?input_text=question)). |
| 软件       | 水杉大模型使用LLaMA-Efficient-Tuning ([链接](https://github.com/hiyouga/LLaMA-Factory))//与自研NLP框架HugNLP ([链接](https://github.com/HugAILab/HugNLP))进行训练。 |
| 硬件支持   | 水杉大模型使用8张A100-40GB训练，1张A100-40GB推理。                                                      |
| 训练数据   | 水杉大模型使用经过高质量过滤且有合规开源许可的百万级代码与对话数据进行训练，部分处理前开源数据来源参阅数据章节，对话数据使用自研框架HugNLP数据。
| 评测结果   | 参阅模型评估章节。
| 伦理局限与免责声明   | 水杉大模型所使用数据由开源资源构成，且当前训练的模型属于SFT(Supervised Fine-tuning)模型，在某些情况下，该模型可能会对用户的提示做出不准确或令人反感的反应。因此，在部署任何模型应用程序之前，开发者应该根据他们对模型的具体应用进行安全测试和调整。模型禁止商用，由于使用者恶意使用导致的法律道德诉讼等危害或风险，本团队概不负责。所有解释权归本团队所有。


## Datasets

[部分代码sft中英文数据](https://huggingface.co/datasets/nchen909/hugcode-codesft)

## Models

[codellama-7b-chinese-sft-v1](https://huggingface.co/nchen909/codellama-7b-chinese-sft-v1)

微调数据包括alpaca_gpt4_zh等

[codellama-7b-python-sft-v1.1](https://huggingface.co/nchen909/codellama-7b-python-sft-v1.1)

微调数据包括Evol-Instruct-Python等

[codellama-7b-chinese-sft-v1.2](https://huggingface.co/nchen909/codellama-7b-chinese-sft-v1.2)

微调数据包括CodeGPT等

[codellama-7b-sft-v1.3](https://huggingface.co/nchen909/codellama-7b-sft-v1.3)

清洗并收集大量中英文代码数据用于对话

[codellm-7b-v1.4](https://huggingface.co/nchen909/codellm-7b-v4)

## Getting Started

### Data Preparation

修改data/datasets_info.json，数据格式

```
"codegpt": {
    "file_name": ".../code_instruct.json"
    "columns": {
      "prompt": "instruction",
      "query": "input",
      "response": "output",
      "history": "history"
     }
```

### SFT with lora

```bash
deepspeed --num_gpus 8 --master_port=9901 src/train_bash.py     --deepspeed ds_config.json     --stage sft     --model_name_or_path /nchen909/workspace/codelab/CodeLlama-7b-Instruct-hf     --do_train     --dataset codesft     --template default     --finetuning_type lora     --lora_target q_proj,v_proj     --output_dir path_to_sft_checkpoint     --overwrite_cache     --per_device_train_batch_size 4     --gradient_accumulation_steps 4     --lr_scheduler_type cosine     --logging_steps 10     --save_steps 1000     --learning_rate 5e-5     --num_train_epochs 3.0     --plot_loss     --fp16     --overwrite_output_dir
```

### SFT with full param

```bash
deepspeed --num_gpus 8 --master_port=9901 src/train_bash.py --deepspeed ds_config_zero3.json --stage sft --model_name_or_path /nchen909/workspace/codelab/CodeLlama-7b-Instruct-hf --do_train --dataset code_exer --template default --finetuning_type full --output_dir path_to_sft_checkpoint --overwrite_cache --per_device_train_batch_size 1 --gradient_accumulation_steps 16 --lr_scheduler_type cosine --logging_steps 10 --save_steps 1000 --learning_rate 5e-5 --num_train_epochs 3.0 --fp16 --plot_loss  --overwrite_output_dir
```

### Test

```bash
python src/cli_demo.py     --model_name_or_path /nchen909/workspace/codelab/CodeLlama-7b-Instruct-hf     --template default     --finetuning_type lora     --checkpoint_dir checkpoint-30000
```

### Predict

```bash
CUDA_VISIBLE_DEVICES=0 python src/train_bash.py     --stage sft     --model_name_or_path /nchen909/workspace/codelab/CodeLlama-7b-Instruct-hf     --do_predict     --dataset codealpaca     --template default     --finetuning_type lora     --checkpoint_dir path_to_sft_checkpoint     --output_dir path_to_predict_result     --per_device_eval_batch_size 8     --max_samples 100     --predict_with_generate
```

### Convert ckpt to hf 

```bash
python src/export_model.py \
    --model_name_or_path /nchen909/workspace/codelab/CodeLlama-7b-Instruct-hf \
    --template default \
    --finetuning_type lora \
    --checkpoint_dir path_to_sft_checkpoint \
    --output_dir v1.3
```

### Upload model to huggingface

```python
>>> from huggingface_hub import HfApi
>>> api = HfApi()
>>> api.upload_folder(
...     folder_path="checkpoint-30000",
...     repo_id="username/reponame",
...     repo_type="model",
... )
```



## 效果

 支持中文对话，包含代码生成、翻译、修复等功能

![image-20230919150932942](README.assets/image-20230919150932942.png)

![image-20230919150939275](README.assets/image-20230919150939275.png)

![image-20230919150942773](README.assets/image-20230919150942773.png)

![image-20230919150944992](README.assets/image-20230919150944992.png)
<img width="1437" alt="image" src="https://github.com/nchen909/ChineseCodeLlaMA/assets/40982544/405c3255-551a-4b55-9dfc-3c29ac602632">

[演示视频链接](https://markdown-picture-1302861826.cos.ap-shanghai.myqcloud.com/%E5%BD%95%E5%88%B6_2024_01_31_22_09_03_577%20%282%29.mp4)