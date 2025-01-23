
import bcrypt from 'bcrypt';

export class HashService {
    private saltRounds: number = 10;

    // Hash the password
    async hashPassword(password: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            return hashedPassword;
        } catch (error) {
            throw new Error('Error hashing password');
        }
    }

    // Compare a password with a hash
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            throw new Error('Error comparing passwords');
        }
    }
}
