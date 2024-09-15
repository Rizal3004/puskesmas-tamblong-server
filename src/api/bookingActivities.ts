import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

// Ngambil semua data booking activity
app.get('/', async (c) => {
  // Ngambil database
  const db = c.env.DB
  // Status booking activity
  const status = c.req.query('status')
  const dokterId = c.req.query('doctor_id')

  if (dokterId) {
    const bookingActivities = await db.prepare('select * from booking_activity where dokter_id = ? and status = "booked"').bind(dokterId).all()
    return c.json(bookingActivities.results)
  }

  // Kalo ada status
  if (status) {
    const bookingActivities = await db.prepare('select * from booking_activity where status = ?').bind(status).all()
    return c.json(bookingActivities.results)
  }

  // Kalo ga ada status
  const bookingActivities = await db.prepare('select * from booking_activity').all()
  return c.json({ bookingActivities: bookingActivities.results })
})

// Ngambil data booking activity berdasarkan id
app.get('/:id', async (c) => {
  // Ngambil database
  const db = c.env.DB
  // Ambil id dari parameter
  const id = c.req.param('id')
  // Ambil data booking activity berdasarkan id
  const bookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(id).first()
  return c.json({ bookingActivity })
})


app.get('/:id/queue', async (c) => {
  // Ngambil database
  const db = c.env.DB
  // Ambil id dari parameter
  const id = c.req.param('id')
  // ngambil data booking activity berdasarkan id
  await db.prepare('select * from booking_activity where id = ?').bind(id).first()
  // ngambil data antrian berdasarkan id
  const queue = await db.prepare(`
    SELECT COUNT(*) + 1 AS no_antrian
    FROM booking_activity
    WHERE date = (SELECT date FROM booking_activity WHERE id = ?)
    AND starts_at < (SELECT starts_at FROM booking_activity WHERE id = ?);
    `).bind(id, id).first()
  if (!queue) return c.json({ queue: 0 })

  // return data antrian
  return c.json({ queue: queue.no_antrian })
})

// Membuat booking activity
app.post('/', async (c) => {
  // Ngambil database
  const db = c.env.DB

  // Ngambil data dari inputan user
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

  // jika dokter tidak tersedia
  if (bookingActivity) {
    return c.json({ error: 'Doctor is not available at the time' }, 400)
  }

  // membuat booking activity
  await db.prepare('insert into booking_activity (bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at ) values ( ?, ?, ?, ?, ?, ?, ?, ?)').bind(bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at).run()

  // ngambil id booking activity yang baru dibuat
  const booking_activity_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  // ngambil data booking activity yang baru dibuat
  const newBookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(booking_activity_id).first()

  // return data booking activity yang baru dibuat
  return c.json({ booking_activity: newBookingActivity })
})

// Booking darurat
app.post('/emergency', async (c) => {
  // Ngambil database
  const db = c.env.DB

  // Ngambil data dari inputan user
  // "name": "fadsfads", "dokter_id": 5, "keluhan": "fasdfadsf", "phone": "afsdfadsf", "date": "2024-09-19", "starts_at": "09:00:00", "ends_at": "10:00:00" 
  const {
    dokter_id,
    name,
    phone, // tambah no telp
    date,
    starts_at,
    ends_at,
    nik,
    keluhan,
  } = await c.req.json()

  // check if the doctor is available at the time
  const bookingActivity = await db.prepare('select * from booking_activity where dokter_id = ? and date = ? and ((starts_at >= ? and starts_at < ?) or (ends_at > ? and ends_at <= ?))').bind(dokter_id, date, starts_at, ends_at, starts_at, ends_at).first()

  // jika dokter tidak tersedia
  if (bookingActivity) {
    return c.json({ error: 'Doctor is not available at the time' }, 400)
  }

  // membuat pasien baru
  await db.prepare('insert into patients (name, password, nik, phone) values (?, "user123", ?, ?)').bind(name, nik, phone).run()

  // ngambil id pasien yang baru dibuat
  const pasien_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  // membuat booking activity
  await db.prepare('insert into booking_activity ( pasien_id, dokter_id, date, keluhan, starts_at, ends_at, patient_type ) values ( ?, ?, ?, ?, ?, ?, "umum")').bind(pasien_id, dokter_id, date, keluhan, starts_at, ends_at).run()

  // ngambil id booking activity yang baru dibuat
  const booking_activity_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  // ngambil data booking activity yang baru dibuat
  const newBookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(booking_activity_id).first()


  // // membuat booking activity
  // await db.prepare(`
  //   INSERT INTO booking_activity (pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at) 
  //   VALUES (?, ?, DATE('now'), 'umum', ?, time('now', 'localtime'), TIME('now', '+2 hours', 'localtime'));
  // `).bind(pasien_id, dokter_id, keluhan).run()

  // // ngambil id booking activity yang baru dibuat
  // const booking_activity_id = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id

  // // ngambil data booking activity yang baru dibuat
  // const newBookingActivity = await db.prepare('select * from booking_activity where id = ?').bind(booking_activity_id).first()

  return c.json({ booking_activity: newBookingActivity })
})


// Ambil data booking activity berdasarkan id pasien
app.get('/patient/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const bookingActivity = await db.prepare('select * from booking_activity where pasien_id = ? and status = "booked"').bind(id).first()
  return c.json({ bookingActivity })
})

// Mengupdate booking activity
app.post('/:id/done', async (c) => {

  const db = c.env.DB
  const id = c.req.param('id')
  const {
    penyakit,
    resep
  } = await c.req.json()

  console.log({ id, penyakit, resep })
  const result = await db.prepare(`
    update booking_activity 
    set status = "done", penyakit = ?, resep = ? 
    where id = ?`
  ).bind(penyakit, resep, id).run()

  console.log(result)

  console.log('done')

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