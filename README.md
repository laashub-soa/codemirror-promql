CodeMirror-mode-promql
======================
[![CircleCI](https://circleci.com/gh/prometheus-community/codemirror-promql.svg?style=shield)](https://circleci.com/gh/prometheus-community/codemirror-mode-promql) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Overview
This project provides a mode for [CodeMirror](https://codemirror.net/) that handles the PromQL ([Prometheus](https://prometheus.io/docs/introduction/overview/) Query Language) syntax.

Initially the repository was in a private repository and it has been transferred to the prometheus-community (Thanks to [Julius Volz](https://github.com/juliusv) that helped us for that)
During the transfer, the repository and the package changed its name from **codemirror-mode-promql** to the current one: **codemirror-promql**.

### Status
This mode is **not** production ready. If you want to use it, you may encounter some parsing issue.

For the moment, the mode only proposes an offline mode with a light PromQL grammar inside. That means it is actually parsing what you are writing and will highlight some syntax error when it is possible. 
In future release, an online mode will be developed using the different feature provides by the [promQL-langserver](https://github.com/prometheus-community/promql-langserver)  

### Installation
Language support is available on npm :

| Version             | command to use                        |
| ------------------- | ------------------------------------- |
| >= 0.3.0            | `npm install codemirror-promql`       |
| >= 0.2.2 < 0.3.0    | `npm install codemirror-mode-promql`  |

### Playground
If you want to test it, you have the last version available on the following website: 

https://prometheus-community.github.io/codemirror-promql/

Here is a picture that displays what happen when you write a promQL expression:

![sample](https://user-images.githubusercontent.com/4548045/76161611-478ff880-6135-11ea-8b73-a35be5f650a7.PNG)
> Samples coming from https://github.com/infinityworks/prometheus-example-queries

### RoadMap
Note: the following task are sorted by priority. So the last one has the less priority.

- [x] Developed an offline mode using a light promQL grammar
- [ ] Build a better development environment
  - [x] Create a test folder in the src folder that will contain a light app that will start the codeMirror
  - [ ] Automatized test to checked that all correct promQL syntax are covered
- [ ] Implement the Online mode
- [ ] Offline mode improvement
  - [ ] Improve the error returns when a wrong promQL syntax is entered
  - [ ] Use directly the parser generated by the grammar to be able to add the check done in the [promQL parser](https://github.com/prometheus/prometheus/blob/fac7a4a0504404fa5d4c5abb8fcc9750bd5cbda7/promql/parser/parse.go#L510-L515)

## Usage
* [How to use it in an angular project](./examples/angular-promql/README.md)

## Contributions
Any contribution or suggestion would be really appreciated. Feel free to use the Issue section or to send a pull request.

## Development
In case you want to contribute and change the code by yourself, do the following command:
 * `npm install` to install all dependencies
 * `npm start` to start the web server. It should create a tab in your browser with the dev app that contains codeMirror with the promQL plugin.

### Deploy to Github Page
* `npm install -g angular-cli-ghpages`
* go on examples/angular-promql
* `ng build --prod --base-href "https://prometheus-community.github.io/codemirror-promql/"`
* `ngh -d dist/angular-promql`

## License
[MIT](./LICENSE)