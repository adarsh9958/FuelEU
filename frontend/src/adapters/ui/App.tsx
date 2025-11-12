import { useState } from "react";
import RoutesTab from "./tabs/RoutesTab";
import CompareTab from "./tabs/CompareTab";
import BankingTab from "./tabs/BankingTab";
import PoolingTab from "./tabs/PoolingTab";

export default function App(){
  const [tab, setTab] = useState<"routes"|"compare"|"banking"|"pooling">("routes");
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">FuelEU Maritime Compliance</h1>
          <nav className="flex gap-2">
            {["routes","compare","banking","pooling"].map(t => (
              <button key={t}
                className={`px-4 py-2 border font-medium transition-colors ${
                  tab===t 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={()=>setTab(t as any)}>
                {t[0].toUpperCase()+t.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">
        {tab==="routes" && <RoutesTab/>}
        {tab==="compare" && <CompareTab/>}
        {tab==="banking" && <BankingTab/>}
        {tab==="pooling" && <PoolingTab/>}
      </main>
    </div>
  );
}
