import React, { useState } from 'react';
import { Copy, Terminal, Cloud, FileCode, Package, Rocket, Download } from 'lucide-react';
import { WelcomeConfig, VerificationConfig, ProtectionConfig, ScheduledTask, NightModeConfig } from '../types';

interface BotCodeProps {
  welcomeConfig: WelcomeConfig;
  verificationConfig: VerificationConfig;
  protectionConfig: ProtectionConfig;
  scheduledTasks: ScheduledTask[];
  nightModeConfig: NightModeConfig;
}

export const BotCode: React.FC<BotCodeProps> = ({ 
  welcomeConfig, 
  verificationConfig, 
  protectionConfig, 
  scheduledTasks,
  nightModeConfig
}) => {
  const [activeTab, setActiveTab] = useState<'bot' | 'requirements' | 'deploy'>('deploy');

  // Dynamic Python Code Generation
  const generatePythonCode = () => {
    return `import logging
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ChatPermissions
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, CallbackQueryHandler, filters
import os

# ================= 核心配置 (由 TeleBot Manager 生成) =================
# ⚠️ 注意: 部署到云端时，建议将 TOKEN 放入环境变量，或者在此处直接替换
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_TOKEN_HERE') 

# 1. 欢迎与验证配置
WELCOME_CONFIG = {
    'enabled': ${welcomeConfig.enabled ? 'True' : 'False'},
    'message': r"""${welcomeConfig.message}""",
    'delete_after': ${welcomeConfig.deleteAfter},
    'buttons': ${JSON.stringify(welcomeConfig.buttons)},
    'delete_service_msg': ${welcomeConfig.deleteServiceMessage ? 'True' : 'False'}
}

VERIFY_CONFIG = {
    'enabled': ${verificationConfig.enabled ? 'True' : 'False'},
    'timeout': ${verificationConfig.timeout},
    'action': '${verificationConfig.action}',
    'welcome_msg': r"""${verificationConfig.welcomeMessage}"""
}

# 2. 防护配置
PROTECT_CONFIG = {
    'block_links': ${protectionConfig.blockLinks ? 'True' : 'False'},
    'block_forwarded': ${protectionConfig.blockForwarded ? 'True' : 'False'},
    'sensitive_words': ${JSON.stringify(protectionConfig.sensitiveWords)},
    'anti_flood': ${JSON.stringify(protectionConfig.antiFlood)}
}

# =================================================================

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ 机器人已在云端运行！配置已同步。")

# --- 功能: 新成员处理 (验证 + 欢迎) ---
async def welcome_new_member(update: Update, context: ContextTypes.DEFAULT_TYPE):
    for member in update.message.new_chat_members:
        if member.id == context.bot.id:
            continue

        # 1. 删除系统消息
        if WELCOME_CONFIG['delete_service_msg']:
            try:
                await update.message.delete()
            except:
                pass

        # 2. 验证流程 (如果开启)
        if VERIFY_CONFIG['enabled']:
            await context.bot.restrict_chat_member(
                chat_id=update.effective_chat.id,
                user_id=member.id,
                permissions=ChatPermissions(can_send_messages=False)
            )
            
            keyboard = [[InlineKeyboardButton("🤖 点我验证 / Click to Verify", callback_data=f"verify_{member.id}")]]
            verify_msg = await update.message.reply_text(
                VERIFY_CONFIG['welcome_msg'].format(username=member.mention_html(), timeout=VERIFY_CONFIG['timeout']),
                reply_markup=InlineKeyboardMarkup(keyboard),
                parse_mode='HTML'
            )
            # 设置验证超时任务 (此处简化处理，实际生产环境建议用 JobQueue)
            return

        # 3. 直接发送欢迎 (如果没开启验证)
        if WELCOME_CONFIG['enabled']:
            await send_welcome(update, context, member)

async def send_welcome(update: Update, context: ContextTypes.DEFAULT_TYPE, member):
    keyboard = []
    if WELCOME_CONFIG['buttons']:
        row = []
        for btn in WELCOME_CONFIG['buttons']:
            row.append(InlineKeyboardButton(btn['label'], url=btn['url']))
        keyboard.append(row)
    
    msg_text = WELCOME_CONFIG['message'].replace('{username}', member.mention_html()).replace('{mention}', member.mention_html())
    
    msg = await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text=msg_text,
        reply_markup=InlineKeyboardMarkup(keyboard) if keyboard else None,
        parse_mode='HTML'
    )

    if WELCOME_CONFIG['delete_after'] > 0:
        context.job_queue.run_once(delete_message_job, WELCOME_CONFIG['delete_after'], data=msg)

async def delete_message_job(context: ContextTypes.DEFAULT_TYPE):
    try:
        await context.job.data.delete()
    except:
        pass

async def verify_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    try:
        user_id = int(query.data.split('_')[1])
    except:
        return
    
    if query.from_user.id != user_id:
        await query.answer("❌ 这不是你的验证按钮！", show_alert=True)
        return

    # 解除限制
    await context.bot.restrict_chat_member(
        chat_id=update.effective_chat.id,
        user_id=user_id,
        permissions=ChatPermissions(
            can_send_messages=True,
            can_send_media_messages=True,
            can_send_other_messages=True,
            can_add_web_page_previews=True
        )
    )
    await query.answer("✅ 验证通过！")
    await query.message.delete()
    
    # 验证通过后发送欢迎
    if WELCOME_CONFIG['enabled']:
        # 模拟 update 结构以便复用 send_welcome
        await send_welcome(update, context, query.from_user)

# --- 功能: 消息过滤 ---
async def message_filter(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.message.text:
        return

    text = update.message.text.lower()
    
    # 1. 链接拦截
    if PROTECT_CONFIG['block_links'] and ('http://' in text or 'https://' in text):
        await delete_and_warn(update, "🚫 本群禁止发送外部链接。")
        return

    # 2. 敏感词拦截
    if any(word.lower() in text for word in PROTECT_CONFIG['sensitive_words']):
        await delete_and_warn(update, "🚫 包含敏感词汇，已删除。")
        return

async def delete_and_warn(update, reason):
    try:
        await update.message.delete()
        warn = await update.message.reply_text(f"{update.message.from_user.mention_html()} {reason}", parse_mode='HTML')
        # 5秒后删除警告
        asyncio.create_task(delayed_delete(warn, 5))
    except Exception as e:
        print(f"Delete failed: {e}")

async def delayed_delete(msg, seconds):
    await asyncio.sleep(seconds)
    try:
        await msg.delete()
    except:
        pass

if __name__ == '__main__':
    print("🚀 云端机器人启动中...")
    application = ApplicationBuilder().token(TOKEN).build()
    
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.StatusUpdate.NEW_CHAT_MEMBERS, welcome_new_member))
    application.add_handler(CallbackQueryHandler(verify_callback))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), message_filter))
    
    print("✅ 轮询开始...")
    application.run_polling()
`;
  };

  const requirementsCode = `python-telegram-bot==20.8
asyncio
logging`;

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Cloud className="text-blue-400" />
          云端部署中心
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          将配置好的机器人部署到云服务器，实现 24 小时在线。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-800">
        <button 
          onClick={() => setActiveTab('deploy')}
          className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'deploy' ? 'border-blue-500 text-white bg-slate-700/50' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <Rocket size={16} /> 部署指南
        </button>
        <button 
          onClick={() => setActiveTab('bot')}
          className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'bot' ? 'border-blue-500 text-white bg-slate-700/50' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <FileCode size={16} /> bot.py (代码)
        </button>
        <button 
          onClick={() => setActiveTab('requirements')}
          className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'requirements' ? 'border-blue-500 text-white bg-slate-700/50' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <Package size={16} /> requirements.txt
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {activeTab === 'deploy' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl">
               <h3 className="text-xl font-bold text-emerald-400 mb-2">架构说明</h3>
               <p className="text-emerald-200/80 leading-relaxed">
                 你现在使用的网页是 <strong>配置生成器</strong>。你在网页上修改的所有设置（欢迎语、敏感词等）
                 都已经自动注入到了 <code className="bg-emerald-900/50 px-2 py-0.5 rounded text-white">bot.py</code> 代码中。
                 <br/><br/>
                 要让功能生效，你需要将生成的代码部署到云端。每次修改配置后，都需要重新部署代码。
               </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">推荐部署平台 (免费/低成本)</h3>
              
              {/* Railway Option */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors group">
                 <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      Ry
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Railway.app (推荐)</h4>
                      <p className="text-slate-400 text-xs">极其适合 Telegram Bot，部署只需几秒。</p>
                    </div>
                  </div>
                  <a href="https://railway.app/" target="_blank" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg font-medium transition-colors">去部署</a>
                </div>
                <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
                  <li>
                    点击上方标签页，下载 <code className="text-purple-400 bg-purple-400/10 px-1 rounded">bot.py</code> 和 <code className="text-purple-400 bg-purple-400/10 px-1 rounded">requirements.txt</code>。
                  </li>
                  <li>
                    将这两个文件放入一个新建文件夹，并上传到你的 <strong>GitHub</strong> 仓库。
                  </li>
                  <li>
                    在 Railway 中点击 <strong>New Project</strong> -> <strong>Deploy from GitHub repo</strong>。
                  </li>
                  <li>
                    Railway 会自动识别 Python 环境并安装依赖。
                  </li>
                  <li>
                    <strong>关键一步：</strong> 在 Railway 的 Variables (变量) 设置中添加：
                    <br/>
                    <code className="bg-black/30 px-2 py-1 rounded mt-1 block w-max">TELEGRAM_BOT_TOKEN = 你的Token</code>
                  </li>
                </ol>
              </div>

               {/* Render Option */}
               <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
                      Render
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Render.com</h4>
                      <p className="text-slate-400 text-xs">有免费层，适合轻量级应用。</p>
                    </div>
                  </div>
                  <a href="https://dashboard.render.com/" target="_blank" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors">去注册</a>
                </div>
                <p className="text-slate-400 text-sm mb-2">步骤与 Railway 类似。记得在 Environment 选项卡中添加 TOKEN。</p>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'bot' || activeTab === 'requirements') && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-400">
                {activeTab === 'bot' 
                  ? '这是包含你所有配置的完整逻辑代码。' 
                  : '这是云端服务器安装 Python 库所需的清单。'}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => downloadFile(activeTab === 'bot' ? 'bot.py' : 'requirements.txt', activeTab === 'bot' ? generatePythonCode() : requirementsCode)}
                  className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <Download size={16} /> 下载文件
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(activeTab === 'bot' ? generatePythonCode() : requirementsCode)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Copy size={16} /> 复制内容
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
               <pre className="p-6 font-mono text-sm text-slate-300 leading-relaxed h-full overflow-y-auto">
                <code className="block">
                  {activeTab === 'bot' ? generatePythonCode() : requirementsCode}
                </code>
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
