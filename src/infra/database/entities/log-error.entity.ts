import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'LogErrors' })
export class LogError {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'Stack' })
  stack?: string

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
