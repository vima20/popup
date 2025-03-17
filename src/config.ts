interface Config {
  version: string;
  websocket: {
    url: string;
    reconnectAttempts: number;
    reconnectDelay: number;
    heartbeatInterval: number;
  };
  videoServices: {
    domains: string[];
  };
  rateLimit: {
    minMessageInterval: number;
    maxMessagesPerMinute: number;
  };
  defaultMessageStyle: {
    position: 'top' | 'middle' | 'bottom';
    color: string;
    fontSize: string;
    duration: number;
  };
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'text';
    console: boolean;
    file: boolean;
  };
}

const config: Config = {
  version: '7.0.0',
  websocket: {
    url: process.env.NODE_ENV === 'production'
      ? 'wss://your-production-url'
      : 'wss://localhost:3000',
    reconnectAttempts: 5,
    reconnectDelay: 5000, // 5 sekuntia
    heartbeatInterval: 30000, // 30 sekuntia
  },
  videoServices: {
    domains: [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'dailymotion.com',
      'twitch.tv',
      'netflix.com',
      'hulu.com',
      'disney.com',
      'disneyplus.com',
      'hbo.com',
      'hbomax.com',
      'plex.tv',
      'primevideo.com',
      'youtube-nocookie.com',
      'facebook.com',
      'instagram.com',
      'tiktok.com',
      'tv.apple.com',
      'peacocktv.com',
      'max.com',
      'play.hbomax.com',
      'play.max.com',
      'abcgo.com',
      'paramountplus.com',
      'discovery.com',
      'discoveryplus.com',
      'espn.com',
      'dazn.com',
      'mlb.com',
      'nba.com',
      'nfl.com',
      'nhltv.com',
      'crunchyroll.com',
      'funimation.com',
      'adultswim.com',
      'ruutu.fi',
      'areena.yle.fi',
      'mtv-palvelu.fi',
      'mtvkatsomo.fi',
      'viaplay.fi',
      'elisa-viihde.fi',
      'teliaplay.se',
      'cmore.fi',
      'nexgentv.fi',
      'dna.fi',
      'play.tv2.dk',
      'dr.dk',
      'tv4play.se',
      'viaplay.no',
      'tv2.no',
      'nrk.no',
      'svtplay.se',
      'amazon.com'
    ]
  },
  rateLimit: {
    minMessageInterval: Number(process.env.MIN_MESSAGE_INTERVAL) || 1000, // 1 sekunti
    maxMessagesPerMinute: Number(process.env.MAX_MESSAGES_PER_MINUTE) || 60
  },
  defaultMessageStyle: {
    position: 'middle' as const,
    color: '#ffffff',
    fontSize: '24px',
    duration: 5
  },
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as 'error' | 'warn' | 'info' | 'debug',
    format: (process.env.LOG_FORMAT || 'text') as 'json' | 'text',
    console: process.env.LOG_CONSOLE !== 'false',
    file: process.env.LOG_FILE !== 'false'
  }
};

export default config; 