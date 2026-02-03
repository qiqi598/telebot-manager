import React, { useState } from 'react';
import { Volume2, Play, Loader2, Mic } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

export const TTSTab: React.FC = () => {
  const [text, setText] = useState('Welcome to the future of AI interactions. I can speak naturally in many languages.');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const audioBuffer = await generateSpeech(text);
      playAudio(audioBuffer);
    } catch (error) {
      alert("Failed to generate speech. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (buffer: AudioBuffer) => {
    setIsPlaying(true);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.onended = () => setIsPlaying(false);
    source.start(0);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Text-to-Speech
        </h2>
        <p className="text-slate-400 text-sm mt-1">Convert text into lifelike speech using Gemini 2.5.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-slate-800 rounded-3xl p-1 shadow-2xl border border-slate-700">
          <div className="bg-slate-900 rounded-[20px] p-6 space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Input Text</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 h-40 resize-none text-lg leading-relaxed"
                placeholder="What would you like me to say?"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-500">
                   <Mic size={20} />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-white">Voice: Puck</p>
                   <p className="text-xs text-slate-500">English (US)</p>
                 </div>
               </div>

               <button
                onClick={handleGenerate}
                disabled={isLoading || isPlaying || !text}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95
                  ${isLoading || isPlaying 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/25'}
                `}
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="animate-spin" size={20} />
                     Generating...
                   </>
                 ) : isPlaying ? (
                   <>
                     <Volume2 className="animate-pulse" size={20} />
                     Playing...
                   </>
                 ) : (
                   <>
                     <Play size={20} fill="currentColor" />
                     Generate Speech
                   </>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};