const express = require('express')
const cors = require('cors')
// Import and require mysql2
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001
const app = express()
app.use(cors())
// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Connect to database
const db = mysql.createConnection(
  {
    host: process.env.CLEARDB_HOST || 'localhost',
    user: process.env.CLEARDB_USER || process.env.user,
    password: process.env.CLEARDB_PASSWORD || process.env.password,
    database: process.env.CLEARDB_DB || process.env.database
  },
  console.log(`Connected to the movie_db database.`)
)

// Query database
app.get('/api/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, result) => {
    if (err) {
      res.status(404).json({ error: err.message })
    } else {
      res.status(200).json({
        message: 'success',
        data: result
      })
    }
  })
})

app.get('/api/reviews', (req, res) => {
  const sql = 'SELECT * FROM reviews'
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json('error')
    } else {
      res.status(200).json({
        message: 'Success',
        data: result
      })
    }
  })
})

app.get('/api/movie/:id', (req, res) => {
  const sql = `SELECT * FROM movies WHERE id = ?`
  const params = req.params.id
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(404).json(`This route has been deleted or doesn't exist`)
    } else {
      res.status(200).json({
        message: 'Success',
        data: result
      })
    }
  })
})

app.get('/api/review/:id', (req, res) => {
  const sql = `SELECT * FROM reviews WHERE id = ?`
  const params = req.params.id
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(404).json(`This route has been deleted or doesn't exist`)
    } else {
      res.status(200).json({
        message: 'Success',
        data: result
      })
    }
  })
})

app.post('/api/add-movie', (req, res) => {
  const sql = `INSERT INTO movies (movie_name) VALUES (?);`
  const params = req.body.movie_name
  if (req.body && req.body.movie_name) {
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(404).json(`Couldn't add movie`)
      } else {
        res.status(201).json({
          message: 'Success',
          data: result
        })
      }
    })
  } else {
    res.status(400).json('Bad request')
  }
})

app.post('/api/add-review/', (req, res) => {
  const sql = `INSERT INTO reviews (movie_id, review) VALUES (?, ?);`
  const params = [req.body.movie_id, req.body.review]
  if (req.body && req.body.movie_id) {
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(404).json(`Couldn't add movie`)
      } else if (result.affectedRows === 0) {
        res.status(404).json("Couldn't find movie_id")
      } else {
        res.status(201).json({
          message: 'Success',
          data: result
        })
      }
    })
  } else {
    res.status(400).json('Bad request')
  }
})

app.put('/api/update-movie', (req, res) => {
  const sql = `UPDATE movies SET movie_name = ? WHERE id = ?;`
  const params = [req.body.movie_name, req.body.id]
  if (req.body && req.body.id && req.body.movie_name) {
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(404).json(`movie ${req.body.id} not found;`)
      } else {
        res.status(201).json({
          message: 'Success',
          data: result
        })
      }
    })
  } else {
    res.status(400).json('Bad request')
  }
})

app.put('/api/update-review', (req, res) => {
  const sql = `UPDATE reviews SET review = ? WHERE id = ?;`
  const params = [req.body.review, req.body.id]
  if (req.body && req.body.id && req.body.review) {
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(404).json(`Review ${req.body.id} not found;`)
      } else {
        res.status(201).json({
          message: 'Success',
          data: result
        })
      }
    })
  } else {
    res.status(400).json('Bad request')
  }
})

app.delete('/api/movie/:id', (req, res) => {
  const sql = 'DELETE FROM movies WHERE id = ?'
  const id = req.params.id
  const params = id
  if (!id) {
    res.status(400).json('Bad request')
  } else {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json(`Movie ${id} doesn't exist`)
        } else {
          res.status(201).json({
            message: `Successfully deleted movie ${id}`,
            changes: result.affectedRows
          })
        }
      }
    })
  }
})

app.delete('/api/review/:id', (req, res) => {
  const id = req.params.id
  if (!id) {
    res.status(400).json('Bad request')
  } else {
    db.query('DELETE FROM reviews WHERE id = ?', id, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json(`Review ${id} doesn't exist`)
        } else {
          res.status(201).json({
            message: 'Success',
            changes: result.affectedRows
          })
        }
      }
    })
  }
})

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end()
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
