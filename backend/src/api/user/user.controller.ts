import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

@Controller('/api/users')
export class userController {
	@Get()
	findAllUser() {
		
	}

	@Get(':id')
	findUser(@Param('id') userId : string) {

	}

	@Patch(':id')
	modifyUser(@Param('id') userId : string) {

	}

	@Get('/friend')
	findFriend(@Param('id') userId : string) {

	}

	@Post('/:id/friend/:friend-id')
	requestFriend(@Param('id') userId : string, 
				@Param('friend-id') friendId : string) {

	}

	@Patch('/:id/friend/:friend-id')
	acceptFriend(@Param('id') userId : string, 
				@Param('friend-id') friendId : string) {

	}

	@Delete('/:id/friend/:friend-id')
	deleteFriend(@Param('id') userId : string,
				@Param('frined-id') friendId : string) {

	}

	@Post('/:id/block/:block-id')
	userBlock(@Param('id') userId : string, 
			@Param('block-id') blockId : string) {

	}

	@Patch('/:id/block/:block-id')
	liftBlockUser(@Param('id') userId : string,
				@Param('block-id') blockId : string) {

	}

}