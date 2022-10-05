const express = require("express");
const router = express.Router();
// database
let pool = require("../config/mysql");

router.get("/provinces", async function (req, res) {
    
    let sql = `SELECT * FROM provinces`;
	let [results] = await pool.query(sql, []);
	res.send({ error: false, data: results, message: "provinces list." });
});


router.get("/provinces/:province_id/districts", async function (req, res) {
    let { province_id } = req.params;
    console.log(province_id)
    let sql = `SELECT * FROM districts WHERE province_code = ?`;
	let [results] = await pool.query(sql, [province_id]);
	res.send({ error: false, data: results, message: "districts list." });
});


router.get("/districts/:district_id/wards", async function (req, res) {
    let { district_id } = req.params;
    let sql = `SELECT * FROM wards WHERE district_code = ?`;
	let [results] = await pool.query(sql, [district_id]);
	res.send({ error: false, data: results, message: "wards list." });
});




module.exports = router