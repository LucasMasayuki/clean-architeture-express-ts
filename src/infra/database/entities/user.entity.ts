import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'FirstName' })
  firstName?: string

  @Column({ name: 'LastName' })
  lastName?: string

  @Column({ name: 'Email' })
  email!: string

  @Column({ name: 'token', nullable: true })
  token!: string

  @Column({ name: 'Password', nullable: true })
  password!: string

  @Column({ name: 'Birthdate', nullable: true })
  birthDate!: Date

  @CreateDateColumn({
    name: 'Created',
    nullable: false
  })
  created!: Date

  @UpdateDateColumn({
    name: 'Modified',
    nullable: false
  })
  modified!: Date
}
