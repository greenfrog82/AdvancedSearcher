import fs from 'fs'
import path from 'path'

export default function(repo, resourcesPath) {
  return new Promise((resolve, reject) => {
    for(let key in repo) {
      if(!repo.hasOwnProperty(key)) {
          continue;
      }

      resolve();
    }
  });
}