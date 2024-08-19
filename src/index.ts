import { Hono } from 'hono'
import { cors } from 'hono/cors'

import auth from './api/auth'
import patients from './api/patients'
import bookingActivities from './api/bookingActivities'
import doctors from './api/doctors'
import poli from './api/poli'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', auth)
app.route('/patients', patients)
app.route('/doctors', doctors)
app.route('/booking-activities', bookingActivities)
app.route('/poli', poli)

export default app
