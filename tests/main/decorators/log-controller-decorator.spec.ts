import LogControllerDecorator from '@/main/decorators/log-controller-decorator'
import LogErrorRepositorySpy from '@/tests/data/mocks/log-error-repository-spy'
import faker from 'faker'

import ControllerSpy from '../mocks/controller-spy'
import mockServerError from '../mocks/mock-server-error'

type SutTypes = {
    sut: LogControllerDecorator
    controllerSpy: ControllerSpy
    logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
    const controllerSpy = new ControllerSpy()
    const logErrorRepositorySpy = new LogErrorRepositorySpy()
    const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
    return {
        sut,
        controllerSpy,
        logErrorRepositorySpy,
    }
}

describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerSpy } = makeSut()
        const request = faker.random.words()
        await sut.handle(request)
        expect(controllerSpy.request).toEqual(request)
    })

    test('Should return the same result of the controller', async () => {
        const { sut, controllerSpy } = makeSut()
        const httpResponse = await sut.handle(faker.random.words())
        expect(httpResponse).toEqual(controllerSpy.httpResponse)
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
        const serverError = mockServerError()
        controllerSpy.httpResponse = serverError
        await sut.handle(faker.random.words())
        expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
    })
})
