import jwt from 'jsonwebtoken'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plainText: string): Promise<string> {
    const cipherText = await jwt.sign({ id: plainText }, this.secret)
    return cipherText
  }

  async decrypt (cipherText: string): Promise<string> {
    const plainText = await jwt.verify(cipherText, this.secret)
    return plainText as string
  }
}
