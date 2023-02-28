const UserCreateServices = require("./UserCreateServices")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")

it("user should be created", async () => {
  const user = {
    name: "User test",
    email: "email@test.com",
    password: "test",
  }

  const userRepositoryInMemory = new UserRepositoryInMemory()
  const userCreateServices = new UserCreateServices(userRepositoryInMemory)
  const userCreated = await userCreateServices.execute(user)

  expect(userCreated).toHaveProperty("id")
})
