const express = require('express');
const router = express.Router();
//file transfer
const multer = require('multer');
const upload = multer();
//image processing
const sharp = require('sharp');
//uuid
const { v4: uuidv4 } = require('uuid');

/**
 * @apiDefine Authorization
 * @apiHeader {String} AuthorizationAuthorization: `Bearer ${token}` needs to be set in the request headers, the token returned by successful login/registration.
 */

/**
 * @api {post} /upload/goods Upload product main image
 * @apiDescription Uploading a picture will automatically detect the picture quality, compress the picture, volume <2M, size (300~1500), store it in the goods folder
 * @apiName uploadGoods
 * @apiGroup Upload
 * @apiPermission admin
 *
 * @apiUse Authorization
 *
 * @apiBody {File} file File object;
 *
 * @apiSampleRequest /upload/goods
 *
 * @apiSuccess {String} lgImg Returns the 720 width image address
 * @apiSuccess {String} mdImg Returns the 360 width image address.
 */
router.post("/", upload.single('file'), async function(req, res) {
	//file type
	let { mimetype, size } = req.file;
	//Determine if it is a picture
	var reg = /^image\/\w+$/;
	var flag = reg.test(mimetype);
	if (!flag) {
		res.status(400).json({
			status: false,
			msg: "Format error, please select an image!"
		});
		return;
	}
	//Determine if the image size is less than 2M
	if (size >= 2 * 1024 * 1024) {
		res.status(400).json({
			status: false,
			msg: "The image size is too large, please compress the image!"
		});
		return;
	}
	// Get picture information
	var { width, format } = await sharp(req.file.buffer).metadata();
	// Interpret image size
	if (width < 300 || width > 1500) {
		res.status(400).json({
			status: false,
			msg: "Picture size 300-1500, please reprocess!"
		});
		return;
	}
	// Generate filename
	var filename = uuidv4();
	// save folder
	var fileFolder = "/images";
	//process images
	try {
		await sharp(req.file.buffer)
			.resize(720)
			.toFile("public" + fileFolder + filename + '_720.' + format);
		await sharp(req.file.buffer)
			.resize(360)
			.toFile("public" + fileFolder + filename + '_360.' + format);
		//Return to save result
		res.json({
			status: true,
			msg: "Image upload processing successfully!",
			lgImg: process.env.server + fileFolder + filename + '_720.' + format,
			mdImg: process.env.server + fileFolder + filename + '_360.' + format,
		});
	} catch (error) {
		res.json({
			status: false,
			msg: error,
		});
	}
});

/**
 * @api {post} /upload/slider Carousel upload API
 * @apiDescription Uploading a picture will automatically detect the picture quality, compress the picture, the volume is less than 2M, 
 * the size (300~1500) must be square, and store it in the goods folder
 * @apiName uploadSlider
 * @apiGroup Upload
 * @apiPermission admin
 *
 * @apiUse Authorization
 *
 * @apiBody {File} file File object;
 *
 * @apiSampleRequest /upload/slider
 *
 * @apiSuccess {String} src Returns the 720 width image address.
 */
router.post("/slider", upload.single('file'), async function(req, res) {
	//file type
	let { mimetype, size } = req.file;
	//Determine if it is a picture
	var reg = /^image\/\w+$/;
	var flag = reg.test(mimetype);
	if (!flag) {
		res.status(400).json({
			status: false,
			msg: "Format error, please select an image!"
		});
		return;
	}
	//Determine if the image size is less than 2M
	if (size >= 2 * 1024 * 1024) {
		res.status(400).json({
			status: false,
			msg: "The image size is too large, please compress the image!"
		});
		return;
	}
	// Get picture information
	var { width, height, format } = await sharp(req.file.buffer).metadata();
	// Determine image size
	if (width != height) {
		res.status(400).json({
			status: false,
			msg: "Image must be square, please upload again!"
		});
		return;
	}
	if (width < 300 || width > 1500) {
		res.status(400).json({
			status: false,
			msg: "Picture size 300-1500, please reprocess!"
		});
		return;
	}
	// Generate filename
	var filename = uuidv4();
	// save folder
	var fileFolder = "/images/goods/";
	// process images
	try {
		await sharp(req.file.buffer)
			.resize(720)
			.toFile("public" + fileFolder + filename + '_720.' + format);
		//Return to save result
		res.json({
			status: true,
			msg: "Image upload processing successfully!",
			src: process.env.server + fileFolder + filename + '_720.' + format,
		});
	} catch (error) {
		res.json({
			status: false,
			msg: error,
		});
	}
});
/**
 * @api {post} /upload/editor Rich text editor image upload
 * @apiDescription Uploading a picture will automatically detect the picture quality, compress the picture, the volume is less than 2M, 
 * and the size is not limited, and it will be stored in the details folder
 * @apiName UploadEditor
 * @apiGroup Upload
 * @apiPermission admin
 *
 * @apiUse Authorization
 *
 * @apiBody {File} file FFile object;
 *
 * @apiSampleRequest /upload/editor
 *
 * @apiSuccess {String[]} data return image address.
 */
router.post("/editor", upload.single('file'), async function(req, res) {
	//file type
	let { mimetype, size } = req.file;
	//Determine if it is a picture
	var reg = /^image\/\w+$/;
	var flag = reg.test(mimetype);
	if (!flag) {
		res.json({
			errno: 1,
			msg: "Format error, please select an image!"
		});
		return;
	}
	//Determine if the image size is less than 2M
	if (size >= 2 * 1024 * 1024) {
		res.json({
			errno: 1,
			msg: "The image size is too large, please compress the image!"
		});
		return;
	}
	//extension name
	var { format } = await sharp(req.file.buffer).metadata();
	// Generate filename
	var filename = uuidv4();
	//save folder
	var fileFolder = "/images/details/";
	//process images
	try {
		await sharp(req.file.buffer).toFile("public" + fileFolder + filename + '.' + format);
		//Return to save result
		res.json({
			errno: 0,
			msg: "Image upload processing successfully!",
			data: {
				url: process.env.server + fileFolder + filename + '.' + format,
			},
		});
	} catch (error) {
		res.json({
			errno: 1,
			msg: error,
		});
	}
});

module.exports = router;
