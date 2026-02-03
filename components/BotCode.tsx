import React from 'react';
import { Copy, Terminal, Play, FileCode, CheckCircle2, Command } from 'lucide-react';

export const BotCode: React.FC = () => {
  const pythonCode = `
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ChatPermissions
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, CallbackQueryHandler, filters
import datetime

# ================= 配置区域 =================
# 1. 请在 BotFather 获取 Token
TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN' 
GROUP_ID = -100123456789

# 2. 欢迎设置
WELCOME_MSG = "欢迎 {mention} 加入本群！请阅读群规。"
AUTO_DELETE_WELCOME = 30 # 秒

# 3. 防护设置
SENSITIVE_WORDS = ['加群', '刷单', 'free money', 'crypto']
BLOCK_LINKS = True
# ===========================================

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ 机器人正在运行中！")

# --- 核心功能: 验证入群 ---
async def welcome_new_member(update: Update, context: ContextTypes.DEFAULT_TYPE):
    for member in update.message.new_chat_members:
        # 1. 先禁言
        await context.bot.restrict_chat_member(
            chat_id=update.effective_chat.id,
            user_id=member.id,
            permissions=ChatPermissions(can_send_messages=False)
        )
        
        # 2. 发送验证按钮
        keyboard = [
            [InlineKeyboardButton("🤖 点我验证 (我是人类)", callback_data=f"verify_{member.id}")],
        ]
        
        msg = await update.message.reply_text(
            WELCOME_MSG.format(mention=member.mention_html()),
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode='HTML'
        )
        
        # 3. 定时删除欢迎消息
        if AUTO_DELETE_WELCOME > 0:
            context.job_queue.run_once(delete_message, AUTO_DELETE_WELCOME, data=msg)

async def delete_message(context: ContextTypes.DEFAULT_TYPE):
    try:
        await context.job.data.delete()
    except:
        pass

async def verify_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    user_id = int(query.data.split('_')[1])
    
    if query.from_user.id != user_id:
        await query.answer("❌ 别乱点，这不是给你的！", show_alert=True)
        return

    # 解除限制
    await context.bot.restrict_chat_member(
        chat_id=update.effective_chat.id,
        user_id=user_id,
        permissions=ChatPermissions(
            can_send_messages=True,
            can_send_media_messages=True,
            can_send_other_messages=True
        )
    )
    await query.answer("✅ 验证通过，欢迎发言！")
    await query.message.delete()

# --- 核心功能: 关键词过滤 ---
async def message_filter(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.message.text:
        return

    text = update.message.text.lower()
    
    # 简单的关键词匹配
    if any(word in text for word in SENSITIVE_WORDS):
        await update.message.delete()
        # 这里的 chat_id 和 user_id 需要从 update 获取
        # 实际部署时可添加禁言逻辑
        return

if __name__ == '__main__':
    print("🚀 机器人启动中...")
    application = ApplicationBuilder().token(TOKEN).build()
    
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.StatusUpdate.NEW_CHAT_MEMBERS, welcome_new_member))
    application.add_handler(CallbackQueryHandler(verify_callback))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), message_filter))
    
    print("✅ 机器人已上线，请在群组中测试。")
    application.run_polling()
`;

  const StepCard = ({ number, title, icon: Icon, children }: any) => (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/50">
          {number}
        </div>
        <h3 className="font-bold text-white flex items-center gap-2">
          <Icon size={18} className="text-blue-400" />
          {title}
        </h3>
      </div>
      <div className="text-sm text-slate-300 space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-green-400" />
          部署流程
        </h2>
        <p className="text-slate-400 mt-1">恭喜依赖库安装成功！请按顺序执行以下步骤。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Step 1 */}
        <StepCard number="1" title="安装依赖 (已完成)" icon={CheckCircle2}>
          <p className="opacity-60">你已经成功运行了安装命令。</p>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-emerald-400 text-xs">
            ✨ Successfully installed python-telegram-bot
          </div>
        </StepCard>

        {/* Step 2 */}
        <StepCard number="2" title="创建文件" icon={FileCode}>
          <p>1. 在你的文件夹中新建一个文件。</p>
          <p>2. 命名为 <code className="bg-slate-900 px-2 py-1 rounded border border-slate-600 text-white font-mono">bot.py</code></p>
          <p>3. 将下方的 Python 代码完整复制进去。</p>
          <p className="text-xs text-orange-400 mt-1">*记得修改代码中的 TOKEN！</p>
        </StepCard>

        {/* Step 3 */}
        <StepCard number="3" title="启动机器人" icon={Play}>
          <p>在终端中运行以下命令：</p>
          <div className="bg-black/40 p-3 rounded-lg font-mono text-emerald-400 text-sm border border-slate-600 select-all flex justify-between items-center group">
            <span>python3 bot.py</span>
            <Copy size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => navigator.clipboard.writeText('python3 bot.py')}/>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            看到 "机器人已上线" 后，去群里发个消息测试一下。
          </p>
        </StepCard>
      </div>

      {/* Code Block */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500"/>
              <div className="w-3 h-3 rounded-full bg-green-500"/>
            </div>
            <span className="text-xs font-mono text-slate-400">bot.py</span>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(pythonCode)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            <Copy size={16} /> 复制全部代码
          </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <pre className="p-6 font-mono text-sm text-slate-300 leading-relaxed bg-[#0d1117]">
            <code className="block">{pythonCode}</code>
          </pre>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
        <Command className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-blue-200 text-sm">如何获取 TOKEN？</h4>
          <p className="text-sm text-blue-300/80 mt-1">
            在 Telegram 中搜索 <span className="text-white font-bold">@BotFather</span>，发送 <code className="bg-blue-900/50 px-1 py-0.5 rounded">/newbot</code>，按照提示创建机器人。它会给你一串 HTTP API Token，替换掉代码中的 YOUR_TELEGRAM_BOT_TOKEN 即可。
          </p>
        </div>
      </div>

    </div>
  );
};
