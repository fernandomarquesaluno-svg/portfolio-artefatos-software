# Tarefa 8 — registro integral estruturado: Anthropic / Claude Sonnet 5.0 Extra

**Origem:** dois pareceres repassados pelo aluno em 15/11/2026.  
**Interface:** aplicativo de desktop do Claude; modelo declarado **Claude Sonnet 5.0**, modo **Extra**.  
**Escopo:** Selection Agent/K-Agent, SBRC 2026, selos F/R.  
**Natureza:** respostas das LLMs, organizadas editorialmente; não representam uma decisão do CTA nem uma execução nova do artefato.

---

## Parecer 1 — Revisão analítica/documental

**Título recebido:** Parecer do CTA (SBRC 2026) — Artefato “Selection Agent (K-Agent)”  
**Referência:** README, código e scripts do repositório `rafaeloj/sbrc2026` versus https://doc-artefatos.github.io/sbrc2026/revinstrucoes.html.

### Observação metodológica

A LLM informou que não executou o artefato por depender de Ollama e, segundo sua avaliação inicial, GPU. Classificou o parecer como preliminar e condicionado à etapa prática. Resumiu F como capacidade de executar e observar funcionalidades, com documentação de dependências, ambiente, instalação e exemplo; R como reprodução das principais reivindicações, tabelas e figuras com instruções específicas.

### F — Funcional

**Veredito:** **recomendar atribuição condicionada à execução efetiva**.

**Evidências favoráveis registradas:**

- O README tem dependências (`requirements.txt`, `pyproject.toml`), versões `torch==2.7.1`, `flwr==1.23.0`, Linux/8 núcleos/16GB, GPU opcional, instalação com venv/pip e Ollama `qwen3:0.6b`.
- Teste mínimo `flwr run . local-simulation`, saída esperada `models/..._final_model_.pt` e logs de treinamento/avaliação.
- O código não seria apenas *stub*: `agent/k_agent.py` implementa agente LangChain/LangGraph com `ChatOllama`, ferramentas, controle de exceção e tentativas de recuperação; os arquivos `server_app.py`, `client_app.py`, estratégias e agente existem.
- A opção `random` do teste mínimo reduz a barreira inicial, pois não necessita da LLM.

**Falhas/lacunas registradas:**

- O arquivo `pyproject.toml` reserva `options.backend.init_args.num_gpus = 1` e `client-resources.num-gpus = 0.2`, enquanto o README trata GPU como opcional; não explica claramente como sobrescrever em ambientes sem GPU.
- Não encontrou testes unitários automatizados nem pipeline CI no escopo inspecionado, de modo que a confirmação dependeria da execução manual.
- Considerou pouco aprofundadas as preocupações de segurança, descrevendo apenas avisos relacionados a Ollama; **a auditoria posterior observou uma seção de segurança mais extensa**.

### R — Experimentos Reprodutíveis

**Veredito:** **recomendar atribuição, restrita às reivindicações #1 e #2 e condicionada à execução efetiva**. O Claude observou que reproduzir integralmente as tabelas 2 e 3 seria inviável no tempo normal de revisão.

**Evidências favoráveis registradas:**

- README estrutura as reivindicações #1 e #2 com parâmetros, hardware, duração estimada (~3 h e ~2 h), comandos, saída esperada, faixa de redução de tráfego 44,4%–59% e notebooks `figura2-figura-3.ipynb` / `figura4.ipynb`.
- Existem dados brutos em `results/sbrc/{mnist,cifar10}/...`, incluindo muitos `federation_data.json` para `k-agent`, `oort`, `poc`, `rrobin` e `random`, com repetições; são úteis para verificar cálculos, embora não substituam execução independente.
- O script `scripts/k_agent_prompt_type.sh` menciona `# Tempo de Execução: ~240h`; delimitar duas reivindicações de reprodução seria compatível com a orientação de escolher resultados principais viáveis.

**Falhas/lacunas registradas:**

- Reivindicação #1 depende de Ollama `qwen3:0.6b` e GPU implicitamente reservada no backend; não há fallback CPU claramente descrito.
- Não foi encontrada fixação de *seeds*; o resultado em intervalo seria compatível com estocasticidade, mas prejudicaria reprodutibilidade numérica estrita.
- Reproduzir tabelas 2 e 3 completas exigiria confiar nos dados já publicados em vez de fazer a grade experimental completa, devendo ser declarado como limitação.
- Não foram detalhados os números de repetições estatísticas por configuração; o código e os dados sugeriam informalmente três repetições.

### Recomendação documental ao comitê

