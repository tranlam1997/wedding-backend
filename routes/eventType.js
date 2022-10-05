const express = require("express");
const router = express.Router();
// database
let pool = require("../config/mysql");

router.get("/", async function (req, res) {
    
    let sql = `SELECT * FROM EventType`;
	let [results] = await pool.query(sql, []);
	res.send({ error: false, data: results, message: "event type list." });
});

router.post('/', async function (req, res) {
    let { name, color } = req.body;
    const connection = await pool.getConnection();


    let insert_sql = `INSERT INTO EventType (name, color) VALUES (?, ?)`

    try {

        let [{ insertId, affectedRows: insert_affected_rows }] = await connection.query(insert_sql, [name, color]);

        if (insert_affected_rows === 0) {
            await connection.rollback();
            res.json({ status: false, msg: "Failed to create new event type" });
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