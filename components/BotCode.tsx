import React from 'react';
import { Copy, Terminal, ExternalLink } from 'lucide-react';

export const BotCode: React.FC = () => {
  const pythonCode = `
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ChatPermissions
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, CallbackQueryHandler, filters
import datetime
import re

# ================= 配置区域 =================
TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'
GROUP_ID = -100123456789

# 1. 欢迎设置
WELCOME_MSG = "欢迎 {mention} 加入本群！请阅读群规。"
AUTO_DELETE_WELCOME = 30 # 秒

# 2. 防护设置
SENSITIVE_WORDS = ['加群', '刷单', 'free money', 'crypto']
BLOCK_LINKS = True

# 3. 夜间模式
NIGHT_MODE_START = 23 # 23:00
NIGHT_MODE_END = 8    # 08:00
# ===========================================

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("我是超级群管机器人！")

# --- 功能 1: 增强版入群欢迎 ---
async def welcome_new_member(update: Update, context: ContextTypes.DEFAULT_TYPE):
    for member in update.message.new_chat_members:
        # 限制新用户权限（点击按钮验证前）
        await context.bot.restrict_chat_member(
            chat_id=update.effective_chat.id,
            user_id=member.id,
            permissions=ChatPermissions(can_send_messages=False)
        )
        
        keyboard = [
            [InlineKeyboardButton("✅ 我是人类 (点击验证)", callback_data=f"verify_{member.id}")],
            [InlineKeyboardButton("📜 查看群规", url="https://t.me/your_channel")]
        ]
        
        msg = await update.message.reply_text(
            WELCOME_MSG.format(mention=member.mention_html()),
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode='HTML'
        )
        
        # 自动删除欢迎消息
        if AUTO_DELETE_WELCOME > 0:
            context.job_queue.run_once(delete_message, AUTO_DELETE_WELCOME, data=msg)

    # 自动删除系统服务消息 ("User joined group")
    try:
        await update.message.delete()
    except:
        pass

async def delete_message(context: ContextTypes.DEFAULT_TYPE):
    msg = context.job.data
    try:
        await msg.delete()
    except:
        pass

async def verify_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    user_id = int(query.data.split('_')[1])
    
    if query.from_user.id != user_id:
        await query.answer("这不是你的验证按钮！", show_alert=True)
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
    await query.answer("验证通过！")
    await query.message.delete()

# --- 功能 2: 内容防护与反广告 ---
async def message_filter(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.message.text:
        return

    text = update.message.text.lower()
    user = update.effective_user
    chat_id = update.effective_chat.id

    # 检查敏感词
    if any(word in text for word in SENSITIVE_WORDS):
        await update.message.delete()
        # 禁言 1 小时
        await context.bot.restrict_chat_member(
            chat_id, user.id, 
            permissions=ChatPermissions(can_send_messages=False),
            until_date=datetime.datetime.now() + datetime.timedelta(hours=1)
        )
        return

    # 检查链接
    if BLOCK_LINKS and ('http://' in text or 'https://' in text or 't.me/' in text):
        # 忽略管理员
        member = await context.bot.get_chat_member(chat_id, user.id)
        if member.status not in ['creator', 'administrator']:
            await update.message.delete()
            return

# --- 功能 3: 夜间模式 (定时任务) ---
async def night_mode_on(context: ContextTypes.DEFAULT_TYPE):
    # 关闭全员发言权限
    await context.bot.set_chat_permissions(
        chat_id=GROUP_ID,
        permissions=ChatPermissions(can_send_messages=False)
    )
    await context.bot.send_message(GROUP_ID, "🌙 夜间模式已开启，全员禁言，明早见！")

async def night_mode_off(context: ContextTypes.DEFAULT_TYPE):
    # 恢复发言
    await context.bot.set_chat_permissions(
        chat_id=GROUP_ID,
        permissions=ChatPermissions(
            can_send_messages=True,
            can_send_media_messages=True,
            can_send_polls=True
        )
    )
    await context.bot.send_message(GROUP_ID, "☀️ 早上好！夜间模式已结束，可以自由发言了。")

if __name__ == '__main__':
    application = ApplicationBuilder().token(TOKEN).build()
    
    # Handlers
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.StatusUpdate.NEW_CHAT_MEMBERS, welcome_new_member))
    application.add_handler(CallbackQueryHandler(verify_callback))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), message_filter))
    
    # Job Queue for Scheduled Tasks & Night Mode
    jq = application.job_queue
    
    # 设置夜间模式定时 (UTC时间需换算)
    # jq.run_daily(night_mode_on, time=datetime.time(hour=23, minute=0))
    # jq.run_daily(night_mode_off, time=datetime.time(hour=8, minute=0))
    
    print("Bot is running...")
    application.run_polling()
`;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-green-400" />
          超级群管机器人代码
        </h2>
        <p className="text-slate-400 mt-1">包含入群验证、敏感词过滤、链接拦截和夜间模式的完整代码。</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"/>
            <div className="w-3 h-3 rounded-full bg-yellow-500"/>
            <div className="w-3 h-3 rounded-full bg-green-500"/>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(pythonCode)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors"
          >
            <Copy size={14} /> 复制代码
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="font-mono text-sm text-green-400 leading-relaxed">
            {pythonCode}
          </pre>
        </div>
      </div>

      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl text-blue-200">
        <h3 className="font-bold flex items-center gap-2 mb-2">
          <ExternalLink size={18} />
          部署提示
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
           <li>本代码使用了 <code className="font-mono">python-telegram-bot</code> 库的异步特性。</li>
           <li>请确保 Bot 拥有管理员权限，否则无法执行踢人、禁言或删除消息的操作。</li>
           <li>夜间模式的时间设置依赖于服务器时区，建议使用 <code className="font-mono">pytz</code> 库来指定时区。</li>
        </ul>
      </div>
    </div>
  );
};