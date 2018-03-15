import preProcess from './pre_processor'
import process from './processor'
import { spawn } from 'child_process'

const RESOURCE_PATH = {
  app: '/develop/src/sample_workspace/app/resources/app',
  shared:'/develop/src/sample_workspace/shared/resources/shared'
}

const TEMPLATE_PATH = {
  app: '/develop/src/sample_workspace/app/templates',
  shared: '/develop/src/sample_workspace/shared/templates',
}

const grep = spawn('grep',['-Pro', "[\"|\'](/static/.+?)[\"|\']", TEMPLATE_PATH.app]);

let resGrep = '';
const report = {};

grep.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  resGrep += data;
});

grep.stdout.on('close', (code) => {
  console.log(`grep process exited with code ${code}`);
  const repo = preProcess(resGrep)
  process(repo, RESOURCE_PATH, report, 'app');
  console.log('>>> ', report);

});

grep.stdout.on('error', (err) => {
  console.log(`Error ${err}`);
});