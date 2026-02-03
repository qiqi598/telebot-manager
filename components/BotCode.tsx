import React from 'react';
import { Copy, Terminal, Play, Shield, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const BotCode: React.FC = () => {
  const pythonCode = `
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ChatPermissions
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, CallbackQueryHandler, filters
import datetime

# ================= 配置区域 =================
# 1. 请在 BotFather 获取 Token
# ⚠️ 注意：Token 必须包裹在单引号中，例如 '1234:ABCD...'
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
    await update.message.reply_text("✅ 机器人正在运行中！我是超级群管。")

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
        try:
            await update.message.delete()
            # 这里的 chat_id 和 user_id 需要从 update 获取
            # 实际部署时可添加禁言逻辑
        except Exception as e:
            print(f"❌ 删除失败，可能没有管理员权限: {e}")
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

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={32} />
            启动成功！下一步做什么？
            </h2>
        </div>
        <p className="text-slate-400 mt-1">你的终端显示 <code className="text-emerald-400">Application started</code> 说明一切正常。现在请按以下步骤测试。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Step 1: Admin Rights */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Shield className="text-yellow-400" />
                关键步骤：设置管理员
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
                <p>机器人必须是<strong>管理员 (Admin)</strong> 才能删除垃圾消息或禁言用户。</p>
                <ol className="list-decimal list-inside space-y-2 mt-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <li>打开你的 Telegram 群组。</li>
                    <li>点击群组标题，进入设置。</li>
                    <li>点击 <strong>Administrators (管理员)</strong> -> <strong>Add Admin</strong>。</li>
                    <li>搜索你的机器人名字，点击添加。</li>
                    <li><span className="text-emerald-400 font-bold">重要：</span>确保勾选 "Delete messages" 和 "Ban users"。</li>
                </ol>
            </div>
        </div>

        {/* Step 2: Testing */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Terminal className="text-blue-400" />
                功能测试清单
            </h3>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-blue-500/20 rounded text-blue-400"><Play size={14}/></div>
                    <div>
                        <h4 className="text-white font-medium text-sm">1. 测试响应</h4>
                        <p className="text-slate-400 text-xs">私聊机器人或在群里发送 <code className="bg-slate-700 px-1 rounded">/start</code>，它应该回复 "✅ 机器人正在运行中"。</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-red-500/20 rounded text-red-400"><AlertTriangle size={14}/></div>
                    <div>
                        <h4 className="text-white font-medium text-sm">2. 测试敏感词拦截</h4>
                        <p className="text-slate-400 text-xs">在群里发送单词 <code className="bg-slate-700 px-1 rounded">crypto</code> 或 <code className="bg-slate-700 px-1 rounded">刷单</code>。如果机器人是管理员，消息应被秒删。</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-pink-500/20 rounded text-pink-400"><MessageSquare size={14}/></div>
                    <div>
                        <h4 className="text-white font-medium text-sm">3. 测试入群欢迎</h4>
                        <p className="text-slate-400 text-xs">邀请一个朋友进群，或者自己用小号进群。应该能看到验证按钮。</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Code Viewer (Collapsed/Secondary) */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-800 p-3 flex items-center justify-between border-b border-slate-700">
          <span className="text-xs font-mono text-slate-500 ml-2">bot.py (源码参考)</span>
          <button 
            onClick={() => navigator.clipboard.writeText(pythonCode)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors"
          >
            <Copy size={14} /> 复制代码
          </button>
        </div>
        <div className="p-0 overflow-x-auto max-h-60 overflow-y-auto">
          <pre className="p-4 font-mono text-xs text-slate-400 leading-relaxed">
            <code className="block">{pythonCode}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
