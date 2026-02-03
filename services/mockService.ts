import { GroupStats, ScheduledTask, VerificationConfig, MediaUpload, WelcomeConfig, ProtectionConfig, NightModeConfig } from '../types';

export const getStats = (): GroupStats => ({
  totalMembers: 12543,
  newMembersToday: 128,
  messagesToday: 4521,
  activeUsers: 892
});

export const getScheduledTasks = (): ScheduledTask[] => [
  { id: '1', content: '欢迎加入本群！请务必阅读群规 /rules。', interval: 6, nextRun: '14:00', active: true },
  { id: '2', content: '别忘了查看置顶消息获取最新动态。', interval: 12, nextRun: '20:00', active: true },
  { id: '3', content: '管理员在线时间为 UTC 9:00 至 17:00。', interval: 24, nextRun: '09:00', active: false },
];

export const getVerificationConfig = (): VerificationConfig => ({
  enabled: true,
  timeout: 60,
  action: 'mute',
  welcomeMessage: '你好 {username}，请在 {timeout} 秒内点击下方按钮验证你不是机器人。'
});

export const getWelcomeConfig = (): WelcomeConfig => ({
  enabled: true,
  message: '欢迎 {username} 来到本群！\n\n请先查看群规，如果不守规矩会被踢出哦。',
  deleteAfter: 30,
  deleteServiceMessage: true,
  buttons: [
    { label: '查看群规', url: 'https://t.me/your_channel/123' },
    { label: '访问官网', url: 'https://example.com' }
  ]
});

export const getProtectionConfig = (): ProtectionConfig => ({
  blockLinks: true,
  blockForwarded: false,
  sensitiveWords: ['加群', '兼职', '刷单', 'free money', 'crypto'],
  antiFlood: {
    enabled: true,
    threshold: 5,
    timeWindow: 10,
    action: 'mute'
  }
});

export const getNightModeConfig = (): NightModeConfig => ({
  enabled: false,
  startTime: '23:00',
  endTime: '08:00',
  mode: 'mute'
});

export const getMediaHistory = (): MediaUpload[] => [
  { id: '1', name: 'promo_video_v1.mp4', type: 'video', url: '', caption: '新功能发布预览！', status: 'sent' },
  { id: '2', name: 'event_banner.jpg', type: 'image', url: '', caption: '本周末活动海报', status: 'sent' },
];