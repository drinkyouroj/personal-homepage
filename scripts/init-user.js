// Script to initialize the first admin user
// Usage: node scripts/init-user.js <email> <password> [name]

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || 'Admin'

  if (!email || !password) {
    console.error('Usage: node scripts/init-user.js <email> <password> [name]')
    process.exit(1)
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('User created successfully!')
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('User with this email already exists')
    } else {
      console.error('Error creating user:', error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

