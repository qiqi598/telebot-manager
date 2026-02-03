import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { getScheduledTasks } from '../services/mockService';
import { ScheduledTask } from '../types';

export const Scheduled: React.FC = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>(getScheduledTasks());

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="text-blue-400" />
            定时消息管理
          </h2>
          <p className="text-slate-400 mt-1">自动发送周期性公告、群规或推广信息。</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all">
          <Plus size={18} /> 新建任务
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${task.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-400'}`}>
                  {task.active ? '运行中' : '已暂停'}
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Clock size={14} /> 每 {task.interval} 小时
                </span>
                <span className="text-slate-500 text-sm">下次发送: {task.nextRun}</span>
              </div>
              <p className="text-slate-200 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                {task.content}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  task.active 
                    ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10' 
                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {task.active ? '暂停' : '恢复'}
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};