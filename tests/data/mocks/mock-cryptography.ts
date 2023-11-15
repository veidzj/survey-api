import faker from 'faker'
import { Encrypter, Decrypter, Hasher, HashComparer } from '@/data/protocols'

export class EncrypterSpy implements Encrypter {
  cipherText: string = faker.datatype.uuid()
  plainText: string

  async encrypt (plainText: string): Promise<string> {
    this.plainText = plainText
    return await Promise.resolve(this.cipherText)
  }
}

export class DecrypterSpy implements Decrypter {
  plainText: string = faker.internet.password()
  cipherText: string

  async decrypt (cipherText: string): Promise<string> {
    this.cipherText = cipherText
    return await Promise.resolve(this.plainText)
  }
}

export class HasherSpy implements Hasher {
  digest: string = faker.datatype.uuid()
  plainText: string

  async hash (plainText: string): Promise<string> {
    this.plainText = plainText
    return await Promise.resolve(this.digest)
  }
}

export class HashComparerSpy implements HashComparer {
  plainText: string
  digest: string
  isValid: boolean = true

  async compare (plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText
    this.digest = digest
    return await Promise.resolve(this.isValid)
  }
}
