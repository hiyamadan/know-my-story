const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Blog = require('../models/Blog')

//Show add page
//GET /blogs/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('blogs/add')
  })

//Process add form
//POST /blogs
router.post('/', ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Blog.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })
 

//Show all blogs
//GET /blogs
router.get('/', ensureAuth, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('blogs/index', {
      blogs,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//edit page
//GET /blogs/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
    }).lean()

    if (!blog) {
      return res.render('error/404')
    }

    if (blog.user != req.user.id) {
      res.redirect('/blogs')
    } else {
      res.render('blogs/edit', {
        blog,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//Update blog
//PUT /blogs/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).lean()

    if (!blog) {
      return res.render('error/404')
    }

    if (blog.user != req.user.id) {
      res.redirect('/blogs')
    } else {
      blog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// Delete blog
// DELETE /blogs/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).lean()

    if (!blog) {
      return res.render('error/404')
    }

    if (blog.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Blog.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router ;