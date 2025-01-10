import { readFileSync } from 'fs';
import { sign, verify } from 'jsonwebtoken';
import path from 'path';
// import { InternalError, BadTokenError, TokenExpiredError } from './ApiError';

/*
 * issuer 		— Software organization who issues the token.
 * subject 		— Intended user of the token.
 * audience 	— Basically identity of the intended recipient of the token.
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */

export class JwtService {
    private static readPublicKey(): string {
        return readFileSync(path.join(__dirname, '../../../keys/public-key.pem'), 'utf8')
    }

    private static readPrivateKey(): string {
        return readFileSync(path.join(__dirname, '../../../keys/private-key.pem'), 'utf8')
    }

    public static async encode(payload: JwtPayload): Promise<string> {
        const cert = this.readPrivateKey();
        if (!cert) throw new Error('Token generation failure');

        return sign(
            payload,
            cert,
            { algorithm: 'RS256' }
        );
    }

    /**
     * This method checks the token and returns the decoded data when token is valid in all respect
     */
    public static async validate(token: string): Promise<JwtPayload> {
        const cert = this.readPublicKey();
        if (!cert) throw new Error('Token generation failure');

        try {
            return verify(token, cert) as JwtPayload;
        } catch (e: any) {
            console.log({ e });

            // if (e && e.name === 'TokenExpiredError') throw new Error('Token Expired Error');
            // throws error isf the token has not been encrypted by the private key
            throw new Error('token has not been encrypted by the private key');
        }
    }

    /**
     * Returns the decoded payload if the signature is valid even if it is expired
     */
    // public static async decode(token: string): Promise<JwtPayload> {
    //     const cert = await this.readPublicKey();
    //     try {
    //         // @ts-ignore
    //         return (await promisify(verify)(token, cert, { ignoreExpiration: true })) as JwtPayload;
    //     } catch (e) {
    //         throw new Error();
    //     }
    // }
}

export class JwtPayload {
    aud: string;
    sub: string;
    iss: string;
    // iat: number;
    // exp: number;
    prm: string;

    constructor(
        issuer: string = 'App',
        audience: string = "App",
        subject: string = 'App',
        param: string,
        // validity: number = 15
    ) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = subject;
        // this.iat = Math.floor(Date.now() / 1000);
        // this.exp = this.iat + validity * 24 * 60 * 60;
        this.prm = param;
    }
}
