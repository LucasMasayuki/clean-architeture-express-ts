module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // NÃO MEXA NISSO NUNCA, VOCÊ VAI DERRUBAR O SISTEMA
  entities: ['dist/infra/database/entities/{*.ts, *.js}', 'src/infra/database/entities/{*.js,*ts}'],
  migrations: ['dist/migrations/{*.js,*.ts}'],
  cli: {
    migrationsDir: 'dist/migrations'
  }
}
