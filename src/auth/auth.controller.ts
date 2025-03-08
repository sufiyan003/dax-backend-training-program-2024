import { Controller, Post, Body,Query,Get,UseGuards, Put,Delete,Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiQuery,ApiOperation,ApiParam,ApiBearerAuth } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';
import { IsCustomer ,Public,IsAdmin} from 'src/decorators/is-roles.decorator';
import{UpdateprofileDto} from './dto/updateprofile.dto'

@ApiTags('Authentication')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify-email')
  @ApiQuery({ name: 'token', example: 'JWT_TOKEN_HERE' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('signup')
  @ApiBody({ schema: { example: { name: 'John Doe', email: 'shaheer.99.ahmed@gmail.com', password: '123456' } } })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('forgot-password')
  @ApiBody({ schema: { example: { email: 'shaheer.99.ahmed@gmail.com'} } })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  @ApiBody({ schema: { example: { newPassword: '123456'} } })
  resetPassword(@Query('token') token: string,@Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }


  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ schema: { example: { email: 'shaheer.99.ahmed@gmail.com', password: '123456' } } })
  signin(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email, body.password);
  }
 
  @Put('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @IsCustomer()
  @ApiOperation({ summary: 'customer can change the password ' })
  @ApiBody({ schema: { example: { email: 'shaheer.99.ahmed@gmail.com',oldPassword: '123456',newPassword: '123456789'} } })
  changePassword(@Body() body:{email:string; oldPassword:string; newPassword: string} ) {
    return this.authService.changePassword(body.email, body.oldPassword, body.newPassword);
  }

  @Put('update-profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @IsCustomer()
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ schema: { example: { name: 'John Doe', email: 'shaheer.99.ahmed@gmail.com',address : "abc,karachi,pakistan",phoneNo:"+92******"} } })
  updateProfile(@Param('id') id: string, @Body() updateprofileDto: UpdateprofileDto ) {
    return this.authService.updateProfile(id,updateprofileDto);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @IsCustomer()
  @ApiOperation({ summary: 'Soft or hard delete a product' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'hardDelete', required: false, type: Boolean, example: false })
  delete(@Param('id') id: string, @Query('hardDelete') hardDelete: boolean = false) {
    return this.authService.delete(id, hardDelete);
  }


  @Post('logout')
  @UseGuards(AuthGuard) 
  @ApiOperation({ summary: 'Logout ' })
  logout() {
    // On the server-side, there's nothing to do for JWT-based logout.
    // The server simply responds and the client will handle token removal.
    return { message: 'Successfully logged out' };
  }

}
