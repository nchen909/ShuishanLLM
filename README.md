# cocode
CodeLlama-7b-Instruct-sft

## codellama-7b-chinese-sft-v1

### model

 codellama-7b-instruct-on-alpaca_gpt4_zh-v1

https://huggingface.co/datasets/nchen909/codellama-7b-chinese-sft-v1

alpaca_gpt4_zh

### sft

```
deepspeed --num_gpus 8 --master_port=9901 src/train_bash.py     --deepspeed ds_config.json     --stage sft     --model_name_or_path CodeLlama-7b-Instruct-hf     --do_train     --dataset alpaca_gpt4_zh     --template default     --finetuning_type lora     --lora_target q_proj,v_proj     --output_dir path_to_sft_checkpoint     --overwrite_cache     --per_device_train_batch_size 4     --gradient_accumulation_steps 4     --lr_scheduler_type cosine     --logging_steps 10     --save_steps 1000     --learning_rate 5e-5     --num_train_epochs 3.0     --plot_loss     --fp16     --overwrite_output_dir
```

deepspeed setting on training:

```
  {
    "train_batch_size": "auto",
    "train_micro_batch_size_per_gpu": "auto",
    "gradient_accumulation_steps": "auto",
    "gradient_clipping": "auto",
    "zero_allow_untested_optimizer": true,
    "fp16": {
      "enabled": "auto",
      "loss_scale": 0,
      "initial_scale_power": 16,
      "loss_scale_window": 1000,
      "hysteresis": 2,
      "min_loss_scale": 1
    },
    "zero_optimization": {
      "stage": 2,
      "allgather_partitions": true,
      "allgather_bucket_size": 5e8,
      "reduce_scatter": true,
      "reduce_bucket_size": 5e8,
      "overlap_comm": false,
      "contiguous_gradients": true
    }
  }
```

### inference:

```
CUDA_VISIBLE_DEVICES=0 python src/train_bash.py     --stage sft     --model_name_or_path CodeLlama-7b-Instruct-hf     --do_predict     --dataset codealpaca     --template default     --finetuning_type lora     --checkpoint_dir path_to_sft_checkpoint     --output_dir path_to_predict_result     --per_device_eval_batch_size 8     --max_samples 100     --predict_with_generate
```

### data: codealpaca/the_stack/starcoder & tool: toollama
