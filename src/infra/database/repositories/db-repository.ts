import { ObjectType, Repository } from 'typeorm'
import DbConnection from '../helpers/db-connection'

export default abstract class DbRepository {
  private readonly connection: DbConnection = DbConnection.getInstance()

  getRepository<Entity>(entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity)
  }
}
