import express from 'express'
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(__dirname))

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(
    `Server listening on http://localhost:${port}/examples, Ctrl+C to stop`
  )
})
