/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from 'inversify'
import { AUTHENTICATION_SYMBOL } from '../../symbols/use-cases'
import { Authentication } from '@/domain/usecases/authentication'
import DbAuthentication from '@/data/usecases/db-authentication'

const AuthenticationUseCasesContainer = new Container()

AuthenticationUseCasesContainer.bind<Authentication>(AUTHENTICATION_SYMBOL).to(DbAuthentication)

export default AuthenticationUseCasesContainer
