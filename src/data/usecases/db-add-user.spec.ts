import DbAddUser from '@/data/usecases/db-add-user'
import mockAddUserParams from '@/tests/domain/mocks/mock-add-user-params'
import throwError from '@/tests/domain/mocks/throw-error'
import HasherSpy from '@/tests/data/mocks/hasher-spy'
import UserMock from '@/tests/infra/database/mocks/entities/user-mock.entity'
import { User } from '@/infra/database/entities'
import { TestContainer } from '@/main/ioc-containers/inversify-config-test'
import { LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL, SAVE_USER_REPOSITORY_SYMBOL } from '@/main/ioc-containers/symbols/repositories'
import { HASHER_SYMBOL } from '@/main/ioc-containers/symbols/cryptography/cryptography-symbols'
import LoadUserByEmailRepositorySpy from '@/tests/data/mocks/repositories/users/load-user-by-email-repository.spy'
import SaveUserRepositorySpy from '@/tests/data/mocks/repositories/users/save-user-repository-spy'

type SutTypes = {
  sut: DbAddUser
  hasherSpy: HasherSpy
  saveUserRepositorySpy: SaveUserRepositorySpy
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const saveUserRepositorySpy = new SaveUserRepositorySpy()

  TestContainer.bind(LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL).toConstantValue(loadUserByEmailRepositorySpy)
  TestContainer.bind(HASHER_SYMBOL).toConstantValue(hasherSpy)
  TestContainer.bind(SAVE_USER_REPOSITORY_SYMBOL).toConstantValue(saveUserRepositorySpy)

  const sut = TestContainer.resolve(DbAddUser)

  return {
    sut,
    hasherSpy,
    saveUserRepositorySpy,
    loadUserByEmailRepositorySpy
  }
}

describe('DbAddUser Usecase', () => {
  beforeEach(() => {
    TestContainer.snapshot()
  })

  afterEach(() => {
    TestContainer.restore()
  })

  test('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    const addUserParams = mockAddUserParams()

    await sut.add(addUserParams)

    expect(hasherSpy.plaintext).toBe(addUserParams.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddUserParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, hasherSpy, loadUserByEmailRepositorySpy, saveUserRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    const addUserParams = mockAddUserParams()
    await sut.add(addUserParams)

    expect(saveUserRepositorySpy.user?.birthDate).toEqual(
      addUserParams.birthDate
    )

    expect(saveUserRepositorySpy.user?.password).toEqual(
      hasherSpy.digest
    )

    expect(saveUserRepositorySpy.user?.firstName).toEqual(
      addUserParams.firstName
    )

    expect(saveUserRepositorySpy.user?.lastName).toEqual(
      addUserParams.lastName
    )

    expect(saveUserRepositorySpy.user?.email).toEqual(
      addUserParams.email
    )
  })

  test('Should throw if AddUserRepository throws', async () => {
    const { sut, loadUserByEmailRepositorySpy, saveUserRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    jest.spyOn(saveUserRepositorySpy, 'saveUser').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddUserParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut, loadUserByEmailRepositorySpy, saveUserRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    saveUserRepositorySpy.result = new User()
    const isValid = await sut.add(mockAddUserParams())

    expect(isValid).toBe(true)
  })

  test('Should return false if SaveUserRepository returns undefined', async () => {
    const { sut, saveUserRepositorySpy } = makeSut()
    saveUserRepositorySpy.result = undefined
    const isValid = await sut.add(mockAddUserParams())

    expect(isValid).toBe(false)
  })

  test('Should return false if LoadUserByEmailRepository returns one user', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = new UserMock()
    const isValid = await sut.add(mockAddUserParams())

    expect(isValid).toBe(false)
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const addUserParams = mockAddUserParams()
    await sut.add(addUserParams)

    expect(loadUserByEmailRepositorySpy.email).toBe(addUserParams.email)
  })
})
