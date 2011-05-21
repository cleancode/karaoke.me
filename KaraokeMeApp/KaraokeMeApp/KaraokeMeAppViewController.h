//
//  KaraokeMeAppViewController.h
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import <UIKit/UIKit.h>

@class MBProgressHUD;
@interface KaraokeMeAppViewController : UIViewController {
    IBOutlet UITextField *searchView;
    MBProgressHUD *HUD;
}

@property(nonatomic, retain)UITextField *searchView;
- (IBAction)search:(id)sender;
@end
