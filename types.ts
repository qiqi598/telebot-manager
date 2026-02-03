export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  WELCOME = 'WELCOME',
  VERIFICATION = 'VERIFICATION',
  PROTECTION = 'PROTECTION',
  SCHEDULED = 'SCHEDULED',
  NIGHT_MODE = 'NIGHT_MODE',
  MEDIA = 'MEDIA',
  CODE = 'CODE'
}

export interface GroupStats {
  totalMembers: number;
  newMembersToday: number;
  messagesToday: number;
  activeUsers: number;
}

export interface ScheduledTask {
  id: string;
  content: string;
  interval: number; // in hours
  nextRun: string;
  active: boolean;
}

export interface VerificationConfig {
  enabled: boolean;
  timeout: number; // seconds
  action: 'kick' | 'mute' | 'ban';
  welcomeMessage: string;
}

export interface WelcomeConfig {
  enabled: boolean;
  message: string;
  deleteAfter: number; // seconds, 0 for never
  buttons: { label: string; url: string }[];
  deleteServiceMessage: boolean; // Delete "User joined the group" system msg
}

export interface ProtectionConfig {
  blockLinks: boolean;
  blockForwarded: boolean;
  sensitiveWords: string[];
  antiFlood: {
    enabled: boolean;
    threshold: number; // messages count
    timeWindow: number; // seconds
    action: 'mute' | 'kick' | 'ban';
  };
}

export interface NightModeConfig {
  enabled: boolean;
  startTime: string; // "23:00"
  endTime: string; // "07:00"
  mode: 'mute' | 'close'; // mute=only admins speak, close=delete all msgs
}

export interface MediaUpload {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  status: 'pending' | 'sent';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}