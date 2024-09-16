import { Hono } from "hono"
import { base64Decode, base64Encode } from "../utils/base64Util"
const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const db = c.env.DB

  const doctorId = c.req.query('doctor_id')

  if (doctorId) {
    const doctors = await db.prepare('select * from doctor where poli_id = (select poli_id from doctor where id = ?)').bind(doctorId).all()
    return c.json(doctors.results)
  }

  const doctors = await db.prepare('select * from doctor').all()
  return c.json(doctors.results)
})

app.get('/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const doctor = await db.prepare('select * from doctor where id = ?').bind(id).first()
  return c.json(doctor)
})

app.patch('/:id', async (c) => {
  // Ambil database dan KV
  const db = c.env.DB
  const kv = c.env.puskesmas_tamblong_kv

  // Ambil id dari parameter URL
  const id = c.req.param('id')

  // Ambil data dari body request
  const {
    email,
    imageFile,
    jam_kerja_end,
    jam_kerja_start,
    name,
    phone,
    poli_id,
  }: {
    email: string
    imageFile?: File | string
    jam_kerja_end: string
    jam_kerja_start: string
    name: string
    phone: string
    poli_id: string
  } = await c.req.parseBody()

  try {
    await db.prepare(`
      update doctor 
      set email = ?, jam_kerja_start = ?, jam_kerja_end = ?, name = ?, phone = ?, poli_id = ? 
      where id = ?
    `).bind(email, jam_kerja_start, jam_kerja_end, name, phone, poli_id, id).run()
  } catch (error) {
    console.log(error)
    return c.text(error as string, 500)
  }

  if (imageFile instanceof File) {
    imageFile
    try {
      const imageAsBase64 = base64Encode(await imageFile.arrayBuffer())
      await kv.put(`images/doctor/${id}.png`, imageAsBase64)
    } catch (error) {
      return c.text(error as string, 500)
    }
  }
  return c.json({ message: 'Doctor updated' })
})

app.put('/:id', async (c) => {
  const db = c.env.DB

  const kv = c.env.puskesmas_tamblong_kv

  const id = c.req.param('id')

  const {
    email,
    imageFile,
    jam_kerja_end,
    jam_kerja_start,
    name,
    phone,
    poli_id,
    password
  }: {
    email: string
    imageFile: File
    jam_kerja_end: string
    jam_kerja_start: string
    name: string
    phone: string
    poli_id: string
    password: string
  } = await c.req.parseBody()

  await db.prepare(`
    update doctor 
    set email = ?, jam_kerja_start = ?, jam_kerja_end = ?, name = ?, phone = ?, poli_id = ?, password = ?
    where id = ?
  `).bind(email, jam_kerja_start, jam_kerja_end, name, phone, poli_id, password, id).run()

  const doctor = await db.prepare('select * from doctor where id = ?').bind(id).first()

  if (imageFile) {
    const imageAsBase64 = base64Encode(await imageFile.arrayBuffer())

    await kv.put(`images/doctor/${id}.png`, imageAsBase64)
  }

  return c.json({ doctor })
})

app.post('/:id/deactivate', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  await db.prepare('update doctor set status = "nonactive" where id = ?').bind(id).run()
  return c.json({ message: 'Doctor deleted' })
})

app.post('/:id/activate', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  await db.prepare('update doctor set status = "active" where id = ?').bind(id).run()
  return c.json({ message: 'Doctor deleted' })
})

app.post('/', async (c) => {
  const db = c.env.DB
  const kv = c.env.puskesmas_tamblong_kv

  const {
    email,
    imageFile,
    jam_kerja_end,
    jam_kerja_start,
    name,
    phone,
    poli_id,
    password
  }: {
    email: string
    imageFile: File
    jam_kerja_end: string
    jam_kerja_start: string
    name: string
    phone: string
    poli_id: string
    password: string
  } = await c.req.parseBody()

  await db.prepare(`
    insert into 
    doctor (email, jam_kerja_start, jam_kerja_end, name, phone, poli_id, password)
    values (?, ?, ?, ?, ?, ?, ?)
  `).bind(email, jam_kerja_start, jam_kerja_end, name, phone, poli_id, password).run()

  const doctorId = (await db.prepare('select last_insert_rowid() as id').first() as { id: string }).id
  const doctor = await db.prepare('select * from doctor where id = ?').bind(doctorId).first()

  if (imageFile) {
    const imageAsBase64 = base64Encode(await imageFile.arrayBuffer())

    await kv.put(`images/doctor/${doctorId}.png`, imageAsBase64)
  }
  console.log('success')
  return c.json({ doctor })
})

app.get('/image/:id', async (c) => {
  // Ambil KV
  const kv = c.env.puskesmas_tamblong_kv
  const id = c.req.param('id')
  const image = await kv.get(`images/doctor/${id}.png`)
  if (!image) {
    return c.text('Image not found', 404)
  }

  return c.body(base64Decode(image), 200, {
    "Content-Type": "image/png"
  })
})

app.delete('/:id', async (c) => {
  const db = c.env.DB
  const kv = c.env.puskesmas_tamblong_kv

  const id = c.req.param('id')
  const isHandleBooking = await db.prepare('select * from booking_activity where dokter_id = ? and status = "booked"').bind(id).first()
  console.log(2)
  if (isHandleBooking) {
    await db.prepare('delete from booking_activity where dokter_id = ?').bind(id).run()
  }

  await db.prepare('delete from doctor where id = ?').bind(id).run()
  await kv.delete(`images/doctor/${id}.png`)
  return c.json({ message: 'Doctor deleted' })
})

app.post('/:id/change-email-and-password', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  const {
    email,
    password
  }: {
    email: string
    password: string
  } = await c.req.json()

  console.log({
    email,
    password,
    id
  })
  await db.prepare('update doctor set email = ?, password = ? where id = ?').bind(email, password, id).run()
  return c.json({ message: 'Email and password updated' })

})

export default app