import * as bcrypt from 'bcrypt';

export class BcryptHelper {
    private static saltRounds = 10;

    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    static async comparePassword(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}
