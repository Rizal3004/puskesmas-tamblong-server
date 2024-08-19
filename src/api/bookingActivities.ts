import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const db = c.env.DB
  const bookingActivities = await db.prepare('select * from booking_activity').all()
  return c.json({bookingActivities :bookingActivities.results})
})

app.post('/', async (c) => {
  const db = c.env.DB

  const {
    starts_at,
    ends_at,
    bpjs_number,
    pasien_id,
    dokter_id,
    date,
    patient_type,
    keluhan
  } = await c.req.json()

  await db.prepare('insert into booking_activity (bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at ) values ( ?, ?, ?, ?, ?, ?, ?, ?)').bind(bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at).run()
  const booking_activity_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  const newBookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(booking_activity_id).first()

  return c.json({ booking_activity: newBookingActivity })
})

app.get('/patient/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const bookingActivity = await db.prepare('select * from booking_activity where pasien_id = ? and status = "booked"').bind(id).first()
  return c.json({ bookingActivity })
})

app.patch('/:id/done', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  const {
    penyakit,
    resep
  } = await c.req.json()
  await db.prepare(`
    update booking_activity 
    set status = "done", penyakit = ?, resep = ? 
    where id = ?`
  ).bind(penyakit, resep, id).run()

  return c.json({ message: 'Booking activity done' })
})

app.patch('/:id/cancel', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  await db.prepare('update booking_activity set status = "canceled" where id = ?').bind(id).run()
  return c.json({ message: 'Booking activity cancel' })
})

app.patch('/:id/update-time-and-doctor', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  const {
    starts_at,
    ends_at,
    date,
    dokter_id
  } = await c.req.json()

  await db.prepare(`
    update booking_activity 
    set starts_at = ?, ends_at = ?, date = ?, dokter_id = ?
    where id = ?`
  ).bind(starts_at, ends_at, date, dokter_id, id).run()

  return c.json({ message: 'Booking activity updated' })
})

app.patch('/:id/arrived', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  await db.prepare('update booking_activity set arrived_at = datetime(current_timestamp, "localtime") where id = ?').bind(id).run()
  return c.json({ message: 'Booking activity arrived' })
})

export default app