/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StaticImage,FlatList,Image,TouchableOpacity,NativeModules,Platform, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {
  Sentry,
  SentrySeverity,
  SentryLog
} from 'react-native-sentry';
import codePush from "react-native-code-push";

/*
*/
// disable stack trace merging
Sentry.config("https://ccea557fa9d6417f90f1fe08a7ba212a@sentry.io/1524703", {
//Sentry.config("https://be9b2a419eef49d88d9329f99aefe533:f0d169a61cb74139b01b6ec89ab176a8@sentry.io/1523582", {
  deactivateStacktraceMerging: false, // default: true | Deactivates the stack trace merging feature
  logLevel: SentryLog.Debug, // default SentryLog.None | Possible values:  .None, .Error, .Debug, .Verbose
  disableNativeIntegration: false, // default: false | Deactivates the native integration and only uses raven-js
  handlePromiseRejection: true // default: true | Handle unhandled promise rejections
  // sampleRate: 0.5 // default: 1.0 | Only set this if you don't want to send every event so e.g.: 0.5 will send 50% of all events
  // These two options will only be considered if stack trace merging is active
  // Here you can add modules that should be ignored or exclude modules
  // that should no longer be ignored from stack trace merging
  // ignoreModulesExclude: ["I18nManager"], // default: [] | Exclude is always stronger than include
  // ignoreModulesInclude: ["RNSentry"], // default: [] | Include modules that should be ignored too
  // ---------------------------------
}).install();

//codePush.getUpdateMetadata().then((update) => {
codePush.checkForUpdate().then((update) => {
  console.log("label");
  if (update) {
    //Sentry.setVersion(update.appVersion + '-codepush:' + update.label);
    //Sentry.setRelease(update.appVersion +  update.label);
    Sentry.setVersion(update.appVersion);
    Sentry.setRelease(update.appVersion);

    console.log("version",update.appVersion);
    console.log("label:",update.label);
  }
});
// set a callback after an event was successfully sent
// its only guaranteed that this event contains `event_id` & `level`
Sentry.setEventSentSuccessfully((event) => {
  // can also be called outside this block but maybe null
   Sentry.lastEventId(); //-> returns the last event_id after the first successfully sent event
   Sentry.lastException(); //-> returns the last event after the first successfully sent event
});

Sentry.setShouldSendCallback((event) => {
  return true; // if return false, event will not be sent
});

// Sentry.lastException(); // Will return the last sent error event
// Sentry.lastEventId(); // Will return the last event id

// export an extra context
Sentry.setExtraContext({
  "a_thing": 3,
  "some_things": {"green": "red"},
  "foobar": ["a", "b", "c"],
  "react": true,
  "float": 2.43
});

// set the tag context
Sentry.setTagsContext({
  "environment": "production",
  "react": true
});

// set the user context
Sentry.setUserContext({
  email: "john@apple.com",
  userID: "12341",
  username: "username",
  extra: {
    "is_admin": false
  }
});

// set a custom message
Sentry.captureMessage("TEST message", {
  level: SentrySeverity.Warning
}); // Default SentrySeverity.Error

// capture an exception
Sentry.captureException(new Error('Oops!'), {
  logger: 'my.module'
});

// capture a breadcrumb
Sentry.captureBreadcrumb({
  message: 'Item added to shopping cart',
  category: 'action',
  data: {
     isbn: '978-1617290541',
     cartSize: '3'
  }
});

// This will trigger a crash in the native sentry client
//Sentry.nativeCrash();

let seconds = 0;

var iOSToolModule = NativeModules.ToolModule;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            version: '', 
            dataSource: '', 
            progress: 0, 
        }
        this.getVerSion();

    }

componentDidMount() {
	 //return fetch('https://facebook.github.io/react-native/movies.json')
// This will trigger a crash in the native sentry client
//Sentry.nativeCrash();
	codePush.sync({
                updateDialog: {
                    appendReleaseDescription:true,
                    descriptionPrefix:'更新内容:',
                    mandatoryContinueButtonLabel:'更新',
                    mandatoryUpdateMessage:'有新版本了，请您及时更新',
                    optionalInstallButtonLabel: '立即更新',
                    optionalIgnoreButtonLabel: '稍后',
                    optionalUpdateMessage:'有新版本了，是否更新？',
                    title: '提示'
                },
                installMode: codePush.InstallMode.IMMEDIATE
            });

	 return fetch('http://192.168.43.238:8089/getUser')
      .then((response) => response.json())
      .then((responseJson) => {
		
        //console.error(responseJson.name);

        this.setState({
          isLoading: false,
          dataSource: responseJson.name,
          //dataSource: responseJson.movies,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });

    }

    // 获取版本号
    getVerSion() {
    iOSToolModule.getAppVersion((error,event)=>{
                if(error){
                    console.log(error)
                }else{
                    alert(event)
                    this.setState({
                        version:event
                    })
                }
            }) 
    }
	 // 计时
    countDown() {
        this.timer = setInterval(() => {
            seconds += 0.1;
            console.log('seconds=',seconds);
            console.log('progress---',this.state.progress);
            if(seconds <= 15){
                this.setState({
                    progress: seconds / 15,
                });
            }
            if(seconds > 15){
                this.timer && clearInterval(this.timer);
            }
        },100);
    }
    // 获取http
    gethttp() {
		 return fetch('http://192.168.43.238:8089/getUser')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.movies,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });

    }
	//throw "test sentry";  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>{this.state.version}</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>{this.state.dataSource}</Text>
		<Progress.Circle
        style={{
            borderRadius: 42,
            width: 84,
            height: 84
        }}
        size={84} // 圆的直径
        progress={this.state.progress} // 进度
        unfilledColor="rgba(255,255,255,0.5)" // 剩余进度的颜色
        color={"#008aff"} // 颜色
        thickness={6} // 内圆厚度
        direction="clockwise" // 方向
        borderWidth={0} // 边框
        children={ // 子布局
            <View style={{
                position: 'absolute',
                top: 6,
                left: 6,
            }}>
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPressIn={() => {
                        console.log("onPressIn");
                        this.countDown();
                    }}
                    onPressOut={() => {
                        console.log("onPressOut");
                        this.timer && clearInterval(this.timer);
                    }}
                    onPress={() => {}}
                    onLongPress={() => console.log("onLongPress")}
                >
                    <Image
                        style={{width:72,height:72}}
						source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='}}
                    />
                </TouchableOpacity>
            </View>
        }
    >
    </Progress.Circle>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
