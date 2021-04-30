/* eslint-disable @typescript-eslint/no-explicit-any */
import adaptResolver from '@/main/adapters/apollo-server-resolver-adapter'
import makeLoginController from '@/main/factories/controllers/login-controller-factory'
import makeSignUpController from '@/main/factories/controllers/signup-controller-factory'

export default {
    Query: {
        login: async (parent: any, args: any): Promise<any> => adaptResolver(makeLoginController(), args),
    },

    Mutation: {
        signUp: async (parent: any, args: any): Promise<any> => adaptResolver(makeSignUpController(), args),
    },
}
