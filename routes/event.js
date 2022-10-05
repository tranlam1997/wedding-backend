const express = require("express");
const router = express.Router();
// database
let pool = require("../config/mysql");

router.get("/", async function (req, res) {
	let sql = `SELECT a.id, a.title, a.guest_estimate, a.start_time, a.end_time, a.deposit, a.checklist,
	        b.name as type_name, b.id as type_id, c.name place_name, c.id place_id, 
			cus.id customer_id, cus.addr, cus.name customer_name, cus.note, cus.tel
	
            FROM Event a 
            LEFT JOIN EventType b 
                ON a.type_id = b.id
            LEFT JOIN Place c 
                ON c.id = a.place_id
			LEFT JOIN Customer cus
				ON a.customer_id = cus.id
            WHERE 1
    `;
	let [results] = await pool.query(sql, []);
	res.send({ error: false, data: results, message: "event list." });
});

//Add event
router.post("/", async function (req, res) {
	const connection = await pool.getConnection();

	let { event, customer } = req.body;
	let {
		title,
		guestEstimate,
		startTime,
		endTime,
		typeId,
		placeId,
		deposit,
		checklist,
	} = event;

	let { customerId, customerName, addr, tel, note } = customer;

	let cusId = customerId;
	let insert_event_sql = `INSERT INTO Event (title, guest_estimate, start_time, end_time, type_id, place_id, deposit,checklist, customer_id) VALUES (?,?,?,?,?,?,?,?,?)`;
	try {
		if (cusId) {
			let update_cus_sql = `UPDATE Customer SET name = ?, addr = ?, tel = ?, note = ? WHERE id = ?`;
			await pool.query(update_cus_sql, [customerName, addr, tel, note, cusId]);
		} else if (customerName && tel) {
			let insert_customer_sql = `INSERT INTO Customer (name, tel, addr, note) VALUES (?,?,?,?)`;

			let [{ insertId: newCusId, affectedRows: insert_affected_rows }] =
				await connection.query(insert_customer_sql, [
					customerName,
					tel,
					addr,
					note,
				]);
			cusId = newCusId;
		}

		if (cusId) {
			let [{ insertId, affectedRows: insert_affected_rows }] =
				await connection.query(insert_event_sql, [
					title,
					guestEstimate,
					startTime,
					endTime,
					typeId,
					placeId,
					deposit,
					checklist,
					cusId,
				]);

			if (insert_affected_rows === 0) {
				await connection.rollback();
				res.json({ status: false, msg: "Failed to create new event！" });
				return;
			}

			res.json({
				status: true,
				message: "success!",
				data: { event_id: insertId },
			});
		}
	} catch (error) {
		await connection.rollback();
		res.json({
			status: false,
			message: error.message,
			error,
		});
	}
});

//update event
router.put("/:id", async function (req, res) {
	const connection = await pool.getConnection();

	let { id } = req.params;
	let { event, customer } = req.body;
	let {
		title,
		guestEstimate,
		startTime,
		endTime,
		typeId,
		placeId,
		deposit,
		checklist,
	} = event;

	let { customerId, customerName, addr, tel, note } = customer;

	let update_event_sql = `UPDATE Event SET title = ?, guest_estimate = ?, 
					start_time = ?, end_time = ?, type_id = ?, 
					place_id = ?, deposit = ?, checklist = ?,
					customer_id = ?
					 WHERE id = ?`;

	try {
		let cusId = customerId;
		if (cusId) {
			let update_cus_sql = `UPDATE Customer SET name = ?, addr = ?, tel = ?, note = ? WHERE id = ?`;
			await pool.query(update_cus_sql, [customerName, addr, tel, note, cusId]);
		} else {
			if (customerName && tel) {
				let insert_customer_sql = `INSERT INTO Customer (name, tel, addr, note) VALUES (?,?,?,?)`;
				let [{ insertId: newCusId, affectedRows: insert_affected_rows }] =
					await connection.query(insert_customer_sql, [
						customerName,
						tel,
						addr,
						note,
					]);
				cusId = newCusId;
			}
		}

		let [{ affectedRows }] = await pool.query(update_event_sql, [
			title,
			guestEstimate,
			startTime,
			endTime,
			typeId,
			placeId,
			deposit,
			checklist,
			cusId,
			id,
		]);
		// fail to edit
		if (affectedRows === 0) {
			res.json({
				status: false,
				message: "Failed to modify!",
			});
			return;
		}
		// Successfully modified
		res.json({
			status: true,
			message: "Successfully modified!",
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

router.delete("/:id", async function (req, res) {
	let { id } = req.params;
	// get a connection
	const connection = await pool.getConnection();
	try {
		// open transaction
		await connection.beginTransaction();

		let delete_event_sql = `DELETE FROM Event WHERE id = ?`;
		let [{ affectedRows }] = await connection.query(delete_event_sql, [id]);
		if (affectedRows === 0) {
			await connection.rollback();
			res.json({ status: false, message: "Delete event failed！" });
			return;
		}

		await connection.commit();
		res.json({
			status: true,
			message: "successfully delete event!",
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

module.exports = router;
