import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const db = c.env.DB
  const polis = await db.prepare('select * from poli').all()
  return c.json({poli: polis.results})
})

export default app