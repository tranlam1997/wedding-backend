const express = require("express");
const router = express.Router();
// database
let pool = require("../config/mysql");

router.get("/users", async function (req, res) {
	let sql = `SELECT * FROM user`;
	let [results] = await pool.query(sql, []);
	res.send({ error: false, data: results, message: "users list." });
});

// router.get("/user/:id", function (req, res) {
// 	let user_id = req.params.id;
// 	if (!user_id) {
// 		return res
// 			.status(400)
// 			.send({ error: true, message: "Please provide user_id" });
// 	}
// 	db.query(
// 		"SELECT * FROM users where id=?",
// 		user_id,
// 		function (error, results, fields) {
// 			if (error) throw error;
// 			return res.send({
// 				error: false,
// 				data: results[0],
// 				message: "users list.",
// 			});
// 		}
// 	);
// });

// router.post("/user", function (req, res) {
// 	let user = req.body.user;

// 	if (!user) {
// 		return res
// 			.status(400)
// 			.send({ error: true, message: "Please provide user" });
// 	}
// 	db.query(
// 		"INSERT INTO users SET ? ",
// 		[user],
// 		function (error, results, fields) {
// 			if (error) throw error;
// 			return res.send({
// 				error: false,
// 				data: results,
// 				message: "New user has been created successfully.",
// 			});
// 		}
// 	);
// });

// router.put("/user/:user_id", function (req, res) {
// 	let user_id = req.params.user_id;
// 	let user = req.body.user;

// 	if (!user_id || !user) {
// 		return res
// 			.status(400)
// 			.send({ error: user, message: "Please provide user and user_id" });
// 	}
// 	db.query(
// 		"UPDATE users SET ? WHERE id = ?",
// 		[user, user_id],
// 		function (error, results, fields) {
// 			if (error) throw error;
// 			return res.send({
// 				error: false,
// 				data: results,
// 				message: "user has been updated successfully.",
// 			});
// 		}
// 	);
// });

// router.delete("/user/:user_id", function (req, res) {
// 	let user_id = req.params.user_id;
// 	if (!user_id) {
// 		return res
// 			.status(400)
// 			.send({ error: true, message: "Please provide user_id" });
// 	}
// 	db.query(
// 		"DELETE FROM users WHERE id = ?",
// 		[user_id],
// 		function (error, results, fields) {
// 			if (error) throw error;
// 			return res.send({
// 				error: false,
// 				data: results,
// 				message: "User has been updated successfully.",
// 			});
// 		}
// 	);
// });

module.exports = router;