const express = require("express");
const router = express.Router();
// database
let pool = require("../config/mysql");

router.get("/", async function (req, res) {
    
    let sql = `SELECT * FROM Place`;
	let [results] = await pool.query(sql, []);
	res.send({ error: false, data: results, message: "place list." });
});

router.post('/', async function (req, res) {
    let { place } = req.body;
    const connection = await pool.getConnection();

    const { name } = place;

    let insert_sql = `INSERT INTO Place (name) VALUES (?)`

    try {

        let [{ insertId, affectedRows: insert_affected_rows }] = await connection.query(insert_sql, [name]);

        if (insert_affected_rows === 0) {
            await connection.rollback();
            res.json({ status: false, msg: "Failed to create new place" });
            return;
        }

        res.json({
            status: true,
            msg: "success!",
            data: { place_id: insertId }
        });
        
    } catch (error) {
        await connection.rollback();
        res.json({
            status: false,
            msg: error.message,
            error,
        });

    }
})

module.exports = router