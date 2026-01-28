'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, Send, Shield, User, MicOff, Activity, Database, Volume2, PhoneOff } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Import Vapi
let Vapi;
if (typeof window !== 'undefined') {
  import('@vapi-ai/web').then(module => {
    Vapi = module.default;
  });
}

export default function ChatPage() {
  const [mode, setMode] = useState('text'); // 'text' or 'voice'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🛡️ SafeCity AI initialized. Connected to live FIR database with real crime statistics. Ask me about crime data, FIR information, safety tips, or specific locations!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Voice-specific states
  const [vapi, setVapi] = useState(null);
  const [callStatus, setCallStatus] = useState('inactive'); // 'inactive', 'connecting', 'active', 'ending'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);
  const [user, setUser] = useState(null);
  const [totalCrimeCount, setTotalCrimeCount] = useState(502);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial stats
  useEffect(() => {
    fetch('http://localhost:5002/api/crime-stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  // Fetch user data
  useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error('Failed to fetch user:', err));
  }, []);

  // Initialize Vapi
  useEffect(() => {
    if (typeof window !== 'undefined' && Vapi && !vapi) {
      const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'aa26d9e0-c457-4bcb-80ae-0d5c03d3fe99';
      const vapiInstance = new Vapi(vapiPublicKey);
      setVapi(vapiInstance);
    }
  }, [Vapi]);

  // Set up Vapi event listeners
  useEffect(() => {
    if (!vapi) return;

    const onCallStart = () => {
      console.log('Call started');
      setCallStatus('active');
      setCallStartTime(Date.now());
    };

    const onCallEnd = () => {
      console.log('Call ended');
      setCallStatus('inactive');
      setCallStartTime(null);
      setCallDuration(0);
      setIsSpeaking(false);
      setIsListening(false);
      setVoiceMessage('');
    };

    const onMessage = (message) => {
      console.log('Vapi message:', message);
      
      // Handle function calls from Vapi
      if (message.type === 'function-call' && message.functionCall?.name === 'get_crime_data') {
        handleVapiFunction(message.functionCall);
      }
      
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setVoiceMessage(message.transcript);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
      setIsListening(false);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
      setIsListening(true);
    };

    const onError = (error) => {
      console.error('Vapi error:', error);
      setCallStatus('inactive');
      setIsSpeaking(false);
      setIsListening(false);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      if (vapi) {
        vapi.removeAllListeners();
      }
    };
  }, [vapi]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callStartTime && callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime, callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Text chat handler
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const response = await fetch('http://localhost:5002/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: history
        })
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I couldn\'t connect to the server. Please make sure the chatbot server is running on port 5002.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Vapi function calls
  const handleVapiFunction = async (functionCall) => {
    const { name, parameters } = functionCall;
    
    if (name === 'get_crime_data') {
      try {
        // Query the chatbot backend for real database data
        const response = await fetch('http://localhost:5002/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: parameters.query,
            history: ''
          })
        });
        
        const data = await response.json();
        
        // Return the result to Vapi
        return {
          result: data.response
        };
      } catch (error) {
        console.error('Error calling chatbot backend:', error);
        return {
          result: "I'm having trouble accessing the database right now. Please try again."
        };
      }
    }
  };

  // Voice chat handlers
  const createCrimeAssistant = () => {
    return {
      name: "SafeCity AI Crime Assistant",
      firstMessage: `Hello${user?.name ? ' ' + user.name : ''}! I'm SafeCity AI, your voice assistant for crime data and public safety. I have access to real FIR database with ${totalCrimeCount} records. Ask me about crime statistics, locations, or safety information!`,

      serverUrl: "http://localhost:5002/api/chat",
      serverUrlSecret: "",

      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
        smartFormat: true,
      },

      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        stability: 0.5,
        similarityBoost: 0.8,
        speed: 0.9,
      },

      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        maxTokens: 500,
        functions: [
          {
            name: "get_crime_data",
            description: "Get real crime statistics from the FIR database. Use this for ANY question about crimes, FIRs, statistics, locations, or safety data.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The user's question about crime data"
                }
              },
              required: ["query"]
            },
            // Map function to backend endpoint
            async: false,
          }
        ],
        messages: [
          {
            role: "system",
            content: `You are SafeCity AI, a voice assistant with access to REAL crime database through the get_crime_data function.

🚨 CRITICAL: For ANY question about crime data, statistics, locations, FIRs - ALWAYS call get_crime_data function FIRST before answering.

✅ ALWAYS DO:
1. Call get_crime_data function for questions about: crimes, statistics, FIRs, locations, safety data, totals, counts
2. Use EXACT numbers returned by the function
3. Say "According to our database..." when citing data
4. Keep responses SHORT for voice (2-3 sentences max)

❌ NEVER DO:
- Answer crime questions WITHOUT calling get_crime_data first
- Make up statistics or numbers
- Estimate or guess data

WORKFLOW:
1. User asks about crime data → Call get_crime_data
2. Get response from function → Use those EXACT numbers
3. Answer naturally with the real data

You're speaking with${user?.name ? ' ' + user.name : ' a user'}. Always use the function to get real data!`,
          },
        ],
      },
    };
  };

  const startVoiceCall = async () => {
    if (!vapi) {
      alert('Voice service is initializing. Please wait a moment and try again.');
      return;
    }

    setCallStatus('connecting');

    try {
      const assistant = createCrimeAssistant();
      await vapi.start(assistant);
    } catch (error) {
      console.error('Failed to start voice call:', error);
      alert('Failed to start voice chat. Please check your microphone permissions.');
      setCallStatus('inactive');
    }
  };

  const endVoiceCall = async () => {
    if (!vapi) return;

    try {
      setCallStatus('ending');
      await vapi.stop();
      setTimeout(() => {
        setCallStatus('inactive');
        setVoiceMessage('');
        setIsSpeaking(false);
        setIsListening(false);
      }, 500);
    } catch (error) {
      console.error('Error ending call:', error);
      setCallStatus('inactive');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl mt-20">
        {/* Header with Database Status */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              SafeCity AI Assistant
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <Database size={16} className="text-green-600" />
              <span className="text-green-700 font-semibold">Live Database Connected</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Activity size={16} className="text-blue-600" />
              <span className="text-blue-700 font-semibold">Real-Time Analysis</span>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-3 text-sm font-medium">
            Query real FIR data • Crime statistics • Safety insights • Location-based analysis
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
              mode === 'text'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <MessageCircle size={20} />
            TEXT CHAT
          </button>
          <button
            onClick={() => setMode('voice')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
              mode === 'voice'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Mic size={20} />
            VOICE CHAT
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[550px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-transparent">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Shield size={20} className="text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-green-600 to-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-md">
                  <Shield size={20} className="text-white" />
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {mode === 'text' ? (
            <div className="p-5 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                  placeholder="Ask: 'How many crimes in Mumbai?', 'Show FIR stats', 'Safety tips'..."
                  className="flex-1 bg-white text-gray-900 px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 font-medium"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-all disabled:cursor-not-allowed font-bold shadow-md disabled:shadow-none"
                >
                  <Send size={20} />
                  SEND
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 bg-gray-50 border-t border-gray-200 text-center">
              {/* Voice Interface */}
              <div className="max-w-md mx-auto">
                {/* Voice Avatar */}
                <div className="relative mb-8">
                  <div className={`w-48 h-48 mx-auto rounded-full border-4 transition-all duration-500 ${
                    callStatus === 'active' ? 'border-green-500 shadow-lg shadow-green-500/50' : 'border-gray-300'
                  } bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center`}>
                    <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center border-2 border-gray-200">
                      <Shield size={60} className={`${
                        callStatus === 'active' ? 'text-green-600' : 'text-gray-400'
                      } transition-colors`} />
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border-2 ${
                      callStatus === 'active'
                        ? isSpeaking
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : isListening
                            ? 'bg-green-100 border-green-500 text-green-700 animate-pulse'
                            : 'bg-green-100 border-green-500 text-green-700'
                        : callStatus === 'connecting'
                          ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}>
                      {callStatus === 'connecting'
                        ? 'Connecting...'
                        : callStatus === 'active'
                          ? isSpeaking
                            ? 'AI Speaking'
                            : isListening
                              ? 'Listening...'
                              : 'Ready'
                          : 'Offline'}
                    </div>
                  </div>
                </div>

                {/* Call Duration */}
                {callStatus === 'active' && (
                  <div className="mb-6 text-gray-600 font-mono text-lg bg-white px-4 py-2 rounded-full border-2 border-gray-200 inline-block">
                    {formatDuration(callDuration)}
                  </div>
                )}

                {/* Voice Controls */}
                {callStatus === 'active' ? (
                  <button
                    onClick={endVoiceCall}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-md transform hover:scale-105 flex items-center mx-auto"
                  >
                    <PhoneOff size={24} className="mr-3" />
                    END CALL
                  </button>
                ) : (
                  <button
                    onClick={startVoiceCall}
                    disabled={callStatus === 'connecting'}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-md disabled:cursor-not-allowed flex items-center mx-auto transform hover:scale-105"
                  >
                    <Mic size={24} className="mr-3" />
                    {callStatus === 'connecting' ? 'CONNECTING...' : 'START VOICE CHAT'}
                  </button>
                )}

                {/* Voice Message Display */}
                {voiceMessage && callStatus === 'active' && (
                  <div className="mt-8 p-4 bg-white border-2 border-green-200 rounded-xl">
                    <div className="flex items-start">
                      <Volume2 className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-700 text-left">{voiceMessage}</p>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {callStatus === 'inactive' && (
                  <p className="mt-6 text-gray-600 text-sm">
                    🎙️ Click to start real-time voice chat with SafeCity AI<br/>
                    Powered by Vapi AI • Ask about crime data, safety tips, or FIR information
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Total crime statistics',
            'Crimes in Mumbai',
            'Safety recommendations',
            'Top police stations',
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => {
                if (mode === 'text' && !loading) {
                  setInput(suggestion);
                }
              }}
              className="bg-white hover:bg-gray-50 text-gray-700 hover:text-green-600 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 border-gray-200 hover:border-green-500 hover:shadow-md"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Status Footer */}
        {stats && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <p className="text-green-800 text-xs font-semibold">
              <span className="text-green-600">●</span> Connected to live database • Real-time crime analytics • Ask specific questions for accurate data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
