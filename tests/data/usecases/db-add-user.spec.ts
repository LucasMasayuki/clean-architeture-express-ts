import DbAddUser from '@/data/usecases/db-add-user'
import mockAddUserParams from '@/tests/domain/mocks/mock-add-user-params'
import throwError from '@/tests/domain/mocks/throw-error'
import HasherSpy from '@/tests/data/mocks/hasher-spy'
import SaveUserRepositorySpy from '../mocks/repositories/users/save-user-repository-spy'
import UserMock from '@/tests/infra/database/mocks/entities/user-mock.entity'
import LoadUserByEmailRepositorySpy from '../mocks/repositories/users/load-user-by-email-repository.spy'
import { User } from '@/infra/database/entities'

type SutTypes = {
  sut: DbAddUser
  hasherSpy: HasherSpy
  saveUserRepository: SaveUserRepositorySpy
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const saveUserRepository = new SaveUserRepositorySpy()
  const sut = new DbAddUser(
    hasherSpy,
    saveUserRepository,
    loadUserByEmailRepositorySpy
  )

  return {
    sut,
    hasherSpy,
    saveUserRepository,
    loadUserByEmailRepositorySpy
  }
}

describe('DbAddUser Usecase', () => {
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
    const { sut, hasherSpy, loadUserByEmailRepositorySpy, saveUserRepository } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    const addUserParams = mockAddUserParams()
    await sut.add(addUserParams)

    expect(saveUserRepository.user?.birthDate).toEqual(
      addUserParams.birthDate
    )

    expect(saveUserRepository.user?.password).toEqual(
      hasherSpy.digest
    )

    expect(saveUserRepository.user?.firstName).toEqual(
      addUserParams.firstName
    )

    expect(saveUserRepository.user?.lastName).toEqual(
      addUserParams.lastName
    )

    expect(saveUserRepository.user?.email).toEqual(
      addUserParams.email
    )
  })

  test('Should throw if AddUserRepository throws', async () => {
    const { sut, loadUserByEmailRepositorySpy, saveUserRepository } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    jest.spyOn(saveUserRepository, 'saveUser').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddUserParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut, loadUserByEmailRepositorySpy, saveUserRepository } = makeSut()
    loadUserByEmailRepositorySpy.result = undefined
    saveUserRepository.result = new User()
    const isValid = await sut.add(mockAddUserParams())

    expect(isValid).toBe(true)
  })

  test('Should return false if SaveUserRepository returns undefined', async () => {
    const { sut, saveUserRepository } = makeSut()
    saveUserRepository.result = undefined
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
