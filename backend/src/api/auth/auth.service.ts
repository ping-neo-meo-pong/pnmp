import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/core/user/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) { }

	async validateUser(_username: string, pass: string): Promise<any> {
		return {
			username: _username,
			userId: 1,
		}
	}

	async login(user: any) {
		const payload = { userna: user.username };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
