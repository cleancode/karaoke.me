//
//  KaraokeMeAppViewController.m
//  KaraokeMeApp
//
//  Created by Giordano Scalzo on 5/21/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import "KaraokeMeAppViewController.h"
#import "KaraokeMeViewController.h"
#import "MBProgressHUD.h"

@implementation KaraokeMeAppViewController

@synthesize searchView;

- (void)dealloc{
    [searchView release];
    [super dealloc];
}

- (IBAction)search:(id)sender{
    KaraokeMeViewController *viewController = [[[KaraokeMeViewController alloc]init]autorelease];
    NSLog(@"%@", self.searchView.text);

	[self.navigationController pushViewController:viewController animated:YES];
}

- (void)didReceiveMemoryWarning{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle


// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.searchView becomeFirstResponder];
}

- (void)viewDidUnload
{
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
