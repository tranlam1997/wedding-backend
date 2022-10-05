const express = require('express');
const router = express.Router();
//file transfer
const multer = require('multer');
//image processing
const sharp = require('sharp');
//uuid
const { v4: uuidv4 } = require('uuid');

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('../utils/s3')

router.get('/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file
  console.log(file)

  // apply filter
  // resize 

  const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result)
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
})

module.exports = router;