**Recomendação:** F e R (somente reivindicações #1 e #2) como pareceres favoráveis **dependentes de confirmação prática**, solicitando esclarecimentos no *rebuttal* sobre o requisito de GPU em `pyproject.toml`. A linguagem “atribuir” neste parecer não significa que o selo tenha sido concedido formalmente sem execução.

---

## Parecer 2 — Reavaliação pós-execução histórica da Tarefa 7

**Título recebido:** Reavaliação do Parecer — Artefato “Selection Agent (K-Agent)” (pós-execução, Tarefa 7)

### 1–2. Confirmação/revisão

| Selo | Parecer anterior | Parecer revisado |
|---|---|---|
| F | Recomendado, condicionado à execução | **Mantido — confirmado** |
| R | Recomendado para reivindicações #1 e #2, condicionado à execução | **Revisado para baixo — não confirmado neste ciclo** |

### 3. Evidências e decisões

**F — mantido.** O Claude interpretou o critério oficial como exigência de que o artefato possa ser executado e o revisor consiga observar **algumas** funcionalidades, com prova de saída. O Teste 1 corresponde ao teste mínimo no README: `selection-method='random'`, `num-server-rounds=1`, `flwr run . local-simulation` → `[SUCCESS] Simulation finished`. Isso demonstra que a execução da estratégia não dependente de LLM funciona no ambiente Ubuntu 22.04/Python 3.10/PyTorch 2.7.1/8 vCPUs/16GB, sem GPU. Não exigiria testar todas as funcionalidades nem um número fixo de rodadas. A confirmação de F foi limitada à evidência do teste mínimo, mantendo ressalva de que K-Agent não foi validado naquela tentativa.

**R — revisado para baixo.** O critério demanda reproduzir as principais reivindicações. O Teste 1 é apenas verificação inicial, não reivindicação do artigo. A reivindicação #1 depende de K-Agent e foi bloqueada no Ollama; a reivindicação #2, com Oort e amostragem dinâmica, **não foi tentada** no conjunto apresentado. Assim, a reprodução **não ocorreu**; isso não é prova de falha do algoritmo, mas insuficiência da evidência necessária para conceder R neste ciclo.

### 4. Ambiente versus defeito comprovado

- `ConnectionRefusedError: [Errno 111]` é sintoma usual de Ollama não iniciado ou inacessível; o README pede `ollama serve` separadamente para `k-agent`. Não há confirmação de que essa pré-condição foi satisfeita. O modelo considerou mais parcimonioso classificar como problema operacional, não erro lógico.
- O risco anterior de GPU não se manifestou no caminho `random`: esse teste funcionou no ambiente sem GPU. Isso **não garante** o mesmo para todos os cenários.
- Sem *stack trace* completo, o parecer não determina se a exceção foi capturada por `try/except` em `k_agent.py::sample_clients` ou surgiu antes, na inicialização; registrou a lacuna em vez de declarar defeito.

### 5. Funcionalidades demonstradas versus não verificadas

**Demonstradas no Teste 1 conforme o relato recebido:** instalação/resolução de dependências, motor Flower com servidor e clientes, agregação/treinamento/avaliação, baseline `random` e compatibilidade com o ambiente CPU-only no caminho testado.

**Não verificadas pelos logs apresentados:** K-Agent em si; outras estratégias `oort_selection`, `poc_selection`, `round_robin_selection`, `random_selections` e `deev_selection`; reivindicação #1 (redução de tráfego 44,4%–59%); reivindicação #2 (robustez/Oort); execução longa e lote completo ~240h.

### 6. Veredito consolidado

| Selo | Decisão do Claude | Fundamentação |
|---|---|---|
| F | **Atribuir** | O piso textual de “algumas funcionalidades” seria satisfeito pelo teste mínimo oficial concluído com saída; ressalva sobre o K-Agent não demonstrado naquela rodada. |
| R | **Não atribuir neste ciclo (pendente)** | Nenhuma reivindicação-alvo foi reproduzida com os logs informados. |

**Recomendação para *rebuttal*:** pedir verificação explícita do serviço Ollama antes da execução do agente, uma mensagem de erro instrutiva, repetir o Teste 2 com `ollama serve` ativo e tentar a reivindicação #2, que não depende de LLM. A expressão “causa identificada e corrigível” deve ser entendida com cuidado, pois a recusa de conexão não determina sozinha a causa exata.

---

**Nota de arquivo:** duas respostas recebidas e organizadas editorialmente por assunto, sem nova execução. O Prompt 1 e o Prompt 2 completos encontram-se na seção de metodologia do relatório principal. As declarações de modelo e esforço vêm do aluno, não de metadados da plataforma.
