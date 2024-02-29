# 水杉大模型


| 项目           | 详情                                                                                                  |
|----------------|-------------------------------------------------------------------------------------------------------|
| 开发机构       | 华东师范大学数据学院                                                                                               |
| 简介       | 一个支持中英双语的代码大模型，拥有代码理解、生成和多轮对话能力                                                               |
| 变体           | 在不同数据指令微调的多个版本。所有变体都为7B 参数。                                                     |
| 提问           | 同时支持代码和自然语言。                                                                              |
| 回答           | 同时支持代码和自然语言。                                                                              |
| 模型架构       | 水杉大模型使用自回归语言模型LLaMA2 7B作为底层架构，支持最大4096词元的输入。                             |
| 模型日期       | 水杉大模型及其变体自2023年8月开始训练，2024年2月发布初版，正持续探索中。                                 |
| 状态           | 一个在离线数据集上训练的静态模型。未来版本将在社区反馈后发布。                                          |
| 许可           | 应学院要求，水杉大模型技术暂时闭源。                                                                  |
| 访问链接       | 水杉大模型通过vLLM部署，web框架使用FastAPI，访问链接如下([http://shuishanllm.com](http://shuishanllm.com))。 |                                                         |
| 硬件支持       | 水杉大模型使用8张A100-40GB训练，1张A100-40GB推理。                                                      |
| 训练数据       | 水杉大模型使用经过高质量过滤且有合规开源许可的百万级代码与对话数据进行训练，部分处理前开源数据来源参阅数据章节，对话数据部分使用自研框架HugNLP数据。|
| 评测结果       | 2024年2月在HumanEval-Python上达到80.5的pass@1，超越Deepseek-Coder Instruct 33B的79.3。                |
| 伦理局限与免责声明 | 水杉大模型所使用数据由开源资源构成，且当前训练的模型属于SFT(Supervised Fine-tuning)模型，在某些情况下，该模型可能会对用户的提示做出不准确或令人反感的反应。因此，在部署任何模型应用程序之前，开发者应该根据他们对模型的具体应用进行安全测试和调整。模型禁止商用，由于使用者恶意使用导致的法律道德诉讼等危害或风险，本团队概不负责。所有解释权归本团队所有。|
