import React from 'react';
import { Users, MessageCircle, UserPlus, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { getStats } from '../services/mockService';

export const Dashboard: React.FC = () => {
  const stats = getStats();

  const StatCard = ({ label, value, icon: Icon, change, trend }: any) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-xl text-blue-400">
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </span>
        <span className="text-slate-500 text-xs">较上周</span>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-white">仪表盘概览</h2>
        <p className="text-slate-400 mt-1">Telegram 群组实时统计数据</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="总成员数" value={stats.totalMembers.toLocaleString()} icon={Users} change="12%" trend="up" />
        <StatCard label="今日新增" value={stats.newMembersToday} icon={UserPlus} change="5%" trend="up" />
        <StatCard label="今日消息" value={stats.messagesToday.toLocaleString()} icon={MessageCircle} change="8%" trend="up" />
        <StatCard label="活跃用户" value={stats.activeUsers} icon={Activity} change="2%" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">活跃度趋势图</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
             {[35, 45, 30, 60, 75, 50, 65, 80, 70, 55, 90, 85].map((h, i) => (
               <div key={i} className="w-full bg-blue-500/20 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-400" 
                    style={{ height: `${h}%` }}
                  ></div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-slate-500 text-sm">
             <span>00:00</span>
             <span>06:00</span>
             <span>12:00</span>
             <span>18:00</span>
             <span>23:59</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
           <h3 className="text-lg font-semibold text-white mb-4">最近操作日志</h3>
           <div className="space-y-4">
             {[
               { user: '@john_doe', action: '加入群组', time: '2分钟前', color: 'text-emerald-400' },
               { user: '@spammer_bot', action: '踢出 (验证超时)', time: '15分钟前', color: 'text-red-400' },
               { user: '@alice_w', action: '发送媒体文件', time: '42分钟前', color: 'text-blue-400' },
               { user: '系统', action: '发送定时消息', time: '1小时前', color: 'text-purple-400' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                 <div>
                   <p className="text-slate-200 font-medium">{item.user}</p>
                   <p className={`text-xs ${item.color}`}>{item.action}</p>
                 </div>
                 <span className="text-slate-500 text-xs">{item.time}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};