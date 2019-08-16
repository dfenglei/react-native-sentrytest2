//
//  RNBridgeManager.m
//  Awesome
//
//  Created by Chunyan Xu on 2019/7/11.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNBridgeManager.h"
@implementation RNBridgeManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(ToolModule);
//  对外提供调用方法,Callback
RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock)callback)
{
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
  callback(@[[NSNull null],version]);
}

@end
