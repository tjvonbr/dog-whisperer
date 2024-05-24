import prisma from '@/server/prisma'

async function getUserById(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  })

  return user
}

export { getUserById }
