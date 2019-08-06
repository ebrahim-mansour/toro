const fs = require('fs')

// Models
const Coach = require('../models/coache')
const Trainee = require('../models/trainee')
const Exercise = require('../models/exercises')

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
    // Calculating the number of trainees each coach have
    let coaches = await Coach.getAllCoaches()
    let coachesIds = []
    let trainees = await Trainee.getAllTrainees()
    trainees.forEach(trainee => {
      coachesIds.push(trainee.coachId)
    })
    coaches.forEach(coach => {
      let numberOfTrainees = 0
      for (let i = 0; i < coachesIds.length; ++i) {
        if (coachesIds[i] == coach.coachId)
          numberOfTrainees++;
      }
      coach.numberOfTrainees = numberOfTrainees
    })
    res.render('admin/coaches', { coaches })
  },
  exercises: async (req, res) => {
    let categories = await Exercise.getDistinctNamesOfCategories()
    res.render('admin/exercises', { categories })
  },
  addExercise: async (req, res) => {
    let categories = await Exercise.getDistinctNamesOfCategories()
    res.render('admin/addExercise', { categories })
  },
  viewExercisesByCategory: async (req, res) => {
    let exercisesByCategory = await Exercise.getCategoryExercises(req.params.category)
    res.render('admin/exercisesByCategory', { exercisesByCategory })
  },
  editExercise: async (req, res) => {
    let exerciseName = req.params.exerciseName
    let categories = await Exercise.getDistinctNamesOfCategories()
    let exercise = await Exercise.findExerciseByName(exerciseName)
    if (!exercise) {
      return res.redirect('back')
    }
    return res.render('admin/editExercise', { exercise, categories })
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
  },
  editExercise: async (req, res) => {
    let name = req.body.name
    let category = req.body.category
    let videoUrl = req.body.videoLink

    // Validation
    req.checkBody('name', 'Exercise Name is required').notEmpty()
    req.checkBody('category', 'Category is required').notEmpty()
    req.checkBody('videoLink', 'videoLink is required').notEmpty()

    let errors = req.validationErrors()
    let customErrors = []

    if (req.file) {
      if (req.file.size > 500000) {
        customErrors.push('File size should not be more than 500k kilobyte')
      }
      if (!req.file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        customErrors.push('File must be an image')
      }
    } else {
      customErrors.push('Image is required')
    }

    if (errors || customErrors.length > 0) {
      let path = req.file.path
      fs.unlink(path, async (err) => {
        if (err) {
          console.error(err)
        } else {
          let categories = await Exercise.getDistinctNamesOfCategories()
          let exercise = await Exercise.findExerciseByName(name)
          return res.render('admin/editExercise', { errors, customErrors, exercise, categories, name, category, videoUrl })
        }
      })
    } else {
      let picPath = req.file.path
      let newPicPath = picPath.slice(6)
      let videoLink = videoUrl.replace('watch?v=', 'embed/')

      await Exercise.editExercise(name, category, newPicPath, videoLink)
      return res.redirect(`/admin/exercises/${category}`)
    }
  }
}
let posts = {
  addExercise: async (req, res) => {
    // Validation
    req.checkBody('name', 'Exercise Name is required').notEmpty()
    req.checkBody('category', 'Category is required').notEmpty()
    req.checkBody('videoLink', 'videoLink is required').notEmpty()

    let errors = req.validationErrors()
    let customErrors = []

    if (req.file) {
      if (req.file.size > 500000) {
        customErrors.push('File size should not be more than 500k kilobyte')
      }
      if (!req.file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        customErrors.push('File must be an image')
      }
    } else {
      customErrors.push('Image is required')
    }

    if (errors || customErrors.length > 0) {
      let path = req.file.path
      fs.unlink(path, async (err) => {
        if (err) {
          console.error(err)
        } else {
          let categories = await Exercise.getDistinctNamesOfCategories()
          return res.render('admin/addExercise', { errors, customErrors, categories })
        }
      })
    } else {
      let name = req.body.name
      let category = req.body.category
      let picPath = req.file.path
      let newPicPath = picPath.slice(6)
      let videoUrl = req.body.videoLink
      let videoLink = videoUrl.replace('watch?v=', 'embed/')

      try {
        await new Exercise({
          name,
          picturePath: newPicPath,
          videoLink,
          category
        }).save()
        res.redirect('back')
      } catch (e) {
        res.redirect('back')
      }
    }
  }
}

module.exports = {
  gets,
  deletes,
  patches,
  posts
}