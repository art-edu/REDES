from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time, random, threading
from collections import deque

app = FastAPI(title='Traffic Dashboard (simulated)')
app.add_middleware(
    CORSMiddleware, 
    allow_origins=['*'], 
    allow_methods=['*'], 
    allow_headers=['*']
)

# Estado em memória
STATE = {
    'clients': {},   
    'protocols': {}
}

# Histórico (últimos 5 minutos, 300 segundos)
HISTORY = deque(maxlen=300)

CLIENT_IPS = [f'10.0.0.{i}' for i in range(2, 12)]
PROTOCOLS = ['HTTP','HTTPS','FTP','SSH','DNS','OTHER']

def snapshot_state():
    """Cria snapshot atual do STATE para guardar no histórico"""
    total_in = sum(c['in'] for c in STATE['clients'].values())
    total_out = sum(c['out'] for c in STATE['clients'].values())
    return {
        "timestamp": time.time(),
        "total_in": total_in,
        "total_out": total_out,
        "total": total_in + total_out
    }

def simulate_traffic_loop():
    while True:
        
        for _ in range(random.randint(1,4)):
            ip = random.choice(CLIENT_IPS)
            direction = random.choice(['in','out'])
            size = random.randint(40, 4000)
            proto = random.choices(PROTOCOLS, weights=[30,30,10,10,10,10])[0]

            client = STATE['clients'].setdefault(ip, {'in':0,'out':0,'protocols':{}})
            client[direction] += size
            client['protocols'][proto] = client['protocols'].get(proto,0) + size
            STATE['protocols'][proto] = STATE['protocols'].get(proto,0) + size

        
        HISTORY.append(snapshot_state())
        time.sleep(1)

# inicia simulador em background
t = threading.Thread(target=simulate_traffic_loop, daemon=True)
t.start()

@app.get('/')
def root():
    try:
        return {'message': 'Backend (simulated) OK', 'time': time.time()}
    except Exception as e:
        return {"error": str(e)}

@app.get('/traffic')
def get_traffic(limit: int = 10):
    try:
        items = []
        for ip, stats in STATE['clients'].items():
            total = stats['in'] + stats['out']
            items.append({
                'ip': ip, 
                'bytes_in': stats['in'], 
                'bytes_out': stats['out'], 
                'total': total, 
                'protocols': stats['protocols']
            })
        items.sort(key=lambda x: x['total'], reverse=True)
        return {'window': 5, 'clients': items[:limit], 'generated_at': time.time()}
    except Exception as e:
        return {"error": str(e)}

@app.get('/protocols')
def get_protocols():
    try:
        total = sum(STATE['protocols'].values()) or 1
        breakdown = [
            {'protocol': k, 'bytes': v, 'pct': round(100.0 * v / total, 2)}
            for k,v in STATE['protocols'].items()
        ]
        breakdown.sort(key=lambda x: x['bytes'], reverse=True)
        return {'protocols': breakdown, 'total_bytes': total}
    except Exception as e:
        return {"error": str(e)}

@app.get('/traffic_history')
def traffic_history(seconds: int = 30):
    """
    Retorna histórico de tráfego agregado dos últimos N segundos.
    """
    try:
        cutoff = time.time() - seconds
        buckets = [h for h in HISTORY if h["timestamp"] >= cutoff]
        return {"seconds": seconds, "buckets": buckets, "generated_at": time.time()}
    except Exception as e:
        return {"error": str(e)}
