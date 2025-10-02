# Traffic Dashboard (capture real)

Backend em **FastAPI** que captura tráfego de rede em tempo real com **Scapy** e expõe endpoints REST para um frontend de dashboard de tráfego. Este repositório substitui a simulação por captura real usando um `SERVER_IP` configurável diretamente no código.

---

## Funcionalidades

* Captura passiva de pacotes (Scapy `sniff`) em background.
* Classificação de tráfego por IPs clientes (`in` / `out`) com base no `SERVER_IP` definido.
* Agregação por protocolo simples (HTTP, HTTPS, FTP, SSH, DNS, OTHER).
* Histórico agregado em memória (últimos 300 snapshots — ~5 minutos) usando `collections.deque`.
* Endpoints REST compatíveis com o frontend original:

  * `/` — status e `server_ip` detectado/configurado
  * `/traffic` — lista de clientes ordenados por bytes total
  * `/protocols` — breakdown por protocolo
  * `/traffic_history` — buckets de histórico dos últimos N segundos

---

## Estrutura principal do projeto

* `main.py` — aplicação FastAPI principal com captura e rotas.
* `requirements.txt` — dependências Python (ver seção instalação).
* `README.md` — este arquivo.

---

## Requisitos

* Python 3.10+ (recomendado)
* Scapy (`pip install scapy`)
* FastAPI + uvicorn (`pip install fastapi uvicorn`)
* No Windows: **Npcap** instalado (substitui WinPcap) — necessário para captura de pacotes.

---

## Instalação rápida

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd <REPO>
```

2. Crie e ative um ambiente virtual (recomendado):

```bash
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
```

3. Instale dependências:

```bash
pip install -r requirements.txt
# ou
pip install fastapi uvicorn scapy
```

4. (Windows) Instale o Npcap: baixe em [https://npcap.com/](https://npcap.com/) e execute o instalador com privilégios de administrador. Marque a opção "WinPcap API-compatible Mode" se quiser compatibilidade. Reinicie o sistema se solicitado.

---

## Configuração

Abra `main.py` e localize a linha:

```python
SERVER_IP = "SEU_IPV4_AQUI"
```

Substitua por seu IPv4 (ex.: `"192.168.0.42"`).

**Opções adicionais no código**:

* `capture_loop(iface=None, bpf_filter=None)` — a função `sniff` aceita `iface` e `filter` para monitorar uma interface específica e aplicar filtros BPF (ex: `"tcp or udp"`).
* Se preferir configurar via variável de ambiente ou endpoint, você pode adaptar o código para aceitar `SERVER_IP` por env var ou criar rota para atualizar em runtime.

---

## Como rodar

**Linux / macOS (recomendado com sudo para permitir captura):**

```bash
sudo uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Windows:**

* Abra o terminal como Administrador (importante) e rode:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Observação:** Capturar pacotes exige privilégios especiais — no Linux normalmente `root`, no Windows execute como Administrador.

---

## Endpoints (exemplos)

* `GET /` — health:

```bash
curl http://localhost:8000/
# resposta:
# {"message":"Backend (real capture) OK","time":... , "server_ip": "192.168.0.42"}
```

* `GET /traffic?limit=10` — top N clients:

```bash
curl "http://localhost:8000/traffic?limit=5"
```

Retorno JSON: `{ window, clients: [{ip, bytes_in, bytes_out, total, protocols}], generated_at }`

* `GET /protocols` — breakdown por protocolo:

```bash
curl http://localhost:8000/protocols
```

* `GET /traffic_history?seconds=30` — histórico agregados dos últimos N segundos:

```bash
curl "http://localhost:8000/traffic_history?seconds=60"
```

---

## Dicas de uso e tuning

* **Interface específica:** se quiser monitorar apenas `eth0`/`en0`/`wlan0`, passe `iface="eth0"` ao chamar `sniff` (ou altere o thread starter para `threading.Thread(target=lambda: capture_loop(iface='eth0'), daemon=True).start()`).
* **Filtro BPF:** reduza o volume com `filter="tcp or udp"` ou `filter="not arp"` conforme necessidade.
* **Salvar/reativar estado:** o projeto atualmente mantém tudo em memória. Para persistência entre reinícios, adicione exportação para disco/BD.
* **Proteção de dados sensíveis:** cuidado ao expor este dashboard em redes públicas — os IPs e volumes de tráfego podem ser sensíveis.

---

## Problemas comuns / Troubleshooting

* **Scapy não captura no Windows:** verifique se o Npcap está instalado e o serviço ativo. Reinicie o computador se necessário.
* **Permissão negada (Linux):** execute com `sudo` ou configure CAP_NET_RAW/ CAP_NET_ADMIN para o binário Python.
* **Muito ruído no histórico:** considere aumentar a janela de `_maybe_append_snapshot` (atualmente 1 segundo) ou aplicar filtros BPF.

---

## Testes rápidos

* Teste que o servidor responde:

```bash
curl http://localhost:8000/
```

* Gere tráfego local (ex.: ping) de outra máquina e verifique `/traffic` para ver o IP aparecendo.

---

## Observações finais

* Este projeto foi escrito para ser simples e direto, focado em demonstrar captura de tráfego e integração com um frontend já existente. Adaptações comuns incluem persistência, autenticação nas rotas, paginação/filtragem avançada e integração com sistemas de métricas (Prometheus, Elastic, etc.).

---

## Licença

Escolha a licença que preferir (ex.: MIT) e adicione um arquivo `LICENSE` se desejar publicar.
