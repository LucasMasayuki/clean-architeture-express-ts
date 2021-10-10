import DbAuthentication from '@/data/usecases/db-authentication'
import EncrypterSpy from '@/tests/data/mocks/encrypter-spy'
import HashComparerSpy from '@/tests/data/mocks/hasher-compare-spy'
import mockAuthenticationParams from '@/tests/domain/mocks/mock-authentication-params'
import throwError from '@/tests/domain/mocks/throw-error'
import LoadUserByEmailRepositorySpy from '../mocks/repositories/users/load-user-by-email-repository.spy'

type SutTypes = {
  sut: DbAuthentication
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAuthentication(
    loadUserByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy
  )

  return {
    sut,
    loadUserByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    expect(loadUserByEmailRepositorySpy.email).toBe(authenticationParams.email)
  })

  test('Should throw if LoadUserByEmailRepository throws', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadUserByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadUserByEmailRepository returns undefined', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    const model = await sut.auth(mockAuthenticationParams())

    expect(model).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    expect(hashComparerSpy.plaintext).toBe(authenticationParams.password)
    expect(hashComparerSpy.digest).toBe(
      loadUserByEmailRepositorySpy.result?.password
    )
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false
    const model = await sut.auth(mockAuthenticationParams())

    expect(model).toBeNull()
  })

  test('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationParams())

    expect(parseInt(encrypterSpy.plaintext, 10)).toBe(
      loadUserByEmailRepositorySpy.result?.id
    )
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an data on success', async () => {
    const { sut, encrypterSpy } = makeSut()
    const result = await sut.auth(mockAuthenticationParams())

    expect(result?.accessToken).toBe(encrypterSpy.ciphertext)
  })
})
