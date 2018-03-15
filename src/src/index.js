import preProcess from './pre_processor'
import process from './processor'
import { spawn } from 'child_process'

const resourcesPath = {
  app: '/develop/src/sample_workspace/app/resources/app',
  shared:'/develop/src/sample_workspace/shared/resources/shared'
}

const templatesPath = {
  app: '/develop/src/sample_workspace/app/templates',
  shared: '/develop/src/sample_workspace/shared/templates',
}

const promises = [];
const searchReport = {};

for(let key in templatesPath) {
  promises.push(new Promise(resolve => {
    const grep = spawn('grep',['-Pro', "[\"|\'](/static/.+?)[\"|\']", templatesPath[key]]);

    const report = {};
    let resGrep = '';

    grep.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      resGrep += data;
    });

    grep.stdout.on('close', (code) => {
      console.log(`grep process exited with code ${code}`);
      const repo = preProcess(resGrep)
      process(repo, resourcesPath, report, key);
      
      searchReport[key] = report;
      resolve(report);
    });

    grep.stdout.on('error', (err) => {
      console.log(`Error ${err}`);
    });
  }));
}

Promise.all(promises)
.then(param => {
  console.log(param);
  console.log(searchReport);
})