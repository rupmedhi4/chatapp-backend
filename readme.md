password ko hash karne ke liye hum bcryptjs ka use karta hai 
1st -> npm i bcryptjs

import bcrypt from 'bcryptjs'

const hashPassword = await bcrypt.hash(password,10)

