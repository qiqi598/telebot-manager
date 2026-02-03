import React, { useState } from 'react';
import { ShieldAlert, Link as LinkIcon, MessageSquare, AlertOctagon } from 'lucide-react';
import { ProtectionConfig } from '../types';

interface ProtectionProps {
  config: ProtectionConfig;
  setConfig: (config: ProtectionConfig) => void;
}

export const Protection: React.FC<ProtectionProps> = ({ config, setConfig }) => {
  const [newWord, setNewWord] = useState('');

  const addWord = () => {
    if (newWord.trim() && !config.sensitiveWords.includes(newWord.trim())) {
      setConfig({ ...config, sensitiveWords: [...config.sensitiveWords, newWord.trim()] });
      setNewWord('');
    }
  };

  const removeWord = (word: string) => {
    setConfig({ ...config, sensitiveWords: config.sensitiveWords.filter(w => w !== word) });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-orange-400" />
          内容与安全防护
        </h2>
        <p className="text-slate-400 mt-1">敏感词过滤、链接拦截与防刷屏设置。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Anti-Flood & Links */}
        <div className="space-y-8">
           <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertOctagon className="text-red-400" size={20} />
                基础拦截
              </h3>
              
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><LinkIcon size={18} /></div>
                   <div>
                     <div className="text-sm font-medium text-slate-200">拦截外部链接</div>
                     <div className="text-xs text-slate-500">自动删除 http/https 链接</div>
                   </div>
                 </div>
                 <button 
                  onClick={() => setConfig({...config, blockLinks: !config.blockLinks})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.blockLinks ? 'bg-blue-500' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.blockLinks ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><MessageSquare size={18} /></div>
                   <div>
                     <div className="text-sm font-medium text-slate-200">拦截转发消息</div>
                     <div className="text-xs text-slate-500">禁止转发其他频道内容</div>
                   </div>
                 </div>
                 <button 
                  onClick={() => setConfig({...config, blockForwarded: !config.blockForwarded})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.blockForwarded ? 'bg-purple-500' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.blockForwarded ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
           </div>

           <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">防刷屏 (Anti-Flood)</h3>
                <input 
                  type="checkbox" 
                  checked={config.antiFlood.enabled}
                  onChange={(e) => setConfig({...config, antiFlood: {...config.antiFlood, enabled: e.target.checked}})}
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs text-slate-400">时间窗口 (秒)</label>
                   <input 
                    type="number" 
                    value={config.antiFlood.timeWindow}
                    onChange={(e) => setConfig({...config, antiFlood: {...config.antiFlood, timeWindow: parseInt(e.target.value)}})}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-slate-400">最大消息数</label>
                   <input 
                    type="number" 
                    value={config.antiFlood.threshold}
                    onChange={(e) => setConfig({...config, antiFlood: {...config.antiFlood, threshold: parseInt(e.target.value)}})}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                   />
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">触发惩罚</label>
                <select 
                  value={config.antiFlood.action}
                  onChange={(e) => setConfig({...config, antiFlood: {...config.antiFlood, action: e.target.value as any}})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="mute">禁言 (Mute)</option>
                  <option value="kick">踢出 (Kick)</option>
                  <option value="ban">封禁 (Ban)</option>
                </select>
              </div>
           </div>
        </div>

        {/* Sensitive Words */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col h-full">
           <h3 className="text-lg font-semibold text-white mb-4">敏感词黑名单</h3>
           
           <div className="flex gap-2 mb-4">
             <input 
               type="text" 
               value={newWord}
               onChange={(e) => setNewWord(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && addWord()}
               placeholder="输入敏感词..."
               className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
             />
             <button onClick={addWord} className="bg-orange-600 hover:bg-orange-500 text-white px-4 rounded-lg font-medium">添加</button>
           </div>

           <div className="flex-1 bg-slate-900/50 rounded-xl p-4 overflow-y-auto content-start flex flex-wrap gap-2 border border-slate-700/50">
             {config.sensitiveWords.length === 0 && <p className="text-slate-500 text-sm w-full text-center mt-10">暂无黑名单关键词</p>}
             {config.sensitiveWords.map((word) => (
               <span key={word} className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                 {word}
                 <button onClick={() => removeWord(word)} className="hover:text-white"><AlertOctagon size={12} /></button>
               </span>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};
