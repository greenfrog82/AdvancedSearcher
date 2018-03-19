import fs from 'fs'
import path from 'path'

const WORNG_URLS = 'wrongUrls';
const DUPLICATED_URLS = 'duplicatedUrls';
const PROCESSED_URLS = 'processedUrls';

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

        // if(fs.lstatSync(staticFilePath).isDirectory()) {
          // _addItem(report, WORNG_URLS, templateFilePath, staticUrl);
          // continue;
        // } 

        for(let key in resPath) {
          if(!resPath.hasOwnProperty(key) || key == prj) {
            continue;
          }

          const staticFilePathOfAnotherPrj = staticUrl.replace(`/${staticUrlKeyword}/${prj}`, `${resPath[key]}/${key}`);
          try {
            // In this case, this static url is duplicated.
            fs.accessSync(staticFilePathOfAnotherPrj);
            _addItem(report, DUPLICATED_URLS, templateFilePath, staticUrl);
          } catch(err) {            
          
          }
        }
      } catch(err) {
        for(let key in resPath) {
          if(!resPath.hasOwnProperty(key) || key == prj) {
            continue;
          }

          const staticFilePathOfAnotherPrj = staticUrl.replace(`/${staticUrlKeyword}/${prj}`, `${resPath[key]}/${key}`);
          try {
            // console.log('---> ', staticFilePathOfAnotherPrj);
            // In this case, We can change static url another one.
            fs.accessSync(staticFilePathOfAnotherPrj);
            
            const contents = fs.readFileSync(templateFilePath).toString();
            const anotherStaticUrl = staticUrl.replace(prj, key); 
            const modifiedContents = contents.replace(staticUrl, anotherStaticUrl);

            fs.writeFileSync(templateFilePath, modifiedContents);

            _addItem(report, PROCESSED_URLS, templateFilePath, `${staticUrl} -> ${anotherStaticUrl}`);
          } catch(err) {            
            // console.log('---> ERROR : ', err);
            
            for(let key in resPath) {
              if(!resPath.hasOwnProperty(key) || key == prj) {
                continue;
              }
              const staticFilePathOfAnotherPrj = staticUrl.replace(`/${staticUrlKeyword}/${key}`, `${resPath[key]}/${key}`);

              try {
                fs.accessSync(staticFilePathOfAnotherPrj);
              } catch(err) {
                _addItem(report, WORNG_URLS, templateFilePath, staticUrl);
              }
            }
          }
        }
      }
    }
  }
}

function _addItem(report, attribute, templateFilePath, staticUrl) {
  if(!report[attribute]) {
    report[attribute] = [];
  }
  if(0 > report[attribute].indexOf(staticUrl)) {
    report[attribute].push(`${templateFilePath} : ${staticUrl}`);
  }
}