// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata'

import { Container } from 'inversify'

import UseCasesContainer from './containers/use-cases/use-cases-container'
import RepositoriesContainer from './containers/repositories/repositories-container'
import CryptographyContainer from './containers/cryptography/cryptography-container'

const IocContainer = Container.merge(
  CryptographyContainer,
  RepositoriesContainer,
  UseCasesContainer
)

export { IocContainer }
