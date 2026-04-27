import { randomBytes, scrypt } from 'node:crypto';

export class Password {
  static async hash(password: string, salt?: string): Promise<string> {
    const preparedSalt = salt || randomBytes(16).toString('hex');

    return new Promise((resolve, reject) => {
      scrypt(password, preparedSalt, 64, (err, derivedHash) => {
        if (err) {
          return reject(err);
        }

        return resolve(`${preparedSalt}:${derivedHash.toString('hex')}`);
      });
    });
  }

  static async verify(hash: string, inputPassword: string): Promise<boolean> {
    const [salt, originalHash] = hash.split(':') as [string, string];

    if (!salt || !originalHash) {
      throw new Error('Invalid hash format');
    }

    const derivedHash = await Password.hash(inputPassword, salt);

    return derivedHash === hash;
  }
}
