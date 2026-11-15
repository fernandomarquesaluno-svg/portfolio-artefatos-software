# Arquivo de pareceres — Tarefa 8

**Artefato:** [Selection Agent / K-Agent](https://github.com/rafaeloj/sbrc2026/tree/949f83c6db86d682240b7a61d1d2d406609413b6)  
**Evento:** SBRC 2026 — critérios F e R  
**Data dos pareceres:** 15/11/2026  
**Origem dos textos:** mensagens dos modelos encaminhadas pelo aluno neste projeto.

## Inventário das seis respostas

| Provedor / configuração declarada | Parecer analítico | Parecer após logs | Registro |
|---|---|---|---|
| OpenAI / GPT-6, High | Favorável a F; favorável com ressalvas a R; ambos condicionais | F parcial; R parcial | [Registro 01](01_openai_gpt6_high.md) |
| Google / Gemini 4 Hydrogen Thinking | F não atribuído; R não atribuído | F não atribuído; R não atribuído | [Registro 02](02_google_gemini_4_hydrogen_thinking.md) |
| Anthropic / Claude Sonnet 5.0 Extra | F e R favoráveis, condicionados à execução | F atribuir; R não atribuir neste ciclo | [Registro 03](03_anthropic_claude_sonnet_5_extra.md) |

Cada registro reúne **as duas avaliações da respectiva LLM**, com seções de evidências e justificativas. Foram preservados os tópicos e as decisões **em estrutura editorial**, normalizando a formatação colada pelo aluno; **não são dumps de chat nem transcrições literais byte a byte**. Esta distinção é relevante para auditoria acadêmica. As respostas originaram-se da interface e não são experimentos executados por nós.

Os **dois prompts completos** e os limites de configuração estão em [relatorio.md](../relatorio.md); a tabela reprocessável, em [comparacao_t7_t8.csv](../comparacao_t7_t8.csv). A linha de base da Tarefa 7 foi confrontada com seu [CSV histórico](https://github.com/fernandomarquesaluno-svg/ativ_revisao_artfatos_multiplas_llms/blob/main/comparacao_llms.csv) e suas [transcrições originais](https://github.com/fernandomarquesaluno-svg/ativ_revisao_artfatos_multiplas_llms/tree/main/evidencias).

## Registro de proveniência e controles

- **Modelos/esforços:** declarados pelo aluno, sem captura independente de interface. O controle adicional de esforço do Gemini não foi documentado; “Thinking” não equivale a um nível numérico máximo verificado.
- **Artefato auditado:** SHA `949f83c6db86d682240b7a61d1d2d406609413b6` do repositório público; o commit da tentativa histórica Ubuntu não foi comprovado.
- **Conjunto de evidências enviado:** trechos de `random` concluído e tentativa `k-agent` interrompida por conexão recusada com Ollama; o teste posterior de duas rodadas bem-sucedidas **não** foi incluído nas entradas das LLMs.
- **Etapas:** os pareceres documentais não executaram o artefato; os pareceres pós-logs interpretaram saídas fornecidas pelo aluno, sem nova execução.
- **Terminologia:** “parcial” é categoria descritiva do experimento, **não** um selo oficial do evento.
- **Causalidade:** não há isolamento do efeito de esforço; houve mudanças simultâneas de versão, esforço e redação dos prompts entre tarefas, e apenas uma amostra por configuração.

## Auditoria factual mínima (verificação direta)

| Afirmação de LLM | Checagem no artefato fixado | Consequência |
|---|---|---|
| Gemini: helper `utils/k_start_ollama.sh` não existe | [scripts/utils/k_start_ollama.sh](https://github.com/rafaeloj/sbrc2026/blob/949f83c6db86d682240b7a61d1d2d406609413b6/scripts/utils/k_start_ollama.sh) **existe** e é chamado pelo script na mesma pasta | Não usar ausência como defeito comprovado |
| Gemini: argumento `0` não tem explicação no script | [k_agent_prompt_type.sh](https://github.com/rafaeloj/sbrc2026/blob/949f83c6db86d682240b7a61d1d2d406609413b6/scripts/k_agent_prompt_type.sh) documenta `Usage: $0 <CUDA_DEVICE_IDS>` e usa `$1` em `CUDA_VISIBLE_DEVICES` | Distinguir clareza do README da existência do argumento no código |
| Gemini: script não escolhe dataset | O mesmo script declara `DATASETS=("mnist" "cifar10")` e passa a escolha por `dataset-name` | Alegação genérica refutada; mapeamento preciso de cada figura permanece questão distinta |
| Claude: teste mínimo usa `random` e não requer inferência LLM | README e `selection-agent/pyproject.toml` apontam para cenário mínimo com seleção aleatória | Teste positivo sustenta funcionalidade básica; não reproduz K-Agent nem resultados científicos |
| GPT-6: falha Ollama não prova defeito algorítmico | `ConnectionRefusedError` é sintoma de transporte; logs resumidos não identificam causa raiz | Não classificar falha do algoritmo sem mais dados |

## Conclusão de rastreabilidade

O conjunto disponível é suficiente para **comparar decisões das LLMs e auditar várias evidências documentais**. Não é suficiente para afirmar reprodução independente de 44,4%–59% de redução de tráfego ou atribuir causalidade isolada ao maior esforço de raciocínio. As decisões oficiais D/F/S/R, publicadas pelo SBRC 2026, continuam separadas dos pareceres experimentais.
