import express from 'express'
import multer from 'multer'
import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'

const app = express()
const upload = multer({ dest: 'uploads/' })

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

app.post('/generate', upload.single('drawing'), async (req, res) => {
  const form = new FormData()
  const imageStream = fs.createReadStream(req.file.path)

  form.append("version", "a-controlnet-model-version-id")
  form.append("input", JSON.stringify({
    image: imageStream,
    prompt: "Photorealistic toy version of this drawing..."
  }))

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${REPLICATE_API_TOKEN}`
    },
    body: form
  })

  const data = await response.json()
  res.json(data)
})

app.listen(3000, () => console.log("Running on port 3000"))


