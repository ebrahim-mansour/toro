// Models
const Coach = require('../models/coache')
const Trainee = require('../models/trainee')

let get = {
  dashboard: async (req, res) => {
    let coaches = await Coach.getAllCoaches()
    let trainees = await Trainee.getAllTrainees()
    return res.render('admin/dashboard', {
      coaches,
      trainees
    })
  }
}
let post = {
}

module.exports = {
  gets: get,
  posts: post
}