// require('dotenv').config() dung cai nay neu su dung process.env.XXX
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = "springsocialstorage"
const region = "ap-southeast-1"
const accessKeyId = "AKIAVA2D7TWXGHJ6WWAY"
const secretAccessKey = "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"

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream