export interface System {
  id: number;
  name: string;
  team: string;
  icon: string;
  details: string;
  url: string;
  isAlive: boolean;
  lastAlive: string;
  isGraphOpen?: boolean;
}

export interface SystemWithStat {
  system: System;
  stats: SystemStat;
}

export interface SystemStat {
  serverId: number;
  stats: Stat[];
}

export interface Stat {
  request_time: string;
  duration_ms: number;
}
