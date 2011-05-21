//
//  KaraokeMeViewController.h
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface KaraokeMeViewController : UIViewController {
    IBOutlet UIImageView *coverView;
    IBOutlet UILabel *lyricsView;
    
}

@property(nonatomic,retain)UIImageView *coverView;
@property(nonatomic,retain)UILabel *lyricsView;

-(void) received:(id)data from:(id)sender; 


@end
