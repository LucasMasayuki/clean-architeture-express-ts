import { injectable } from 'inversify'
import { ObjectLiteral, ObjectType, Repository, SelectQueryBuilder } from 'typeorm'
import DbConnection from '../helpers/db-connection'

export type QueryRelation = {
  relation: string
  alias: string
}

export type QueryOrderBy = {
  column: string
  sort: 'ASC' | 'DESC' | undefined
}

@injectable()
export default abstract class DbRepository {
  private readonly connection: DbConnection = DbConnection.getInstance()

  getRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity)
  }

  getConnectionQueryBuilder (): SelectQueryBuilder<any> {
    return this.connection.getConnectionQueryBuilder()
  }

  escape (name: string): string {
    return this.connection.driverEscape(name)
  }
}
