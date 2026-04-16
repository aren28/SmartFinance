import { prisma } from './db'

describe('DB接続テスト', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('Prismaクライアントが正常に初期化される', () => {
    expect(prisma).toBeDefined()
  })
})
