import { Hono } from "hono"
import { sign } from "hono/jwt"
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'

type Variables = JwtVariables

// inisiasi aplikasi authentikasi
const app = new Hono<{ Bindings: Env, Variables: Variables }>()

app.use('/verify', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET
  })

  return jwtMiddleware(c, next)
})

// Fungsi yang menangani request login user
app.post('/login', async (c) => {
  // Mengambil database
  const db = c.env.DB

  // Mengambil email dan password dari inputan user
  const { email, password } = await c.req.json<{ email: string, password: string }>()

  // Mengambil secret key JWT
  const jwtSecret = c.env.JWT_SECRET

  // Mencari user berdasarkan email dan password
  const result = await db.prepare('select * from patients where email = ? and password = ?').bind(email, password).first()

  // Jika user tidak ditemukan, maka kirimkan pesan error
  if (!result) {
    return c.text('Email dan password tidak ditemukan', 401)
  }

  // Membuat token JWT
  const token = await sign({ id: result.id }, jwtSecret)

  // Mengirimkan token dan data user
  return c.json({ token, patient: result })
})

// Function to handle admin login
app.post('/admin/login', async (c) => {
  // Get database
  const db = c.env.DB

  // Get username and password from user input
  const { username, password } = await c.req.json<{ username: string, password: string }>()

  // Get JWT
  const jwtSecret = c.env.JWT_SECRET

  // Find admin by username and password
  const result = await db.prepare('select * from admin where username = ? and password = ?').bind(username, password).first()

  // If admin not found, return error message
  if (!result) {
    return c.text('Email dan password tidak ditemukan', 401)
  }

  // Create JWT token
  const token = await sign({ id: result.id }, jwtSecret)

  // Send token and admin data
  return c.json({ token, admin: result })
})

// Function to handle doctor login
app.post('/doctor/login', async (c) => {
  // Get database
  const db = c.env.DB

  // Get username and password from user input
  const { email, password } = await c.req.json<{ email: string, password: string }>()

  console.log({ email, password })

  // Get JWT
  const jwtSecret = c.env.JWT_SECRET

  // Find admin by username and password
  const result = await db.prepare('select * from doctor where email = ? and password = ?').bind(email, password).first()

  // If admin not found, return error message
  if (!result) {
    return c.text('Email dan password tidak ditemukan', 401)
  }

  // Create JWT token
  const token = await sign({ id: result.id }, jwtSecret)

  // Send token and admin data
  return c.json({ token, doctor: result })
})

// Verify token
app.post('/verify', async (c) => {
  // Get database
  const db = c.env.DB

  // Get id from JWT payload
  const { id } = c.get('jwtPayload')

  // Find patient
  const patient = await db.prepare('select * from patients where id = ?').bind(id).first()

  // If patient not found, return error message
  if (!patient) {
    return c.text('Invalid token', 401)
  }

  // Send patient data
  return c.json({ patient })
})

// Verify admin token
// app.post('/admin/verify', async (c) => {
//   // Get database
//   const db = c.env.DB

//   // Get id from JWT payload
//   const { id } = c.get('jwtPayload')

//   // Find admin
//   const admin = await db.prepare('select * from admin where id = ?').bind(id).first()

//   // If admin not found, return error message
//   if (!admin) {
//     return c.text('Invalid token', 401)
//   }

//   // Send admin data
//   return c.json({ admin })
// })

// Verify doctor token
// app.post('/verify/doctor', async (c) => {
//   // Get database
//   const db = c.env.DB

//   // Get id from JWT payload
//   const { id } = c.get('jwtPayload')

//   // Find admin
//   const admin = await db.prepare('select * from doctor where id = ?').bind(id).first()

//   // If admin not found, return error message
//   if (!admin) {
//     return c.text('Invalid token', 401)
//   }

//   // Send admin data
//   return c.json({ admin })
// })

// Register user
app.post('/register', async (c) => {
  // Get database
  const db = c.env.DB

  // Get email, password, name, nik, and birthdate from user input
  const {
    email,
    password,
    name,
    nik,
    birthdate,
    address,
    phone,
  }: {
    email: string
    password: string
    name: string
    nik: string
    birthdate: string
    address: string
    phone: string
  } = await c.req.json()

  // Check if email is already registered
  await db.prepare('insert into patients (email, password, name, nik, birthdate, address, phone) values (?, ?, ?, ?, ?, ?, ?)').bind(email, password, name, nik, birthdate, address, phone).run()

  // Get last inserted id
  return c.json({ message: 'success' })
})

export default app
