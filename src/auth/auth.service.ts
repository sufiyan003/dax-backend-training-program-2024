import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { SignupDto } from './dto/signup.dto';
import{UpdateprofileDto} from './dto/updateprofile.dto'
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  private privateKey: string;
  private publicKey: string;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    this.privateKey = fs.readFileSync(path.resolve('keys/private.pem'), 'utf8');
    this.publicKey = fs.readFileSync(path.resolve('keys/public.pem'), 'utf8');
  }

  async signup(signupDto: SignupDto) {
    try {
      const { email, name, password } = signupDto;
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) throw new ConflictException('Email already in use');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({ name, email, password: hashedPassword,isVerified: false });
  
      // Generate email verification token
      const token = this.jwtService.sign(
        {email: user.email},
        {privateKey:this.privateKey}
      ); 
      const emailSent = await this.emailService.sendEmail(
        email,
        'Verify Your Email',
        `<a href="http://localhost:3000/auth/verify-email?token=${token}">Click here to verify</a>`,
      );
      if(emailSent){
        const createdUser =  await this.userRepository.save(user);
        return { message: 'Signup successful. Check your email for verification.' };
      }  
      return { message: 'Error occur while signup' };
    } catch (error) {
        throw error
    }
  }

  async verifyEmail(token: string) {    
    const cert = this.publicKey;
    if (!cert) throw new Error('Token generation failure');
    try {
      const { email } = this.jwtService.verify(token,{
        publicKey:cert
      });
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new Error('User not found');
      user.isVerified = true;
      await this.userRepository.save(user);
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw error  
    }    
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
  
    // Generate reset token
    const token = this.jwtService.sign(
      { email },
      {privateKey:this.privateKey}
    );
    // Send email with reset link
    await this.emailService.sendEmail(
      email,
      'Reset Password',
      `<a href="http://localhost:3000/auth/reset-password?token=${token}">Click here to reset password</a>`,
    );
    return { message: 'Reset password link sent to email' };
    } catch (error) {
      throw error
    }
  }
  
  async resetPassword(token: string, newPassword: string) {
    const cert = this.publicKey;
    if (!cert) throw new Error('Token generation failure');
    try {
      const { email } = await this.jwtService.verify(token,{
        publicKey:cert
    });
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password reset successful' };
    }catch(error){
      throw error;
    }
  }
  
  async changePassword(email:string , oldpassword:string, newPassword: string) {
    try{
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException('User not found');
      if (!(await bcrypt.compare(oldpassword, user.password))){
        throw new UnauthorizedException('old pasword is doesnot match');
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);
      return { message: 'Password change successful' };
    }
    catch(error){
      throw error;
    }
  }
  
  async updateProfile(id: string,updateprofileDto: UpdateprofileDto) {
    try{
      const { email, name,address,phoneNo } = updateprofileDto;
      const existingUser = await this.userRepository.findOne({ where: { id } });
      if (!existingUser) throw new NotFoundException('User not found');
      if(existingUser.email == email){
        throw new ConflictException('Email already in use');
      }
      Object.assign(existingUser, updateprofileDto);
      await this.userRepository.save(existingUser);
      return { message: 'User Profile updated' };
    }
    catch(error){
      throw error;
    }
  }

  async delete(id: string, hardDelete: boolean): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id }});
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (hardDelete == true) {
      await this.userRepository.delete(id);
      return { message: `User with ID ${id} has been permanently deleted.` };
    } else {
      await this.userRepository.softDelete(id);
      return { message: `User with ID ${id} has been soft deleted.` };
    }
  }


  async signin(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, isAdmin: user.isAdmin};
    return { accessToken: await this.jwtService.sign({payload},
      {privateKey:this.privateKey, expiresIn: '1h'}
      
    ) };
  }
}
