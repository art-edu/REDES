# Traffic Dashboard (Simulado) - Projeto Pronto

## Estrutura
- backend/: FastAPI que simula tráfego em memória e fornece endpoints:
  - GET / -> status
  - GET /traffic -> top clients (simulado)
  - GET /protocols -> protocol breakdown
- frontend/: React + Vite que consome a API e mostra gráficos

## Rodando no Windows (VS Code)
1. Backend:
   - cd backend
   - python -m venv .venv
   - .venv\Scripts\activate
   - pip install -r requirements.txt
   - uvicorn app:app --reload --port 8000
2. Frontend:
   - cd frontend
   - npm install
   - npm run dev
   - Abra http://localhost:5173
