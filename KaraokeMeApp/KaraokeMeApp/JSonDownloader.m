//
//  JSonDownloader.m
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import "JSonDownloader.h"
#import "MBProgressHUD.h"
#import "JSON.h"


@implementation JSonDownloader
@synthesize responseData=responseData_;

-(void)enableNetworkActivity{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    HUD = [[MBProgressHUD alloc] initWithWindow:window];
    [window addSubview:HUD];
    HUD.labelText = @"Loading...";
    [HUD show:YES];
}

-(id)initWithDomain:(NSString *)domain url:(NSString *)url_ delegate:(id)delegate_{
    if (self == [super init]) {
        delegate = delegate_;

        [self enableNetworkActivity];
        NSURL *feedUrl = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@",
                                               domain,url_]];
        NSURLRequest *request = [NSURLRequest requestWithURL:feedUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:3];
        [[NSURLConnection alloc] initWithRequest:request delegate:self];

    }
    return self;
}

#pragma mark NSURLConnection Delegate Methods



-(void)disableNetworkActivity{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    [HUD hide:YES];
    [HUD removeFromSuperview];
    [HUD release];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    self.responseData = [NSMutableData dataWithLength:5000];
    [self.responseData setLength: 0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data 
{
	[self.responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
	[self disableNetworkActivity];
    
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSMutableData *data = [NSMutableData dataWithData:[prefs dataForKey:@"LASTDATA"]];
    self.responseData = data;
    	NSString *detailMessage = [[NSString alloc]
    							   initWithFormat:@"Connection failed: %@",
    							   [error description]];
    	
    	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Failure" message:detailMessage delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    	
    	[alert show];
    	[alert release];
    	[detailMessage release];
  
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
	[connection release];
	NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    [prefs setObject:self.responseData forKey:@"LASTDATA"];
    [prefs synchronize];
    
    NSString* aStr = [[NSString alloc] initWithData:self.responseData encoding:NSASCIIStringEncoding];
    [delegate received:[aStr JSONValue] from:self]; 

	[self disableNetworkActivity];
}


-(void)dealloc{
    [responseData_ release];
    [super dealloc];
}

@end
