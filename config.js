// Hardcoded proxies for public hosting (safe: no keys exposed in browser)
window.APP_CONFIG = {
  dailyRefreshMs: 24*60*60*1000,
  proxies: {
    reddit: "https://spring-bonus-310e.shyamvishnu19.workers.dev/reddit/search",
    twitter: "https://spring-bonus-310e.shyamvishnu19.workers.dev/twitter/search",
    threads: "https://spring-bonus-310e.shyamvishnu19.workers.dev/threads/search",
    chat: "https://spring-bonus-310e.shyamvishnu19.workers.dev/chat"
  },
  games: {
    CODM: { name:"Call of Duty: Mobile",
      subreddits:["CallOfDutyMobile","CODMobile"],
      twitter:{ handles:["codmINTEL","PlayCODMobile"], hashtags:["CODMobile"]},
      threads:{ handles:["callofdutymobile"]},
      news:[{title:"CODM — Official Blog", href:"https://www.callofduty.com/blog/mobile", src:"callofduty.com"}]
    },
    PUBG: { name:"PUBG Mobile",
      subreddits:["PUBGMobile","PUBGMobileLite"],
      twitter:{ handles:["PUBGMOBILE"], hashtags:["PUBGMobile"]},
      threads:{ handles:["pubgmobile"]},
      news:[{title:"PUBG Mobile — News", href:"https://www.pubgmobile.com/en-US/news", src:"pubgmobile.com"}]
    },
    FREEFIRE: { name:"Free Fire",
      subreddits:["freefire","GarenaFreeFire"],
      twitter:{ handles:["FreeFireBG"], hashtags:["FreeFire"]},
      threads:{ handles:["freefire"]},
      news:[{title:"Free Fire — Newsroom", href:"https://ff.garena.com/news/en/", src:"garena.com"}]
    },
    DELTA: { name:"Delta Force",
      subreddits:["DeltaForceGame"],
      twitter:{ handles:["DeltaForceGame"], hashtags:["DeltaForce"]},
      threads:{ handles:["deltaforcegame"]},
      news:[{title:"Delta Force — Official", href:"https://www.deltaforcegame.com/news", src:"deltaforcegame.com"}]
    }
  }
};
