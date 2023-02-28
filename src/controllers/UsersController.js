const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const UserRepository = require("../repositories/UserRepository")
const sqliteConnection = require("../database/sqlite")
const UserCreateServices = require("../services/UserCreateServices")

class UsersController {
  async create(request, response) {
    console.log("entrou no back")
    const { name, email, password } = request.body

    const userRepository = new UserRepository()
    const userCreateServices = new UserCreateServices(userRepository)
    await userCreateServices.execute({ name, email, password })

    console.log("inseriu")

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ])

    if (!user) {
      throw new AppError("Usuário não Encontrado")
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError("Informe a antiga senha")
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)
      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere")
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return response.json()
  }
}

module.exports = UsersController
