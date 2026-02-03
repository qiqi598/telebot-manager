import React from 'react';
import { MessageSquare, Clock, Link, Trash2, Plus, Save } from 'lucide-react';
import { WelcomeConfig } from '../types';

interface WelcomeProps {
  config: WelcomeConfig;
  setConfig: (config: WelcomeConfig) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ config, setConfig }) => {
  const addButton = () => {
    setConfig({ ...config, buttons: [...config.buttons, { label: '新按钮', url: 'https://' }] });
  };

  const removeButton = (index: number) => {
    const newButtons = [...config.buttons];
    newButtons.splice(index, 1);
    setConfig({ ...config, buttons: newButtons });
  };

  const updateButton = (index: number, field: 'label' | 'url', value: string) => {
    const newButtons = [...config.buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setConfig({ ...config, buttons: newButtons });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-pink-400" />
          入群欢迎设置
        </h2>
        <p className="text-slate-400 mt-1">自定义新成员加入时发送的欢迎信息和按钮。</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 space-y-8">
        
        {/* Toggle */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-white">启用欢迎消息</h3>
            <p className="text-slate-400 text-sm">当用户通过验证后发送欢迎语。</p>
          </div>
          <button 
            onClick={() => setConfig({...config, enabled: !config.enabled})}
            className={`w-14 h-8 rounded-full transition-colors relative ${config.enabled ? 'bg-pink-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${config.enabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Message Content */}
        <div className="space-y-3">
          <label className="text-slate-300 font-medium">欢迎语内容</label>
          <textarea 
            value={config.message}
            onChange={(e) => setConfig({...config, message: e.target.value})}
            rows={5}
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none"
          />
          <p className="text-xs text-slate-500">支持 HTML/Markdown。变量: {'{mention}'} (提及用户), {'{username}'}, {'{id}'}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <label className="text-slate-300 font-medium flex items-center justify-between">
            <span>消息按钮 (Inline Buttons)</span>
            <button onClick={addButton} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300">
              <Plus size={14} /> 添加按钮
            </button>
          </label>
          
          {config.buttons.map((btn, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input 
                type="text" 
                value={btn.label}
                onChange={(e) => updateButton(idx, 'label', e.target.value)}
                placeholder="按钮文字"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              />
              <div className="flex-2 flex items-center gap-2 flex-grow">
                 <Link size={16} className="text-slate-500" />
                 <input 
                  type="text" 
                  value={btn.url}
                  onChange={(e) => updateButton(idx, 'url', e.target.value)}
                  placeholder="跳转链接 (https://...)"
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <button onClick={() => removeButton(idx)} className="p-2 text-slate-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
           <div className="space-y-2">
             <label className="text-slate-300 font-medium flex items-center gap-2">
               <Clock size={16} /> 自动删除 (秒)
             </label>
             <input 
              type="number" 
              value={config.deleteAfter}
              onChange={(e) => setConfig({...config, deleteAfter: parseInt(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
             />
             <p className="text-xs text-slate-500">设为 0 则不自动删除。</p>
           </div>
           
           <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-600/50">
             <div className="text-sm">
               <div className="text-slate-200 font-medium">删除系统入群消息</div>
               <div className="text-slate-500 text-xs">自动删除 "User joined group"</div>
             </div>
             <input 
                type="checkbox" 
                checked={config.deleteServiceMessage} 
                onChange={(e) => setConfig({...config, deleteServiceMessage: e.target.checked})}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-pink-500 focus:ring-pink-500"
             />
           </div>
        </div>
      </div>
    </div>
  );
};
