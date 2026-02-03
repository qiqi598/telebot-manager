import React, { useState } from 'react';
import { Shield, Clock, AlertTriangle, Save } from 'lucide-react';
import { getVerificationConfig } from '../services/mockService';

export const Verification: React.FC = () => {
  const [config, setConfig] = useState(getVerificationConfig());

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="text-emerald-400" />
          防垃圾验证设置
        </h2>
        <p className="text-slate-400 mt-1">配置新成员入群时的验证流程，防止广告机器人。</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 space-y-8">
        
        {/* Toggle */}
        <div className="flex items-center justify-between pb-8 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-white">启用入群验证</h3>
            <p className="text-slate-400 text-sm">新成员必须完成验证才能在群内发言。</p>
          </div>
          <button 
            onClick={() => setConfig({...config, enabled: !config.enabled})}
            className={`w-14 h-8 rounded-full transition-colors relative ${config.enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${config.enabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Timeout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-slate-300 font-medium flex items-center gap-2">
              <Clock size={18} /> 验证超时时间 (秒)
            </label>
            <input 
              type="number" 
              value={config.timeout}
              onChange={(e) => setConfig({...config, timeout: parseInt(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-slate-300 font-medium flex items-center gap-2">
              <AlertTriangle size={18} /> 超时处理动作
            </label>
            <select 
              value={config.action}
              onChange={(e) => setConfig({...config, action: e.target.value as any})}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="mute">禁言用户 (限制发言)</option>
              <option value="kick">踢出群组 (可重新加入)</option>
              <option value="ban">永久封禁 (无法再加入)</option>
            </select>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <label className="text-slate-300 font-medium">验证提示消息</label>
          <textarea 
            value={config.welcomeMessage}
            onChange={(e) => setConfig({...config, welcomeMessage: e.target.value})}
            rows={4}
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          <p className="text-xs text-slate-500">可用变量: {'{username}'} (用户名), {'{timeout}'} (超时秒数)</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            <Save size={20} />
            保存配置
          </button>
        </div>

      </div>
    </div>
  );
};