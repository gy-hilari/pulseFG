const uniqid = require('uniqid');

function SessionController(db) {
    this.db = db;
}

SessionController.prototype.GetSessionsByCompId = function (compId) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                `SELECT _id as id, name, unitOfMeasure, createdAt
                FROM session WHERE comp = $id ORDER BY createdAt DESC
                `);
            stmt.all({ $id: compId }, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
            stmt.finalize();
        });
    });
}

SessionController.prototype.CreateSession = function (form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form');
        if (form.name) this.db.serialize(() => {
            let stmt = this.db.prepare(
                `INSERT INTO session (
                    _id,
                    name,
                    comp,
                    unitOfMeasure,
                    createdAt
                )
                VALUES (
                    $id,
                    $name,
                    $comp,
                    $unit,
                    $createdAt
                )`
            );
            let sessionId = uniqid('sn_');
            stmt.run({
                $id: sessionId,
                $name: form.name,
                $comp: form.compId,
                $unit: form.unit,
                $createdAt: new Date(Date.now()).toISOString()
            });
            stmt.finalize();
            resolve(`Session [${sessionId}] created successfully!`);
        });
    })
}

SessionController.prototype.DeleteSessionById = function (sessionId) {
    return new Promise((resolve, reject) => {
        let stmt = this.db.prepare(`DELETE FROM session WHERE _id = $id`);
        stmt.all({ $id: sessionId }, (err) => {
            if (err) reject(err);
            resolve(`Deleted session: [${sessionId}]`);
        });
        stmt.finalize();
    });
}

SessionController.prototype.DeleteSessionByCompId = function (compId) {
    return new Promise((resolve, reject) => {
        let stmt = this.db.prepare(`DELETE FROM session WHERE _id = $id`);
        stmt.all({ $id: compId }, (err) => {
            if (err) reject(err);
            resolve(`Deleted sessions from comp: [${compId}]`);
        });
        stmt.finalize();
    })
}

module.exports = {
    SessionController: SessionController
}