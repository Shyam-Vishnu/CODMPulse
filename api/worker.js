// Cloudflare Worker v6: Reddit (live), Twitter (live via bearer), Threads (optional), Chat via OpenAI
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") return new Response(null, { headers: cors() });

    if (request.method === "POST" && path.endsWith("/reddit/search")) {
      try {
        const body = await request.json().catch(()=>({}));
        const subs = Array.isArray(body.subreddits) ? body.subreddits : [];
        const limit = Math.min(50, body.limit || 25);
        let posts = [];
        for (const sub of subs) {
          let ok = false;
          try {
            const r = await fetch(`https://www.reddit.com/r/${encodeURIComponent(sub)}/new.json?limit=${limit}`, { headers: { "User-Agent": "cf-worker" } });
            if (r.ok) { const d = await r.json(); posts.push(...pluckReddit(d)); ok = true; }
          } catch {}
          if (!ok) {
            try {
              const r = await fetch(`https://r.jina.ai/http://www.reddit.com/r/${encodeURIComponent(sub)}/new.json?limit=${limit}`);
              if (r.ok) { const d = await r.json(); posts.push(...pluckReddit(d)); ok = true; }
            } catch {}
          }
        }
        posts.sort((a,b)=> new Date(b.created_at)-new Date(a.created_at));
        return json(posts.slice(0, limit));
      } catch { return json([]); }
    }

    if (request.method === "POST" && path.endsWith("/twitter/search")) {
      const body = await request.json().catch(()=>({}));
      const handles = Array.isArray(body.handles)?body.handles:[];
      const hashtags = Array.isArray(body.hashtags)?body.hashtags:[];
      const limit = Math.min(100, body.limit || 50);
      if (!env.TWITTER_BEARER) return json([]);
      const qParts = [];
      for (const h of handles) qParts.push(`from:${h}`);
      for (const tag of hashtags) qParts.push(`#${tag}`);
      if (qParts.length===0) return json([]);
      const query = encodeURIComponent(qParts.join(" OR "));
      const endpoint = `https://api.twitter.com/2/tweets/search/recent?max_results=${Math.min(100, limit)}&tweet.fields=created_at,lang&expansions=author_id`;
      const url2 = `${endpoint}&query=${query}`;
      try {
        const r = await fetch(url2, { headers: { "Authorization": `Bearer ${env.TWITTER_BEARER}` } });
        if (!r.ok) return json([]);
        const d = await r.json();
        const out = (d.data||[]).map(t=>({ text: t.text, created_at: t.created_at, source: "twitter" }));
        return json(out);
      } catch { return json([]); }
    }

    if (request.method === "POST" && path.endsWith("/threads/search")) {
      if (!env.THREADS_COOKIE) return json([]);
      const body = await request.json().catch(()=>({}));
      const handles = Array.isArray(body.handles)?body.handles:[];
      return json([]);
    }

    if (request.method === "POST" && path.endsWith("/chat")) {
      try {
        if (!env.OPENAI_API_KEY) return json({ answer: "Chat disabled (server key missing)." });
        const body = await request.json().catch(()=>({}));
        const question = String(body.question||"").slice(0, 2000);
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are 'Pulse', an assistant for mobile FPS community analytics. Be concise and helpful." },
              { role: "user", content: question }
            ]
          })
        });
        if (!resp.ok) return json({ answer: "OpenAI error." });
        const data = await resp.json();
        const answer = data.choices?.[0]?.message?.content || "No answer.";
        return json({ answer });
      } catch (e) {
        return json({ answer: "Error contacting chat service." });
      }
    }

    return new Response("OK", { status: 200, headers: cors() });

    function json(obj, status=200) { return new Response(JSON.stringify(obj), { status, headers: { ...cors(), "Content-Type":"application/json" } }); }
    function cors(){ return { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Methods":"POST,OPTIONS", "Access-Control-Allow-Headers":"Content-Type" }; }
    function pluckReddit(data){
      const out=[];
      for (const c of (data?.data?.children || [])) {
        const p=c.data; if (p.stickied||p.over_18) continue;
        out.push({ title:p.title||"", text:p.selftext||"", url:p.url||`https://www.reddit.com${p.permalink}`, created_at:new Date((p.created_utc||0)*1000).toISOString(), source:"reddit", domain:p.domain||"reddit.com" });
      }
      return out;
    }
  }
}
