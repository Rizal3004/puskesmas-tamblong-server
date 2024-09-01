import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const db = c.env.DB
  const patients = await db.prepare('select * from patients').all()
  return c.json(patients.results)
})

app.get('/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const patient = await db.prepare('select * from patients where id = ?').bind(id).first()
  return c.json(patient)
})

app.put('/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { name, email, password, phone, address, birthdate } = await c.req.json<{ name: string, email: string, password: string, phone: string, address: string, birthdate: string }>()
  await db.prepare('update patients set name = ?, email = ?, password = ?, phone = ?, address = ?, birthdate = ? where id = ?').bind(name, email, password, phone, address, birthdate, id).run()
  return c.json({message: 'Patient updated'})
})

app.patch('/:id/email', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { email } = await c.req.json<{ email: string }>()
  await db.prepare('update patients set email = ? where id = ?').bind(email, id).run()
  return c.json({message: 'Email updated'})
})

app.patch('/:id/password', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { password } = await c.req.json<{ password: string }>()
  await db.prepare('update patients set password = ? where id = ?').bind(password, id).run()
  return c.json({message: 'Password updated'})
})

app.patch('/:id/phone', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { phone } = await c.req.json<{ phone: string }>()
  await db.prepare('update patients set phone = ? where id = ?').bind(phone, id).run()
  return c.json({message: 'Phone updated'})
})

app.patch('/:id/address', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { address } = await c.req.json<{ address: string }>()
  await db.prepare('update patients set address = ? where id = ?').bind(address, id).run()
  return c.json({message: 'Address updated'})
})

app.patch('/:id/birthdate', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { birthdate } = await c.req.json<{ birthdate: string }>()
  await db.prepare('update patients set birthdate = ? where id = ?').bind(birthdate, id).run()
  return c.json({message: 'Birthdate updated'})
})

app.delete('/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const isBooked = await db.prepare('select * from booking_activity where pasien_id = ?').bind(id).all()
  if (isBooked) {
    await db.prepare('delete from booking_activity where pasien_id = ?').bind(id).run()
  }
  await db.prepare('delete from patients where id = ?').bind(id).run()
  return c.json({message: 'Patient deleted'})
})

export default app