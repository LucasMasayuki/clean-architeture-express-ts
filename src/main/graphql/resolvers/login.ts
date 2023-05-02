/* eslint-disable @typescript-eslint/no-explicit-any */
import adaptResolver from '@/main/adapters/apollo-server-resolver-adapter'
import { IocContainer } from '@/main/ioc-containers/inversify.config'
import { LoginController } from '@/presentation/controllers/authentication/login-controller'

export default {
  Query: {
    login: async (parent: any, args: any): Promise<any> => adaptResolver(IocContainer.resolve(LoginController), args)
  }
}
