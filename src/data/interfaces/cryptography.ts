export interface Decrypter {
    decrypt: (ciphertext: string) => Promise<string>
}

export interface Encrypter {
    encrypt: (plaintext: string) => Promise<string>
}

export interface HashComparer {
    compare: (plainText: string, digest: string) => Promise<boolean>
}

export interface Hasher {
    hash: (plaintext: string) => Promise<string>
}
