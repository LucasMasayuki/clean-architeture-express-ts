import { LogErrorRepository } from '@/data/interfaces/database/log/log-error-repository'

export default class LogErrorRepositorySpy implements LogErrorRepository {
    constructor(stack = '') {
        this.stack = stack
    }

    stack: string

    async logError(stack: string): Promise<void> {
        this.stack = stack
    }
}
