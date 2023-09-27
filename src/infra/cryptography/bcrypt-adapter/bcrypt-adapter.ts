import bcrypt from 'bcrypt'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (plainText: string): Promise<string> {
    const digest = await bcrypt.hash(plainText, this.salt)
    return digest
  }

  async compare (plainText: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plainText, digest)
    return isValid
  }
}
