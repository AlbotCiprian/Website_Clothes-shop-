'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  from: 'user' | 'assistant';
  text: string;
}

const knowledgeBase: Array<{ question: string; answer: string; keywords: string[] }> = [
  {
    question: 'Cum primesc TTN-ul?',
    answer: 'După ce plata este aprobată prin MAIB, generăm automat TTN-ul Nova Poshta și îl trimitem pe email. Îl vezi și pe pagina de success.',
    keywords: ['ttn', 'tracking', 'livrare']
  },
  {
    question: 'Pot schimba mărimea?',
    answer: 'Desigur. Scrie-ne în 14 zile de la livrare și îți rezervăm mărimea potrivită fără cost suplimentar.',
    keywords: ['schimb', 'mărime', 'return']
  },
  {
    question: 'Cât durează livrarea?',
    answer: 'Livrăm în 24-48h în toată Moldova, în funcție de lockerul sau depozitul Nova Poshta selectat.',
    keywords: ['livrare', 'timp', 'rapid']
  }
];

function findAnswer(question: string) {
  const normalized = question.toLowerCase();
  const match = knowledgeBase.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  );
  return match ? match.answer : 'Îți răspundem cât mai repede. Între timp, vezi FAQ-ul din footer pentru detalii.';
}

export function AssistantChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'assistant',
      text: 'Salut! Sunt Blueprint AI. Întreabă-mă despre livrare, mărimi sau plată.'
    }
  ]);

  const quickReplies = useMemo(
    () => knowledgeBase.map((entry) => ({ id: entry.question, label: entry.question })),
    []
  );

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), from: 'user', text };
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      from: 'assistant',
      text: findAnswer(text)
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input;
    setInput('');
    sendMessage(value);
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Assistant</p>
              <h3 className="font-display text-lg font-semibold text-slate-900">Blueprint AI chat</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Închide chatul">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.from === 'user'
                      ? 'bg-brand text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => sendMessage(reply.label)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
                type="button"
              >
                {reply.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Scrie întrebarea ta"
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="default" aria-label="Trimite">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
      <Button
        size="lg"
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-soft"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Deschide chatul"
      >
        <MessageCircle className="mr-2 h-4 w-4" /> Ai nevoie de ajutor?
      </Button>
    </div>
  );
}
