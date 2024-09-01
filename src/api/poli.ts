import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const db = c.env.DB
  const polis = await db.prepare('select * from poli').all()
  return c.json(polis.results)
})

app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const poli = await db.prepare('select * from poli where id = ?').bind(id).first()
  return c.json(poli)
})

export default app