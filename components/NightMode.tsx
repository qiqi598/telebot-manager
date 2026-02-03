import React from 'react';
import { Moon, Sun, BellOff, Clock } from 'lucide-react';
import { NightModeConfig } from '../types';

interface NightModeProps {
  config: NightModeConfig;
  setConfig: (config: NightModeConfig) => void;
}

export const NightMode: React.FC<NightModeProps> = ({ config, setConfig }) => {
  return (
    <div className="p-8 max-w-2xl mx-auto h-full overflow-y-auto flex flex-col justify-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Moon className="text-indigo-400" size={32} />
          夜间模式设置
        </h2>
        <p className="text-slate-400 mt-2">在深夜自动开启群组静音，还群友一个清净。</p>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="space-y-8 relative z-10">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-full ${config.enabled ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                 {config.enabled ? <BellOff size={24} /> : <Sun size={24} />}
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white">{config.enabled ? '夜间模式已开启' : '夜间模式已关闭'}</h3>
                 <p className="text-slate-400 text-sm">{config.enabled ? '群组将按照设定时间自动静音' : '群组全天24小时正常发言'}</p>
               </div>
            </div>
            <button 
              onClick={() => setConfig({...config, enabled: !config.enabled})}
              className={`w-16 h-9 rounded-full transition-colors relative ${config.enabled ? 'bg-indigo-500' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-7 h-7 rounded-full bg-white transition-all shadow-md ${config.enabled ? 'left-8' : 'left-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50">
             <div className="space-y-2">
               <label className="text-indigo-300 text-sm font-semibold flex items-center gap-2">
                 <Moon size={14} /> 开始时间 (静音)
               </label>
               <input 
                type="time" 
                value={config.startTime}
                onChange={(e) => setConfig({...config, startTime: e.target.value})}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
               />
             </div>
             <div className="space-y-2">
               <label className="text-orange-300 text-sm font-semibold flex items-center gap-2">
                 <Sun size={14} /> 结束时间 (解除)
               </label>
               <input 
                type="time" 
                value={config.endTime}
                onChange={(e) => setConfig({...config, endTime: e.target.value})}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg font-mono focus:ring-2 focus:ring-orange-500 outline-none"
               />
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-slate-300 font-medium">执行模式</label>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setConfig({...config, mode: 'mute'})}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${config.mode === 'mute' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}
                >
                  <BellOff size={20} />
                  <span className="font-medium">全员禁言</span>
                  <span className="text-xs opacity-70">仅管理员可发言</span>
                </button>
                <button 
                  onClick={() => setConfig({...config, mode: 'close'})}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${config.mode === 'close' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}
                >
                  <Clock size={20} />
                  <span className="font-medium">关闭群组</span>
                  <span className="text-xs opacity-70">删除一切新消息</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
