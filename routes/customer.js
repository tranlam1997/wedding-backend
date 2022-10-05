const express = require("express");
const router = express.Router();
// database
let pool = require("../config/mysql");

router.get("/", async function (req, res) {
	let sql = `
        SELECT 
            c.id, 
            c.name, 
            c.tel, 
            c.addr, 
            c.avatar, 
            c.email, 
            c.province_code, 
            c.district_code, 
            c.ward_code, 
            c.delegate_person, 
            c.delegate_mobile,
            c.company,
            c.note,
            p.name province_name,
            d.name district_name,
            w.name ward_name
        FROM Customer c
        LEFT JOIN provinces p
            ON c.province_code = p.code
        LEFT JOIN districts d
            ON d.code = c.district_code
        LEFT JOIN wards w
            ON w.code = c.ward_code
        WHERE 1
    `;
	let [results] = await pool.query(sql, []);
	res.send({ error: false, data: results, message: "customer list." });
});


router.get("/findByPhoneOrName", async function (req, res) {
    const q = req.query.q;

	if (q) {
		let sql = `
            SELECT 
                c.id, 
                c.name, 
                c.tel, 
                c.addr, 
                c.avatar, 
                c.email, 
                c.province_code, 
                c.district_code, 
                c.ward_code, 
                c.delegate_person, 
                c.delegate_mobile,
                c.company,
                c.note,
                p.name province_name,
                d.name district_name,
                w.name ward_name
            FROM Customer c
            LEFT JOIN provinces p
                ON c.province_code = p.code
            LEFT JOIN districts d
                ON d.code = c.district_code
            LEFT JOIN wards w
                ON w.code = c.ward_code
        `;

        sql += ` WHERE MATCH (c.name) AGAINST (? IN BOOLEAN MODE) LIMIT 20`
        // if(!isNaN(q)) {
        //     sql += ` WHERE c.tel = ? LIMIT 20`
        // } else {
        // }

		let [results] = await pool.query(sql, [q]);
		res.send({ error: false, data: results, message: "" });
	} else {
		res.send({ error: true, data: [], message: "Invalid parameters" });
	}
});


router.get("/:id", async function (req, res) {
	let { id } = req.params;
	let sql = `
        SELECT 
            c.id, 
            c.name, 
            c.tel, 
            c.addr, 
            c.avatar, 
            c.email, 
            c.province_code, 
            c.district_code, 
            c.ward_code, 
            c.delegate_person, 
            c.delegate_mobile,
            c.company,
            c.note,
            p.name province_name,
            d.name district_name,
            w.name ward_name
        FROM Customer c
        LEFT JOIN provinces p
            ON c.province_code = p.code
        LEFT JOIN districts d
            ON d.code = c.district_code
        LEFT JOIN wards w
            ON w.code = c.ward_code
        WHERE id = ?
    `;
	let [results] = await pool.query(sql, [id]);
	res.send({ error: false, data: results[0], message: "customer detailed." });
});
router.post("/", async function (req, res) {
	let {
		name = "",
		tel = "",
		addr,
		province_code,
		district_code,
		ward_code,
		avatar,
		email,
		delegate_person,
		delegate_mobile,
		note,
	} = req.body;

	if (!tel.trim()) {
		res.send({
			error: true,
			data: null,
			message: "Số điện thoại không hợp lệ!",
		});
		return;
	}
	if (!name.trim()) {
		res.send({ error: true, data: null, message: "Tên không được bỏ trống!" });
		return;
	}
	let insert_customer_sql = `INSERT INTO Customer (
        name,
		tel,
		addr,
		province_code,
		district_code,
		ward_code,
		avatar,
		email,
		delegate_person,
		delegate_mobile,
		note
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

	const connection = await pool.getConnection();

	try {
		let [{ insertId, affectedRows: insert_affected_rows }] =
			await connection.query(insert_customer_sql, [
				name,
				tel,
				addr,
				province_code,
				district_code,
				ward_code,
				avatar,
				email,
				delegate_person,
				delegate_mobile,
				note,
			]);

		if (insert_affected_rows === 0) {
			await connection.rollback();
			res.json({ status: false, message: "Failed to create new customer" });
			return;
		}

		res.json({
			status: true,
			msg: "success!",
			data: { id: insertId },
		});
	} catch (error) {
		await connection.rollback();
		res.json({
			status: false,
			message: error.message,
			error,
		});
	}
});

router.put("/:id", async function (req, res) {
	let { id } = req.params;
	let {
		name = "",
		tel = "",
		addr,
		province_code,
		district_code,
		ward_code,
		avatar,
		email,
		delegate_person,
		delegate_mobile,
		note,
	} = req.body;

	if (!tel.trim()) {
		res.send({
			error: true,
			data: null,
			message: "Số điện thoại không hợp lệ!",
		});
		return;
	}
	if (!name.trim()) {
		res.send({ error: true, data: null, message: "Tên không được bỏ trống!" });
		return;
	}

	//let update_cus_sql = `UPDATE Customer SET name = ?, addr = ?, tel = ?, note = ? WHERE id = ?`;
	let update_cus_sql = `UPDATE Customer SET name = ?, tel= ?, addr = ?, province_code = ?,
                                district_code = ?, ward_code = ?, avatar = ?, email = ?, delegate_person = ?, delegate_mobile = ?, note = ?
                                WHERE id = ?`;
    const connection = await pool.getConnection();
	if (id) {
		try {
			await pool.query(update_cus_sql, [
				name,
				tel,
				addr,
				province_code || null,
				district_code || null,
				ward_code || null,
				avatar,
				email,
				delegate_person,
				delegate_mobile,
				note,
				id,
			]);

			res.json({
				status: true,
				message: "success!",
			});
		} catch (error) {
			await connection.rollback();
            console.log(error.message)
			res.json({
				status: false,
				message: `Không thành công!`,
				error,
			});
		}
	}
});

module.exports = router;
