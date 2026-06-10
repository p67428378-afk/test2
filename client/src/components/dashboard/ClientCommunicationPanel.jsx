import React, { useState } from 'react';
import { Send, MoreVertical } from 'lucide-react';
import { sendNotification } from '../../services/api.js';

function ClientCommunicationPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'AS',
      senderName: 'Alice Smith',
      text: "Hi Tenzing! I'm really excited about the EBC trek. I was wondering if I need to bring my own sleeping bag or if we can rent one locally in Kathmandu?",
      isSelf: false,
      avatar: null
    },
    {
      id: 2,
      sender: 'TN',
      senderName: 'Tenzing Norgay',
      text: "Hello Alice! Great to hear from you. You can absolutely rent a high-quality down sleeping bag (-15C rated) in Kathmandu for about $2-3 USD per day. We can sort that out during our briefing day.",
      isSelf: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXPzgVGAf3j8Lf6Fs-20IQ9wQAF8cZMUXAp4ZD3x07V_KCpPh1Wv7bFMBoBnYy4IlJErlHsMAHPK35XPG4aqQLJie3xv43WUQ1TE4sdE87z42XuwaI22K_0L8FXWj9GB_1v4in1OBTHP9U5OR18dJfSsxPpUc42uauDsgP4qwGcrgmJ_mdJdwzliBb3ptmrfZA9y2F9TLbRHrS7K2J3n9J0-RAEapXacBVVHKFcys8kmuHw5TBZKurvh6QcLHN71jJqe45k5Pp1l0"
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'TN',
      senderName: 'Tenzing Norgay',
      text: inputText,
      isSelf: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXPzgVGAf3j8Lf6Fs-20IQ9wQAF8cZMUXAp4ZD3x07V_KCpPh1Wv7bFMBoBnYy4IlJErlHsMAHPK35XPG4aqQLJie3xv43WUQ1TE4sdE87z42XuwaI22K_0L8FXWj9GB_1v4in1OBTHP9U5OR18dJfSsxPpUc42uauDsgP4qwGcrgmJ_mdJdwzliBb3ptmrfZA9y2F9TLbRHrS7K2J3n9J0-RAEapXacBVVHKFcys8kmuHw5TBZKurvh6QcLHN71jJqe45k5Pp1l0"
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Call API
    await sendNotification('11111111-2222-3333-4444-555555555555', inputText);
  };

  return (
    <section className="bg-[#1E293B] border border-[#334155] rounded-[16px] flex flex-col h-[400px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#334155] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container font-label-md relative">
            AS
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#1E293B]"></span>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-on-surface">Alice Smith</h3>
            <p className="font-caption text-caption text-on-surface-variant">Regarding: Everest Base Camp</p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[80%] ${msg.isSelf ? 'self-end flex-row-reverse' : ''}`}
          >
            {msg.isSelf ? (
              <img
                alt={msg.senderName}
                className="w-8 h-8 rounded-full flex-shrink-0 mt-1 border border-outline-variant"
                src={msg.avatar}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container font-caption text-xs mt-1">
                {msg.sender}
              </div>
            )}
            <div
              className={`p-3 rounded-2xl text-on-surface font-body-md text-sm border ${
                msg.isSelf
                  ? 'bg-primary/20 border-primary/30 rounded-tr-sm'
                  : 'bg-surface-container-high border-outline-variant rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-[#334155] bg-surface-container-low rounded-b-[16px]">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-surface-dim border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            placeholder="Type a message to Alice..."
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary-container text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2"
          >
            Send
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </section>
  );
}

export default ClientCommunicationPanel;
