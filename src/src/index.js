import fs from 'fs'
import { spawn } from 'child_process'

import _preProcess from './pre_processor'
import _process from './processor'

const cmdArgs = JSON.parse(fs.readFileSync(process.argv[2]));

const promises = [];
const searchReport = {};

for(let key in cmdArgs.projects) {
  promises.push(new Promise(resolve => {
    const grep = spawn('grep',['-Pro', `[\"|\'](/${cmdArgs.static_url}/.*?)[\"|\']`, cmdArgs.projects[key]]);
    

    const report = {};
    let resGrep = '';

    grep.stdout.on('data', (data) => {
      // console.log(`stdout: ${data}`);
      resGrep += data;
    });

    grep.stdout.on('close', (code) => {
      // console.log(`grep _process exited with code ${code}`);
      const repo = _preProcess(resGrep, cmdArgs.ignore_urls);
      _process(repo, cmdArgs.resources, report, key, cmdArgs.static_url);
      
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
  const report = JSON.stringify(searchReport, null, 2)
  console.log(report);

  fs.writeFileSync('./report.json', report);
  
})