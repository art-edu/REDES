import React, { useEffect, useState } from 'react'
import TrafficChart from './components/TrafficChart'
import DrillPanel from './components/DrillPanel'

export default function App(){
  const [clients, setClients] = useState([])
  const [protocols, setProtocols] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    const fetchAll = async ()=>{
      try{
        const t = await fetch('http://127.0.0.1:8000/traffic').then(r=>r.json())
        setClients(t.clients)
        const p = await fetch('http://127.0.0.1:8000/protocols').then(r=>r.json())
        setProtocols(p.protocols)
      }catch(e){
        console.error('fetch error', e)
      }
    }
    fetchAll()
    const iv = setInterval(fetchAll, 5000)
    return ()=>clearInterval(iv)
  },[])

  return (
    <div className="app">
      <h1>Traffic Dashboard (Simulado)</h1>
      <div className="layout">
        <div className="left">
          <TrafficChart data={clients} onSelect={c=>setSelected(c)} />
        </div>
        <div className="right">
          <h3>Protocolos</h3>
          <ul>
            {protocols.map(p=>(<li key={p.protocol}>{p.protocol}: {p.bytes} bytes ({p.pct}%)</li>))}
          </ul>
          <DrillPanel client={selected} />
        </div>
      </div>
    </div>
  )
}
