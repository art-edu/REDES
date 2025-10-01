import React from "react";


const formatBytes = (bytes) => {
  if (!bytes || isNaN(bytes)) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default function DrillPanel({ client }) {
  if (!client) {
    return (
      <div className="mt-6 text-gray-500 text-sm italic">
         Clique em uma barra do gráfico para ver detalhes.
      </div>
    );
  }

  const protocols = Object.entries(client.protocols || {}).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
         Detalhes do IP: <span className="text-indigo-600">{client.ip}</span>
      </h3>

      <p className="text-gray-700 mb-4">
        <strong className="text-green-600">Entrada (IN):</strong>{" "}
        {formatBytes(client.bytes_in)} &nbsp; | &nbsp;
        <strong className="text-red-600">Saída (OUT):</strong>{" "}
        {formatBytes(client.bytes_out)}
      </p>

      <h4 className="text-md font-semibold text-gray-800 mb-2"> Protocolos:</h4>
      {protocols.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {protocols.map((p) => (
            <li key={p.name}>
              <span className="font-medium">{p.name}</span>: {formatBytes(p.value)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Nenhum protocolo registrado.</p>
      )}
    </div>
  );
}
