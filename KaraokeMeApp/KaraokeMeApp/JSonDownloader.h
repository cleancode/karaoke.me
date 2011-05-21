//
//  JSonDownloader.h
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import <Foundation/Foundation.h>

@class MBProgressHUD;
@interface JSonDownloader : NSObject {
    id delegate;
    MBProgressHUD *HUD;
}

@property(nonatomic, retain)NSMutableData *responseData;

-(id)initWithDomain:(NSString *)domain url:(NSString *)url_ delegate:(id)delegate_;

@end
