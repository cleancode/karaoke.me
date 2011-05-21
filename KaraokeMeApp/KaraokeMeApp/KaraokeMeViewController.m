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


@implementation KaraokeMeViewController
@synthesize coverView,lyricsView;


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)dealloc
{
    [coverView release];
    [lyricsView release];
    [super dealloc];
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
    [streamer start];
    
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(playbackStateChanged:)
     name:ASStatusChangedNotification
     object:streamer];
}

- (void)playbackStateChanged:(NSNotification *)aNotification{
    if ([streamer isPlaying]){
        NSLog(@"PLAYING");
	} else if ([streamer isIdle]) {
        NSLog(@"STOP");
    }
}

-(void)stop{
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
