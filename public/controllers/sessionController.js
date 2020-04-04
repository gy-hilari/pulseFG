const uniqid = require('uniqid');

function SessionController(db) {
    this.db = db;
}

SessionController.prototype.GetSessionsByCompId = function (compId) {
    console.log(compId);
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

SessionController.prototype.GetSessionById = function (sessionId) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                `SELECT _id as id, name, unitOfMeasure, createdAt
                FROM session WHERE _id = $id
                `);
            stmt.get({ $id: sessionId }, (err, session) => {
                if (err) reject(err);
                resolve(session);
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

SessionController.prototype.UpdateSessionNameById = function (form) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                ` UPDATE session SET name = $name
                WHERE _id = $id
                `);
            stmt.all({ $id: form.sessionId, $name: form.name }, (err) => {
                if (err) reject(err);
                resolve(`Successfully edited session [${form.sessionId}] name to [${form.name}]`);
            });
            stmt.finalize();
        });
    });
}

module.exports = {
    SessionController: SessionController
}