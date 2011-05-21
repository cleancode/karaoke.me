//
//  NSArray-Blocks.h
//  LettersInvasion
//
//  Created by Giordano Scalzo on 4/14/11.
//  Copyright 2011 Cleancode. All rights reserved.
//

#import <Foundation/Foundation.h>

static NSComparisonResult sortUsingBlock(id arg1, id arg2, NSComparisonResult (^block)(id, id));

@interface NSArray (Blocks)

- (BOOL) all:(BOOL (^)(id))block;
- (BOOL) every:(BOOL (^)(id))block; /// @ref self::all()
- (BOOL) any:(BOOL (^)(id))block;
- (BOOL) some:(BOOL (^)(id))block; /// @ref self::any()

- (void) each:(void (^)(id))block;

- (NSArray *) sort:(NSInteger (^)(id, id))block;
- (id) find:(BOOL (^)(id))block;
- (id) detect:(BOOL (^)(id))block; /// @ref self::find()
- (NSArray *) select:(BOOL (^)(id))block;
- (NSArray *) findAll:(BOOL (^)(id))block; /// @ref self::select()
- (NSArray *) filter:(BOOL (^)(id))block; /// @ref self::select()
- (NSArray *) reject:(BOOL (^)(id))block;
- (NSArray *) partition:(BOOL (^)(id))block;
- (NSArray *) map:(id (^)(id))block;
- (NSArray *) collect:(id (^)(id))block; /// @ref self::map()

@end