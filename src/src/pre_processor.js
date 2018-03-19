export default function (resGrep, ignoreUrls) {
  const repo = {};
  const items = resGrep.split('\n');

  for(let idx in items) {
    const item = items[idx];
    if(!item || item.includes('Binary file')) {
      continue;
    }

    const info = item.split(':');
    
    const staticFilePath = info[0];
    const staticUrl = info[1].substring(1, info[1].length - 1);
    
    let isContinue = true;
    if(ignoreUrls) {
      for(let ignoreUrlsIdx in ignoreUrls) {
        if(staticUrl.includes(ignoreUrls[ignoreUrlsIdx])) {
          isContinue = false;
          break;
        }
      }
    }

    if(!isContinue) {
      continue;
    }

    let staticUrls = repo[staticFilePath];

    if(!staticUrls) {
      staticUrls = repo[staticFilePath] = [];
    }
    
    staticUrls.push(staticUrl);
  }

  return repo; 
}