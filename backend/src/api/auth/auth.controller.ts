import { Controller, Get, Post } from "@nestjs/common";

@Controller('api/auth')
export class authController {
	@Post('/user')
	userMake() {

	}

	@Post('/login')
	loginUser() {

	}

	@Post('/logout')
	logoutUser() {

	}

}