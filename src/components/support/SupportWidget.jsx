import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2, ArrowDown } from 'lucide-react';
import api from '@/api/axios';

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('supportChatHistory');
    return saved ? JSON.parse(saved) : [{
      role: 'assistant',
      content: "Hi 👋 I'm ForgeLabs Support Assistant.\n\nI can help you understand our services, pricing, offers, and guide you to connect with our team."
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('supportChatHistory', JSON.stringify(messages));
    // Check scroll position when messages change, but don't force scroll
    handleScroll();
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Show button if we are more than 50px away from the bottom
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 50);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/support/chat', {
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      });

      // Artificial delay to show typing indicator
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.response || "I apologize, but I couldn't process that request."
        }]);
        setIsLoading(false);
      }, 1500); // 1.5 second "thinking" time
    } catch (error) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Oops! We're experiencing connection issues. Please try again later or use our contact form."
        }]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => {
      // Small hack to submit via state change
      const fakeEvent = { preventDefault: () => {} };
      handleSendMessage(fakeEvent);
    }, 100);
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi 👋 I'm ForgeLabs Support Assistant.\n\nI can help you understand our services, pricing, offers, and guide you to connect with our team."
    }]);
    sessionStorage.removeItem('supportChatHistory');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] max-h-[80vh] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#9b6cf3] to-[#7b4bd3] text-white">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">ForgeLabs Support</h3>
                  <div className="flex items-center text-xs text-white/80 space-x-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={resetChat} className="text-xs hover:text-white/80 transition-colors p-1" title="Restart Chat">
                  Reset
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Wrapper */}
            <div className="flex-1 relative flex flex-col min-h-0 bg-[#0a0a0a]">
              {/* Messages Area */}
              <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 space-x-reverse`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10 ml-2' : 'bg-gradient-to-tr from-[#9b6cf3] to-[#7b4bd3] mr-2'}`}>
                      {msg.role === 'user' ? <User size={12} className="text-white/70" /> : <Bot size={12} className="text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-white/10 text-white rounded-br-none' : 'bg-gradient-to-br from-[#9b6cf3]/10 to-transparent border border-[#9b6cf3]/20 text-white/90 rounded-bl-none'}`}>
                      {msg.content.replace('[SHOW_LEAD_FORM]', '')}
                      {msg.content.includes('[SHOW_LEAD_FORM]') && (
                        <div className="mt-3 bg-black/50 p-3 rounded-xl border border-white/10">
                          <p className="text-xs text-white/70 mb-2">Please fill out these details so our team can reach out:</p>
                          <form className="space-y-2 flex flex-col" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            api.post('/inquiries', {
                              fullName: formData.get('name'),
                              email: formData.get('email'),
                              phone: formData.get('phone'),
                              projectType: formData.get('service'),
                              budgetRange: formData.get('budget'),
                              message: 'From Support Assistant: ' + formData.get('details') + (formData.get('company') ? '\nCompany: ' + formData.get('company') : ''),
                              sourcePage: '/chatbot'
                            }).then(() => {
                              setMessages(prev => [...prev, { role: 'user', content: 'Form submitted.' }, { role: 'assistant', content: 'Thank you! Our team will be in touch shortly.' }]);
                            }).catch(() => {
                              setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to submit form. Please try our contact page.' }]);
                            });
                          }}>
                            <input name="name" placeholder="Name" required className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full text-white" />
                            <input name="email" type="email" placeholder="Email" required className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full text-white" />
                            <input name="phone" placeholder="Phone" className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full text-white" />
                            <input name="company" placeholder="Company/Project Name" className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full text-white" />
                            <select name="service" required className="bg-black border border-white/10 rounded px-2 py-1 text-xs w-full text-white">
                              <option value="">Select Primary Interest...</option>
                              <option value="Website Development">Website Development</option>
                              <option value="AI Integration">AI Integration</option>
                              <option value="MVP Development">MVP Development</option>
                              <option value="Other">Other</option>
                            </select>
                            <input name="budget" placeholder="Estimated Budget" className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full text-white" />
                            <textarea name="details" placeholder="Any specific requirements?" className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full text-white h-16" />
                            <button type="submit" className="bg-gradient-to-r from-[#9b6cf3] to-[#7b4bd3] text-white rounded px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity">Submit Inquiry</button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] flex-row items-end space-x-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-[#9b6cf3] to-[#7b4bd3] mr-2">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9b6cf3]/10 to-transparent border border-[#9b6cf3]/20 text-white/90 rounded-bl-none flex space-x-1 items-center">
                      <span className="w-1.5 h-1.5 bg-[#9b6cf3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#9b6cf3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#9b6cf3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Scroll Down Button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#9b6cf3] text-white p-2 rounded-full shadow-lg hover:bg-[#7b4bd3] transition-colors z-20"
                >
                  <ArrowDown size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions - Only show if it's the start or bot asked a question */}
            {!isLoading && messages.length < 3 && (
              <div className="px-4 py-3 bg-[#0a0a0a] flex flex-col space-y-2 border-t border-white/5">
                <p className="text-xs text-white/50 mb-1">Suggested for you:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Pricing', 'Services', 'Launch Offer', 'Contact Team'].map(action => (
                    <button
                      key={action}
                      onClick={() => {
                        setInputMessage(action);
                      }}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/80 transition-all text-left flex items-center justify-between group"
                    >
                      <span>{action}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9b6cf3]">&rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-black/90 border-t border-white/10 flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#9b6cf3]/50 focus:ring-1 focus:ring-[#9b6cf3]/50 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9b6cf3] to-[#7b4bd3] flex items-center justify-center text-white disabled:opacity-50 transition-opacity hover:opacity-90"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#9b6cf3] to-[#7b4bd3] rounded-full shadow-[0_0_20px_rgba(155,108,243,0.4)] flex items-center justify-center text-white z-50 hover:shadow-[0_0_30px_rgba(155,108,243,0.6)] transition-shadow duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </>
  );
};

export default SupportWidget;
