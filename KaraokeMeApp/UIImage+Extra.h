//
//  UIImage+Extra.h
//  ConfApp
//
//  Created by Giordano Scalzo on 5/5/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface UIImage (UIImage_Extra)
- (UIImage*)imageByScalingAndCroppingForSize:(CGSize)targetSize;
- (UIImage*)imageByScalingForSize:(CGSize)targetSize;

@end
