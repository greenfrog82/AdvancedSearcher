export default function (resGrep) {
  return new Promise((resolve, reject) => {
      const REPO = {};
      const ITEMS = resGrep.split('\n');

      for(let idx in ITEMS) {
        const ITEM = ITEMS[idx];
        if(!ITEM) {
          continue;
        }

        const INFO = ITEM.split(':');
        
        const STATIC_FILE_PATH = INFO[0];
        const STATIC_URL = INFO[1];    
        
        let staticUrls = REPO[STATIC_FILE_PATH];

        if(!staticUrls) {
          staticUrls = REPO[STATIC_FILE_PATH] = [];
        }
        
        staticUrls.push(STATIC_URL);
      }

      resolve(REPO)
    });
  }