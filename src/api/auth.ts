import { Context, Hono } from "hono"
import { sign, verify } from "hono/jwt"
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'

type Variables = JwtVariables

const app = new Hono<{ Bindings: Env, Variables: Variables }>()

app.use('/verify', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET
  })

  return jwtMiddleware(c, next)
})

app.post('/login', async (c) => {
  const db = c.env.DB
  const { email, password } = await c.req.json<{ email: string, password: string }>()
  const jwtSecret = c.env.JWT_SECRET

  const result = await db.prepare('select * from patients where email = ? and password = ?').bind(email, password).first()

  if (!result) {
    return c.text('Invalid email or password', 401)
  }

  const token = await sign({ id: result.id }, jwtSecret)

  return c.json({ token, patient: result })
})

app.post('/verify', async (c) => {
  const db = c.env.DB

  const { id } = c.get('jwtPayload')

  const patient = await db.prepare('select * from patients where id = ?').bind(id).first()

  if (!patient) {
    return c.text('Invalid token', 401)
  }

  return c.json({ patient })
})

app.post('/register', async (c) => {
  const db = c.env.DB
  const {
    email,
    password,
    name,
    nik
  }: {
    email: string
    password: string
    name: string
    nik: string
  } = await c.req.json()

  await db.prepare('insert into patients (email, password, name, nik) values (?, ?, ?, ?)').bind(email, password, name, nik).run()

  return c.json({ message: 'success' })
})

export default app