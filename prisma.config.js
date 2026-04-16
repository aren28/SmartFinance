const path = require('path')
require('dotenv').config()

module.exports = {
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
}
