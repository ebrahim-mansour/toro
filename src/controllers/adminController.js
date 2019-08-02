// Models
const Coach = require('../models/coache')
const Trainee = require('../models/trainee')

let gets = {
  dashboard: async (req, res) => {
    let coaches = await Coach.getAllCoaches()
    let trainees = await Trainee.getAllTrainees()
    return res.render('admin/dashboard', {
      coaches,
      trainees
    })
  },
  manageCoaches: async (req, res) => {
    let coaches = await Coach.getAllCoaches()
    res.render('admin/coaches', { coaches })
  }
}
let deletes = {
  deleteCoach: async (req, res) => {
    await Coach.destroy({
      where: {
        coachId: req.params.id
      }
    })
    res.redirect('back')
  }
}
let patches = {
  acceptCoach: async (req, res) => {
    await Coach.update(
      {
        validity: 1
      },
      {
        where: {
          coachId: req.params.id
        }
      }
    )
    res.redirect('back')
  }
}

module.exports = {
  gets,
  deletes,
  patches
}