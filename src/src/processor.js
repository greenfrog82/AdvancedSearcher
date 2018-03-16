import fs from 'fs'
import path from 'path'

const WORNG_URLS = 'wrongUrls';
const DUPLICATED_URLS = 'duplicatedUrls';

export default function(repo, resPath, report, prj, staticUrlKeyword) {
  for(let key in repo) {
    if(!repo.hasOwnProperty(key)) {
        continue;
    }

    const templateFilePath = key;
    const staticUrls = repo[templateFilePath];

    for(let idx in staticUrls) {
      const staticUrl = staticUrls[idx];
      const staticFilePath = staticUrl.replace(`/${staticUrlKeyword}`, resPath[prj]);
      
      // console.log('---- > ', staticFilePath);

      try {
        fs.accessSync(staticFilePath);

        if(fs.lstatSync(staticFilePath).isDirectory()) {
          throw `${staticFilePath} is not file. In this case, this static url is wrong`;
        } 

        for(let key in resPath) {
          if(!resPath.hasOwnProperty(key) || key == prj) {
            continue;
          }

          const staticFilePathOfAnotherPrj = staticUrl.replace(`/${staticUrlKeyword}/${prj}`, `${resPath[key]}/${key}`);
          try {
            // In this case, this static url is duplicated.
            fs.accessSync(staticFilePathOfAnotherPrj);
            _addItem(report, DUPLICATED_URLS, staticUrl);
          } catch(err) {            
          
          }
        }
      } catch(err) {
        // console.log(err);
        // In this case, this static url is wrong.
        _addItem(report, WORNG_URLS, staticUrl);
      }
    }
  }
}

function _addItem(report, attribute, staticUrl) {
  if(!report[attribute]) {
    report[attribute] = [];
  }
  if(0 > report[attribute].indexOf(staticUrl)) {
    report[attribute].push(staticUrl);
  }
}