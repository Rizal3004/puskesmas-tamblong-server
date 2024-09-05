import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const status = c.req.query('status')
  const db = c.env.DB
  if (status) {
    const bookingActivities = await db.prepare('select * from booking_activity where status = ?').bind(status).all()
    return c.json(bookingActivities.results)
  }
  const bookingActivities = await db.prepare('select * from booking_activity').all()
  return c.json({ bookingActivities: bookingActivities.results })
})

app.get('/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const bookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(id).first()
  return c.json({ bookingActivity })
})

app.get('/:id/queue', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const bookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(id).first()
  if (!bookingActivity) return
  const queue = await db.prepare(`
    SELECT COUNT(*) + 1 AS no_antrian
FROM booking_activity
WHERE date = (SELECT date FROM booking_activity WHERE id = ?)
AND starts_at < (SELECT starts_at FROM booking_activity WHERE id = ?);
    `).bind(id, id).first()
  if (!queue) return c.json({ queue: 0 })
  return c.json({ queue: queue.no_antrian })
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

  // check if the doctor is available at the time
  const bookingActivity = await db.prepare('select * from booking_activity where dokter_id = ? and date = ? and ((starts_at >= ? and starts_at < ?) or (ends_at > ? and ends_at <= ?))').bind(dokter_id, date, starts_at, ends_at, starts_at, ends_at).first()

  if (bookingActivity) {
    return c.json({ error: 'Doctor is not available at the time' }, 400)
  }    

  await db.prepare('insert into booking_activity (bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at ) values ( ?, ?, ?, ?, ?, ?, ?, ?)').bind(bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at).run()
  const booking_activity_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  const newBookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(booking_activity_id).first()

  return c.json({ booking_activity: newBookingActivity })
})

app.post('/emergency', async (c) => {
  const db = c.env.DB

  const {
    dokter_id,
    name,
    nik,
    keluhan,
  } = await c.req.json()

  console.log({
    dokter_id,
    name,
    nik,
    keluhan
  })

  await db.prepare('insert into patients (name, password, nik) values (?, "user123", ?)').bind(name, nik).run()

  const pasien_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  await db.prepare(`
    INSERT INTO booking_activity (pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at) 
    VALUES (?, ?, DATE('now'), 'umum', ?, time('now', 'localtime'), TIME('now', '+2 hours', 'localtime'));
  `).bind(pasien_id, dokter_id, keluhan).run()

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

app.post('/:id/done', async (c) => {
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