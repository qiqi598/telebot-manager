import React, { useState } from 'react';
import { LayoutDashboard, Shield, Calendar, Image, Terminal, Bot, MessageSquare, ShieldAlert, Moon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Welcome } from './components/Welcome';
import { Verification } from './components/Verification';
import { Protection } from './components/Protection';
import { NightMode } from './components/NightMode';
import { Scheduled } from './components/Scheduled';
import { Media } from './components/Media';
import { BotCode } from './components/BotCode';
import { AppTab, WelcomeConfig, VerificationConfig, ProtectionConfig, ScheduledTask, NightModeConfig } from './types';
import { getWelcomeConfig, getVerificationConfig, getProtectionConfig, getScheduledTasks, getNightModeConfig } from './services/mockService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  // Global State (Lifted Up)
  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeConfig>(getWelcomeConfig());
  const [verificationConfig, setVerificationConfig] = useState<VerificationConfig>(getVerificationConfig());
  const [protectionConfig, setProtectionConfig] = useState<ProtectionConfig>(getProtectionConfig());
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(getScheduledTasks());
  const [nightModeConfig, setNightModeConfig] = useState<NightModeConfig>(getNightModeConfig());

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: 
        return <Dashboard />;
      case AppTab.WELCOME: 
        return <Welcome config={welcomeConfig} setConfig={setWelcomeConfig} />;
      case AppTab.VERIFICATION: 
        return <Verification config={verificationConfig} setConfig={setVerificationConfig} />;
      case AppTab.PROTECTION: 
        return <Protection config={protectionConfig} setConfig={setProtectionConfig} />;
      case AppTab.SCHEDULED: 
        return <Scheduled tasks={scheduledTasks} setTasks={setScheduledTasks} />;
      case AppTab.NIGHT_MODE: 
        return <NightMode config={nightModeConfig} setConfig={setNightModeConfig} />;
      case AppTab.MEDIA: 
        return <Media />;
      case AppTab.CODE: 
        return <BotCode 
          welcomeConfig={welcomeConfig}
          verificationConfig={verificationConfig}
          protectionConfig={protectionConfig}
          scheduledTasks={scheduledTasks}
          nightModeConfig={nightModeConfig}
        />;
      default: return <Dashboard />;
    }
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left mb-1.5
        ${activeTab === tab 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      `}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
             <Bot className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">TeleBot</h1>
            <p className="text-xs text-slate-500">超级群管后台</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">基础管理</p>
          <NavItem tab={AppTab.DASHBOARD} icon={LayoutDashboard} label="概览" />
          <NavItem tab={AppTab.WELCOME} icon={MessageSquare} label="入群欢迎" />
          <NavItem tab={AppTab.VERIFICATION} icon={Shield} label="入群验证" />
          
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-6">安全与防护</p>
          <NavItem tab={AppTab.PROTECTION} icon={ShieldAlert} label="内容与防护" />
          <NavItem tab={AppTab.NIGHT_MODE} icon={Moon} label="夜间模式" />
          
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-6">运营工具</p>
          <NavItem tab={AppTab.SCHEDULED} icon={Calendar} label="定时消息" />
          <NavItem tab={AppTab.MEDIA} icon={Image} label="多媒体广播" />
          
          <div className="my-4 border-t border-slate-800 mx-4"></div>
          
          <NavItem tab={AppTab.CODE} icon={Terminal} label="部署机器人" />
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around p-2 overflow-x-auto">
        <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className={`p-3 rounded-full flex-shrink-0 ${activeTab === AppTab.DASHBOARD ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500'}`}><LayoutDashboard size={22} /></button>
        <button onClick={() => setActiveTab(AppTab.WELCOME)} className={`p-3 rounded-full flex-shrink-0 ${activeTab === AppTab.WELCOME ? 'text-pink-500 bg-pink-500/10' : 'text-slate-500'}`}><MessageSquare size={22} /></button>
        <button onClick={() => setActiveTab(AppTab.PROTECTION)} className={`p-3 rounded-full flex-shrink-0 ${activeTab === AppTab.PROTECTION ? 'text-orange-500 bg-orange-500/10' : 'text-slate-500'}`}><ShieldAlert size={22} /></button>
        <button onClick={() => setActiveTab(AppTab.CODE)} className={`p-3 rounded-full flex-shrink-0 ${activeTab === AppTab.CODE ? 'text-green-500 bg-green-500/10' : 'text-slate-500'}`}><Terminal size={22} /></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-950">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
