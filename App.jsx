import React, { useState } from 'react';
import { Shield, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AegisSocial() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [isHacked, setIsHacked] = useState(false);

  const handleSend = async () => {
    // Call the Python Backend to Sign the Message
    const response = await fetch('http://localhost:8000/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg }),
    });
    const data = await response.json();

    const newMsg = {
      text: msg,
      fingerprint: data.fingerprint,
      signature: data.signature,
      sender: "@boy_18"
    };

    setChat([...chat, newMsg]);
    setMsg("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <header className="flex justify-between items-center mb-6 border-b border-cyan-900 pb-3">
        <h1 className="text-cyan-400 font-bold tracking-widest">AEGIS SOCIAL</h1>
        <Shield className="text-cyan-400 w-6 h-6" />
      </header>

      {/* Message Feed */}
      <div className="space-y-4 mb-20">
        {chat.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg border ${isHacked ? 'border-red-600 bg-red-900/20' : 'border-cyan-900 bg-slate-900'}`}>
            <p className="text-xs text-cyan-500 mb-1">{m.sender}</p>
            <p className="text-sm">{isHacked ? "HACKED MESSAGE CONTENT" : m.text}</p>
            <div className="mt-2 flex items-center gap-2">
              {isHacked ? <AlertCircle className="text-red-500 w-3 h-3" /> : <CheckCircle2 className="text-green-500 w-3 h-3" />}
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                {isHacked ? "Integrity Failure" : `PQC Verified: ${m.signature}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-black border-t border-slate-800">
        <div className="flex gap-2">
          <input 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type secure message..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <button onClick={handleSend} className="bg-cyan-600 p-2 rounded-full hover:bg-cyan-500 transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={() => setIsHacked(!isHacked)} 
          className="mt-2 text-[10px] text-slate-600 underline w-full text-center">
          {isHacked ? "Stop Attack Simulation" : "Simulate Hacker Alteration"}
        </button>
      </div>
    </div>
  );
}
