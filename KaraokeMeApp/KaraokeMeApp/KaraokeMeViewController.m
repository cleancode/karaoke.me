//
//  KaraokeMeViewController.m
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import "KaraokeMeViewController.h"
#import "JSonDownloader.h"
#import "EGOImageView.h"
#import "EGOImageButton.h"
#import "AudioStreamer.h"
#import "MBProgressHUD.h"
#import "NSArray-Blocks.h"


@implementation KaraokeMeViewController
@synthesize coverView,lyricsView, songData;

-(void)enableNetworkActivity{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    HUD = [[MBProgressHUD alloc] initWithWindow:window];
    [window addSubview:HUD];
    HUD.labelText = @"Loading...";
    [HUD show:YES];
}

-(void)disableNetworkActivity{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    [HUD hide:YES];
    [HUD removeFromSuperview];
    [HUD release];
    HUD = nil;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        timerArray = [[NSMutableArray array] retain];
    }
    return self;
}

-(void)killTimer:(NSTimer*)timer {
    if (timerArray != nil) {
        [timerArray removeObject:timer];
        [timer invalidate];
    }
}

// A method to kill all existing timers:
-(void)killAllTimers {
    NSMutableArray *theTimers = timerArray;
    timerArray = nil;
    [theTimers makeObjectsPerformSelector:@selector(invalidate)];
    [theTimers removeAllObjects];
    timerArray = theTimers;
}

- (void)dealloc{
    [self killAllTimers];
    [timerArray release];
    
    [coverView release];
    [lyricsView release];
    [songData release];
    [super dealloc];
}
// A method to save a timer
-(void)storeTimer:(NSTimer*)timer {
    if (timerArray != nil) {
        [timerArray addObject:timer];
    } else {
        NSLog(@"I hope you never see this message!");
    }
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    
    [[JSonDownloader alloc]initWithDomain:SERVERDOMAIN url:@"/song" delegate:self];
}

-(void)start{
    [self enableNetworkActivity];
    [streamer start];
    
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(playbackStateChanged:)
     name:ASStatusChangedNotification
     object:streamer];
}

- (void)showWord:(NSTimer *)timer {
    

    NSDictionary *userInfo = [timer userInfo];
    NSString *word = [userInfo objectForKey:@"word"];
    
    NSArray *lyrics = [self.songData objectForKey:@"lyrics"];
    NSNumber *lineCounter = [userInfo objectForKey:@"lineCounter"];
    NSNumber *wordCounter = [userInfo objectForKey:@"wordCounter"];

    NSArray *linePairs = [lyrics objectAtIndex:[lineCounter intValue]];
    NSArray *wordsOfLine = [linePairs map:^(id pair){
        return [pair objectForKey:@"word"]; 
    }];
    
    NSString *line = [wordsOfLine componentsJoinedByString:@" "];
    
                     
    lyricsView.text = line;
    
    [self killTimer:timer];
    [userInfo release];
}


-(void)startWordsTiming{
    NSDictionary *lyrics = [self.songData objectForKey:@"lyrics"];
    
    int lineCounter = 0;
    for (NSArray *line in lyrics) {
        int wordCounter = 0;
        for (NSDictionary *pair in line) {
            NSString *word = [pair objectForKey:@"word"];
            NSNumber *timing = [pair objectForKey:@"timing"];
 
            NSLog(@"%@", word);
            NSLog(@"%@", timing);
            
            NSMutableDictionary *userInfo = [[NSMutableDictionary alloc]init];
            [userInfo setObject:word forKey:@"word"];
            [userInfo setObject:[NSNumber numberWithInt:wordCounter] forKey:@"wordCounter"];
            [userInfo setObject:[NSNumber numberWithInt:lineCounter] forKey:@"lineCounter"];
            
            [self storeTimer:
            [NSTimer scheduledTimerWithTimeInterval:[timing floatValue]/1000
                                             target:self
                                           selector:@selector(showWord:)
                                           userInfo:userInfo
                                            repeats:NO]];
            
            ++wordCounter;
        }
        ++lineCounter;
    }
    
}

-(void)stopWordsTiming{
    [self killAllTimers];
    
}

- (void)playbackStateChanged:(NSNotification *)aNotification{
    if ([streamer isPlaying]){
        [self disableNetworkActivity];
        [self startWordsTiming];
	} else if ([streamer isIdle]) {
        [self stopWordsTiming];
        [self disableNetworkActivity];
    }
}

-(void)stop{
    [self enableNetworkActivity];

    [self killAllTimers];
    [streamer stop];
}

-(void)buttonPressed:(id)sender{
    if ([streamer isPlaying]) {
        [self stop];
    } else {
        [self start];
    }
}

- (void) showCoverFrom: (id) data  {
    EGOImageButton *coverButton = [[[EGOImageButton alloc] 
                                  initWithPlaceholderImage:[UIImage imageNamed:@"placeholder.png"]]autorelease];
    [coverButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
    
    coverButton.frame = self.coverView.frame;
    NSString *coverUrl = [data objectForKey:@"cover"];      
    NSString *coverFullUrl = [NSString stringWithFormat:@"%@%@",SERVERDOMAIN, coverUrl];
    coverButton.imageURL = [NSURL URLWithString:coverFullUrl];
    
    [self.view addSubview:coverButton];    
}

- (void)destroyStreamer
{
	if (streamer)
	{
		[streamer stop];
		[streamer release];
		streamer = nil;
	}
}

- (void)createStreamer:(NSString *)songName{
	if (streamer){
		return;
	}
    
	[self destroyStreamer];
	
	NSString *escapedValue =
    [(NSString *)CFURLCreateStringByAddingPercentEscapes(
                                                         nil,
                                                         (CFStringRef)songName,
                                                         NULL,
                                                         NULL,
                                                         kCFStringEncodingUTF8)
     autorelease];
    
	NSURL *url = [NSURL URLWithString:escapedValue];
	streamer = [[AudioStreamer alloc] initWithURL:url];
}

- (void) createStreamerWithSongFrom: (id) data  {
    NSString *songUrl = [data objectForKey:@"audio"];  
    NSString *songFullUrl = [NSString stringWithFormat:@"%@%@",SERVERDOMAIN, songUrl];
    [self createStreamer:songFullUrl];
}

-(void) received:(id)data from:(id)sender{
    NSLog(@"%@", data);
    self.songData = data;
    [self showCoverFrom: data];
    
    [self createStreamerWithSongFrom: data];
    [sender release];
}


- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [self stop];
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

@end
