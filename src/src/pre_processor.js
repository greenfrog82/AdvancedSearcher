export default function (resGrep) {
  const repo = {};
  const items = resGrep.split('\n');

  for(let idx in items) {
    const item = items[idx];
    if(!item) {
      continue;
    }

    const info = item.split(':');
    
    const staticFilePath = info[0];
    const staticUrl = info[1].substring(1, info[1].length - 1);

    let staticUrls = repo[staticFilePath];

    if(!staticUrls) {
      staticUrls = repo[staticFilePath] = [];
    }
    
    staticUrls.push(staticUrl);
  }

  return repo; 
}