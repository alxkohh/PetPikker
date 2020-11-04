const pool = require('../db');

// POST api at router
async function createAdmin(ctx) {
    const { username, password } = ctx.params;

    try {
        const sqlQuery = `INSERT INTO admins VALUES ('${username}', '${password}');`;
        await pool.query(sqlQuery);
        ctx.body = {
            'username' : username,
            'password' : password
        };
    } catch (e) {
        console.log(e);
        ctx.status = 403;
    }
}

// PATCH api at router
async function changeAdminUsername(ctx) {
    const { username, newusername } = ctx.param;

    try {
        const sqlQuery = `UPDATE admins SET username = '${newusername}' WHERE username = '${username}'`;
        await pool.query(sqlQuery);
        ctx.body = {
            'newusername' : newusername
        };
    } catch (e) {
        console.log(e);
        ctx.status = 403;
    }
}

// PATCH api at router
async function changeAdminPassword(ctx) {
    const { username, password, newpassword } = ctx.params;

    try {
        const sqlQuery = `UPDATE admins SET pw = '${newpassword}' WHERE username = '${username} AND pw = ${password}'`;
        await pool.query(sqlQuery);
        ctx.body = {
            'newpassword' : newpassword
        };
    } catch (e) {
        console.log(e);
        ctx.status = 403;
    }
}

// POST api at router
async function adminLogin(ctx) {
    const { username, password } = ctx.params;

    try {
        const sqlQuery = `SELECT COUNT(username) FROM admins WHERE username = '${username}' AND pw = '${password}'`;
        const resultObject = await pool.query(sqlQuery);
        const rows = resultObject.rows;
        const onlyRow = rows[0];

        const count = onlyRow.count;

        if (count == 1) {
            ctx.status = 204;
        } else {
            ctx.status = 403;
        }

    } catch (e) {
        console.log(e);
        ctx.status = 403;
    }
}

module.exports = {
    createAdmin,
    changeAdminUsername,
    changeAdminPassword,
    adminLogin
};
