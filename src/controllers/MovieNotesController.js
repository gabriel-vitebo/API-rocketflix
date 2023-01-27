const knex = require("../database/knex")

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags} = request.body
    const { user_id } = request.params

    const note_id = await knex("movieNotes").insert({
      title,
      description,
      rating
    })

    const tagsInsert = tags.map( name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("tags").insert(tagsInsert)

    response.json()

  }
}

module.exports = MovieNotesController