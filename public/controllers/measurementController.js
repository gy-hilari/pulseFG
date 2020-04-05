const uniqid = require('uniqid');

function MeasurementController(db) {
    this.db = db;
}

MeasurementController.prototype.GetMeasurementsBySessionId = function (sessionId) {
    console.log(`Getting measurements of session [${sessionId}]`)
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                `SELECT _id as id, name, mode, maximum, session, createdAt
                FROM measurement WHERE session = $id ORDER BY createdAt
                `);
            stmt.all({ $id: sessionId }, (err, session) => {
                if (err) reject(err);
                console.log(session);
                resolve(session);
            });
            stmt.finalize();
        });
    });

}

MeasurementController.prototype.CreateMeasurement = function (form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form');
        if (form.name) this.db.serialize(() => {
            let stmt = this.db.prepare(
                `INSERT INTO measurement (
                    _id,
                    name,
                    mode,
                    maximum,
                    session,
                    createdAt
                )
                VALUES (
                    $id,
                    $name,
                    $mode,
                    $maximum,
                    $session,
                    $createdAt
                )`
            );
            let measureId = uniqid('msr_');
            stmt.run({
                $id: measureId,
                $name: form.name,
                $mode: form.mode,
                $maximum: form.maximum,
                $session: form.sessionId,
                $createdAt: new Date(Date.now()).toISOString()
            });
            stmt.finalize();
            resolve(`Measurment [${measureId} created succsessfully!]`);
        });
    })
}

module.exports = {
    MeasurementController: MeasurementController
}