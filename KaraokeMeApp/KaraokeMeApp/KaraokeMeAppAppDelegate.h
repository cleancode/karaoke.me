//
//  KaraokeMeAppAppDelegate.h
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import <UIKit/UIKit.h>

@class KaraokeMeAppViewController;

@interface KaraokeMeAppAppDelegate : NSObject <UIApplicationDelegate> {

}

@property (nonatomic, retain) IBOutlet UIWindow *window;

@property (nonatomic, retain) IBOutlet KaraokeMeAppViewController *viewController;

@end
