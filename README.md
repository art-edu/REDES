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
* Se preferir configurar via variável de ambiente ou endpoint, você pode adaptar o código para
