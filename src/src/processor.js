import fs from 'fs'
import path from 'path'

export default function(repo, resPath, report, prj) {
  for(let key in repo) {
    if(!repo.hasOwnProperty(key)) {
        continue;
    }

    const templateFilePath = key;
    const staticUrls = repo[templateFilePath];

    for(let idx in staticUrls) {
      const staticUrl = staticUrls[idx];
      const staticFilePath = staticUrl.replace('/static', resPath[prj]);

      try {
        fs.accessSync(staticFilePath);

        for(let key in resPath) {
          if(!resPath.hasOwnProperty(key) || key == prj) {
            continue;
          }
          
          const staticFilePathOfAnotherPrj = staticUrl.replace('/static', resPath[key]);
          try {
            fs.accessSync(staticFilePathOfAnotherPrj);
            if(!report.duplicatedUrls) {
              report.duplicatedUrls = [];
            } 
            if(0 > report.duplicatedUrls.indexOf(staticUrl)) {
              report.duplicatedUrls.push(staticUrl);
            }
          } catch(err) {
            
          }
        }
      } catch(err) {
        if(!report.wrongUrls) {
          report.wrongUrls = [];
        } 
        if(0 > report.wrongUrls.indexOf(staticUrl)) {
          report.wrongUrls.push(staticUrl);
        }
      }
    }

    // https://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach
    // const promises = staticUrls.map((staticUrl) => {
      // const staticFilePath = staticUrl.replace('/static', param.resPath.app);
      // return new Promise(resolve => {
        // fs.access(staticFilePath, (err) => {
          // if(err) {
            // wrongUrls.push(staticFilePath);
          // }
          // resolve();
        // }); 
      // });
    // });

    // console.log('-----------------------------');
    // Promise.all(promises)
    // .then(param => {
      // console.log('>> param : ', param);
      // resolve(wrongUrls);
    // });
  }
}