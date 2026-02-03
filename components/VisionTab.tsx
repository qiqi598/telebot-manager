import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Loader2, X } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';

export const VisionTab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const analysis = await analyzeImage(selectedImage, prompt);
      setResult(analysis);
    } catch (error) {
      setResult("Error analyzing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
          Multimodal Vision
        </h2>
        <p className="text-slate-400 text-sm mt-1">Upload an image and ask Gemini to analyze it.</p>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="relative group">
               {!selectedImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all"
                  >
                    <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-purple-400" size={32} />
                    </div>
                    <p className="text-slate-300 font-medium">Click to upload an image</p>
                    <p className="text-slate-500 text-sm mt-2">Supports JPG, PNG</p>
                  </div>
               ) : (
                 <div className="relative rounded-2xl overflow-hidden border border-slate-700 h-80 bg-black">
                   <img src={selectedImage} alt="Upload" className="w-full h-full object-contain" />
                   <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500/80 rounded-full backdrop-blur-md transition-colors"
                   >
                     <X size={16} />
                   </button>
                 </div>
               )}
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
               />
             </div>

             <div className="flex gap-2">
               <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask something about the image (optional)..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
               />
               <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isLoading}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
               >
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                 Analyze
               </button>
             </div>
          </div>

          {/* Result Section */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col h-80 md:h-auto overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <ImageIcon className="text-purple-400" size={20} />
              Analysis Result
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <Loader2 className="animate-spin text-purple-400" size={32} />
                  <p>Processing image...</p>
                </div>
              ) : result ? (
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl">
                  <p>Results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};