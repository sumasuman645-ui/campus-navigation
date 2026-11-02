async function run() {
  try {
    const res = await fetch('https://campus-nav-smart.surge.sh');
    const html = await res.text();
    console.log('HTML size:', html.length);
    
    // Save existing HTML as reference
    const fs = require('fs');
    fs.writeFileSync('existing_index.html', html);
    console.log('Saved existing_index.html');

    const scriptMatches = [...html.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
    const linkMatches = [...html.matchAll(/<link[^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('Scripts:', scriptMatches);
    console.log('Links:', linkMatches);

    // Fetch styles.css and any js files
    for (const s of scriptMatches) {
      if (!s.startsWith('http')) {
        const jsRes = await fetch('https://campus-nav-smart.surge.sh/' + s);
        const jsText = await jsRes.text();
        fs.writeFileSync('existing_' + s.replace(/\//g, '_'), jsText);
        console.log('Saved script existing_' + s, jsText.length, 'bytes');
      }
    }

    for (const l of linkMatches) {
      if (!l.startsWith('http') && l.endsWith('.css')) {
        const cssRes = await fetch('https://campus-nav-smart.surge.sh/' + l);
        const cssText = await cssRes.text();
        fs.writeFileSync('existing_' + l.replace(/\//g, '_'), cssText);
        console.log('Saved style existing_' + l, cssText.length, 'bytes');
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
run();

