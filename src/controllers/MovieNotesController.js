const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags} = request.body
    const { user_id } = request.params

    if (rating > 5 || rating < 0) {
      throw new AppError("De uma nota de 0 a 5")
    }

    const note_id = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map( name => {
      return {
        note_id,
        name,
        user_id,
      }
    })

    await knex("tags").insert(tagsInsert)

    response.json()

  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex("movieNotes").where({ id }).first()
    const tags = await knex("tags").where({ note_id: id }).orderBy("name")

    return response.json({
      ...note,
      tags
    })
  }
}

module.exports = MovieNotesController