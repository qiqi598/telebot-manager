import React, { useState, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, Send, FileVideo, X } from 'lucide-react';
import { getMediaHistory } from '../services/mockService';

export const Media: React.FC = () => {
  const [history, setHistory] = useState(getMediaHistory());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!selectedFile) return;
    const newItem = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: selectedFile.type.startsWith('video') ? 'video' : 'image',
      url: preview || '',
      caption: caption,
      status: 'sent'
    } as any;
    setHistory([newItem, ...history]);
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
  };

  return (
    <div className="p-8 h-full overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Upload Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ImageIcon className="text-purple-400" />
            多媒体广播
          </h2>
          <p className="text-slate-400 mt-1">立即向群组发送图片或视频消息。</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
          
          {!selectedFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-slate-700/30 transition-all"
            >
              <div className="p-4 bg-slate-700/50 rounded-full mb-4">
                <UploadCloud className="text-purple-400" size={32} />
              </div>
              <p className="text-slate-300 font-medium">点击上传图片或视频</p>
              <p className="text-slate-500 text-sm mt-2">支持 MP4, JPG, PNG (最大 50MB)</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-600 h-64 flex items-center justify-center">
              {selectedFile.type.startsWith('video') ? (
                <div className="flex flex-col items-center text-slate-400">
                  <FileVideo size={48} />
                  <p className="mt-2">{selectedFile.name}</p>
                </div>
              ) : (
                <img src={preview!} alt="preview" className="h-full w-full object-contain" />
              )}
              <button 
                onClick={() => { setSelectedFile(null); setPreview(null); }}
                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />

          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">说明文字 (可选)</label>
            <input 
              type="text" 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="输入图片/视频描述..." 
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={!selectedFile}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25"
          >
            <Send size={20} />
            广播到群组
          </button>

        </div>
      </div>

      {/* History Section */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col h-[600px]">
        <h3 className="text-lg font-semibold text-white mb-4">广播历史记录</h3>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-4">
               <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-700">
                 {item.type === 'video' ? <FileVideo className="text-slate-500" /> : <ImageIcon className="text-slate-500" />}
               </div>
               <div>
                 <p className="text-slate-200 font-medium line-clamp-1">{item.caption || item.name}</p>
                 <span className="inline-block mt-2 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded uppercase font-bold tracking-wider">
                   {item.status === 'sent' ? '已发送' : '等待中'}
                 </span>
                 <p className="text-slate-500 text-xs mt-1">{item.name}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};