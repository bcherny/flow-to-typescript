import "jest"
import {WatchPlugin, JestHookSubscriber} from "jest-watcher"

module.exports = class RuleWatchPlugin implements WatchPlugin {
  
  apply(jestHooks: JestHookSubscriber) {
    jestHooks.shouldRunTestSuite(async ({testPath}) => {
      return !testPath.includes('test/rules') && testPath.endsWith("test.js")
    });
    
    jestHooks.onFileChange(({projects}) => {
      console.log("File changed: ", projects)
    })
  }
}
