import fs from 'fs'
import path from 'path'

export default function(param) {
  return new Promise((resolve, reject) => {
    const wrongUrls = [];

    for(let key in param.repo) {
      if(!param.repo.hasOwnProperty(key)) {
          continue;
      }

      const templateFilePath = key;
      const staticUrls = param.repo[templateFilePath];
      
      staticUrls.forEach((staticUrl) => {
        console.log(staticUrl);
        const staticFilePath = staticUrl.replace('/static', param.resPath.app);
        
        fs.exists(staticFilePath, (exists) => {
          if(!exists) {
            wrongUrls.push(staticFilePath);
          }
        });
      });
    }

    resolve(wrongUrls);
  });
}