import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(userId: string) {
    try {
      let data;
      if(userId) {
        data = await this.userRepository.find({userId: userId})
        return {code: 0, data}
      }
      data = await this.userRepository.find()
      return {code: 0, data}
    } catch(e) {
      return { code: 1 ,data: e}
    }
  }

  async addUser(user: User) {
    try {
      let isHave = await this.userRepository.find({username: user.username})
      if(isHave.length) {
        return {code: 0, data: isHave }
      }
      const data = await this.userRepository.save(user)
      return {code: 0, data }
    } catch(e) {
      return {code: 1, data: e}
    }

  }

  async updateUser(userId: string, user: User) {
    try {
      const oldUser = await this.userRepository.findOne({userId: userId})
      console.log(userId)
      if(user.password === oldUser.password) {
        const data = await this.userRepository.update(oldUser,user)
        return {code: 0,data}
      } 
      return {code: 1, data: '密码错误'}
    } catch(e) {
      return {code: 1, data: e}
    }
  }

  async delUser(userId: string) {
    try {
      const data =  await this.userRepository.delete({userId: userId})
      return {code: 0,data}
    } catch(e) {
      return {code: 1, data: e}
    }
  }

  async login(user: {username: string, password: string}) {
    try {
      const users = await this.userRepository.find({username:user.username, password: user.password})
      if(!users.length) {
        return {code: 1 , data: []}
      }
      return {code: 0, data: '登录成功'}
    }catch(e) {
      return {code: 1, data: e}
    }
  }

}
