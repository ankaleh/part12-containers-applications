const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const { getAsync, setAsync } = require('../redis/index.js')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let countAsString = await getAsync("added_todos")
  if (countAsString) {
    const count = parseInt(countAsString) + 1
    setAsync("added_todos", count)
  } else setAsync("added_todos", 1)
  //console.log(countAsString)
  res.send(todo);
});

router.get('/statistics', async (req, res) => {
  const countAsString = await getAsync("added_todos")
  res.send({
    "added_todos": countAsString
  })
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  console.log('deletessä')
  await req.todo.delete()  
  res.sendStatus(200)
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  //not used
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = await Todo.findById(req.todo)
  todo.done = true
  await todo.save()
  res.sendStatus(200);
  //res.send(updatedTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
