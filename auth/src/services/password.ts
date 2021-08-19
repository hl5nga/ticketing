import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAasync = promisify(scrypt) 

export class Password { 
    static async toHash(password: string) { 
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAasync(password, salt, 64)) as Buffer ;

        return `${buf.toString('hex')}.${salt}`;
    }
    static async compare ( storedPassword: string , suppliedPassword: string ){ 
        const  [hashPasword, salt] = storedPassword.split('.');
        const buf = (await scryptAasync(suppliedPassword, salt, 64)) as Buffer ;
        
        return buf.toString('hex') === hashPasword;
    }
}