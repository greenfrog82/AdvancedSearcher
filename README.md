# AdvancedSearcher

## Workflow

1. 찾고자 하는 static 파일이 해당 프로젝트 경로에 존재하면, 다른 참조 경로에 중복되는 파일이 존재하는지 확인.
2. 찾고자 하는 static 파일이 없는 경우, 다른 참조 경로에 해당 파일이 존재하는 확인.
3. 다른 참조 경로에 해당 파일이 존재한다면 해당 해당 파일로 경로 변경.

## Consideration

### How to deal with duplicated static file path

우선 찾고자 하는 스태틱 파일이 해당 프로젝트에 존재하는 경우 중복되는 스태틱 파일 경로에 대한 확인이 필요할까?
이 부분에 대해서는 중복 체크 필요 없음. 기본적으로 자신의 프로젝트에서 스태틱 파일을 찾고 있고, 해당 파일이 없는 경우 참조 프로젝트에서 스태틱 파일을 찾고 있음. 



## Lib

* [replace-in-file](https://www.npmjs.com/package/replace-in-file)
