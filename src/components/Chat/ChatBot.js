import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoChatbubblesSharp, IoSend, IoClose, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: '¡Hola! Soy tu asistente de Salud Mental en Mente Conecta. ¿En qué puedo apoyarte hoy?' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare messages for Claude (it expects 'user' and 'assistant' roles)
            // We strip unnecessary fields and ensure proper structure
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }));
            
            history.push({ role: 'user', content: input });

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL_SEP_V1}/chatbot/chat/`, {
                messages: history
            });

            const botMessage = { role: 'assistant', content: response.data.message };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Lo siento, hubo un problema al conectar con el asistente. Por favor, inténtalo de nuevo más tarde.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            {/* Floating Action Button */}
            <button 
                className={`chatbot-button ${isOpen ? 'open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir Chat de Apoyo"
            >
                {isOpen ? <IoClose /> : <IoChatbubblesSharp />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <IoChatbubbleEllipsesOutline size={24} />
                        <div>
                            <h3>Mente Conecta AI</h3>
                            <span>Asistente de Salud Mental</span>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
                                {msg.role === 'assistant' ? (
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <input 
                            type="text" 
                            placeholder="Escribe tu mensaje aquí..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <IoSend />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
