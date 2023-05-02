import 'reflect-metadata'

import { Container } from 'inversify'
import AuthenticationUseCasesContainer from './authentication-use-cases-container'
import CryptographyContainer from '../cryptography/cryptography-container'

const UseCasesContainer = Container.merge(
  AuthenticationUseCasesContainer,
  CryptographyContainer
)

export default UseCasesContainer
