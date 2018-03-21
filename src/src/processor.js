import fs from 'fs'
import path from 'path'

const WRONG_URL = 'wrongUrls';
const DUPLICATED_URLS = 'duplicatedUrls';
const PROCESSED_URLS = 'processedUrls';

export default function(repo, currPrj, cmdArgs, report) {
  for(let key in repo) {
    if(!repo.hasOwnProperty(key)) {
        continue;
    }

    const templateFilePath = key;
    const staticUrls = repo[templateFilePath];

    const re = new RegExp(`\/${cmdArgs.static_url}\/([^\/]*)\/([^\/]*)\/(.*)$`);
    const reTest = `\/${cmdArgs.replaced_static_url}\/([^\/]*)\/([^\/]*)\/([^\/]*)\/(.*)$`;
    const reAlreadyReplaced = new RegExp(reTest);
    
    staticUrls.forEach(staticUrl => {
      // staticUrl = '/static/prism_fe/shared/common/css/common.css';
      const regRes = re.exec(staticUrl);
      /* 
        When staticUrl is /op_media/shared/common/css/common.css, 
        regRes[0] = /op_media/shared/common/css/common.css
        regRes[1] = shared
        regRes[2] = common
        regRes[3] = css/common.css
        regRes[4] = index: 1,
        regRes[5] = input: '/op_media/shared/common/css/common.css'
      */
      // console.log(' ---> ', regRes);
      
      // In this case, I'm gonna categorize this static url as the wrong url.
      // These urls are like /op_media/ or /op_media/something, then I must check what this static url be used to.
      let regResAlreadyReplaced; 
      let prjNameInUrl;
      let alreadyReplacedStaticUrlWithoutPrefix;
      
      console.log(`--- > ${currPrj} : ${staticUrl} : ${regRes}`);
      if(!regRes) {
        // If current project is spectrum_fe and static urls was already replaced, It must be checked duplicated with what project is.'
        if(currPrj === cmdArgs.projects[1]) {
          console.log(' --- > ', staticUrl);
          regResAlreadyReplaced = reAlreadyReplaced.exec(staticUrl);
          if(!regResAlreadyReplaced) {
            _addItem(report, WRONG_URL, templateFilePath, staticUrl);
            return;
          } else {
            prjNameInUrl = regResAlreadyReplaced[1];

            if(cmdArgs.projects.includes(prjNameInUrl)) {
              return;
            }

            const entity = regResAlreadyReplaced[2];
            const i18n = regResAlreadyReplaced[3];
            const path = regResAlreadyReplaced[4];

            const resourceFilePath = `${cmdArgs.prj_root_path}/${cmdArgs.projects[0]}/resources/${cmdArgs.projects[0]}/${entity}/${i18n}/${path}`;
              
            try {
              fs.accessSync(resourceFilePath);
              _addItem(report, DUPLICATED_URLS, templateFilePath, staticUrl);
            } catch(err) {
              
            }
            return;
          }
        } else {
          regResAlreadyReplaced = reAlreadyReplaced.exec(staticUrl);
          if(!regResAlreadyReplaced) {
            _addItem(report, WRONG_URL, templateFilePath, staticUrl);
          } 
          return;
        }
      }

      const entity = regRes[1];
      const i18n = regRes[2];
      const path = regRes[3];
      
      let success = false;
      cmdArgs.projects.some(prj => {
        if(_perform(templateFilePath, staticUrl, report, cmdArgs, prj, entity, i18n, path)) {
          success = true;
          return true;
        } else if(_perform(templateFilePath, staticUrl, report, cmdArgs, prj, 'cdnetworks', 'common', path)) {
          success = true;
          return true; 
        } else if(_perform(templateFilePath, staticUrl, report, cmdArgs, prj, 'shared', 'common', path)) {
          success = true;
          return true;
        } else if(_perform(templateFilePath, staticUrl, report, cmdArgs, prj, 'cdnetworks_standalone', 'common', path)) {
          success = true;
          return true;
        } else {
          return false;
        }
      });

      if(!success) {
        _addItem(report, WRONG_URL, templateFilePath, staticUrl);
      }
    });
  }
}

function _perform(templateFilePath, staticUrl, report, cmdArgs, prj, entity, i18n, path) {
  const resourceFilePath = `${cmdArgs.prj_root_path}/${prj}/resources/${prj}/${entity}/${i18n}/${path}`;

  try {
    fs.accessSync(resourceFilePath);

    const replacedStaticUrl = `/${cmdArgs.replaced_static_url}/${prj}/${entity}/${i18n}/${path}`;

    try {
      const contents = fs.readFileSync(templateFilePath, 'utf-8');
      // const modifiedContents = contents.replace(new RegExp(/`${staticUrl}`/g), replacedStaticUrl);
      const modifiedContents = contents.replace(new RegExp(staticUrl, 'g'), replacedStaticUrl);

      fs.writeFileSync(templateFilePath, modifiedContents);

      _addItem(report, PROCESSED_URLS, templateFilePath, `${staticUrl} -> ${replacedStaticUrl}`);
    } catch(err) {            
      console.log(' --- ERROR HANDLER : ', err);
      process.exit(-1);
    }
    return true;
  } catch(err) {
    return false;
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