const uniqid = require('uniqid');

function MatchController(db) {
    this.db = db;
}

MatchController.prototype.GetMatchById = function (matchId) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                `SELECT _id as id, name, json_extract(results, '$') as results, session, createdAt
                FROM match WHERE _id = $id
                `);
            stmt.get({ $id: matchId }, (err, match) => {
                if (err) reject(err);
                resolve(match);
            });
            stmt.finalize();
        });
    });
}

MatchController.prototype.GetMatchesBySessionId = function (sessionId) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                `SELECT _id as id, name, json_extract(results, '$') as results, session, createdAt
                FROM match WHERE session = $id ORDER BY createdAt
                `);
            stmt.all({ $id: sessionId }, (err, matches) => {
                if (err) reject(err);
                console.log(matches);
                resolve(matches);
            });
            stmt.finalize();
        });
    });
}

MatchController.prototype.CreateMatch = function (form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form');
        if (form.name) this.db.serialize(() => {
            let stmt = this.db.prepare(
                `INSERT INTO match (
                    _id,
                    name,
                    results,
                    session,
                    createdAt
                )
                VALUES (
                    $id,
                    $name,
                    $results,
                    $session,
                    $createdAt
                )`
            );
            let matchId = uniqid('mtc_');
            stmt.run({
                $id: matchId,
                $name: form.name,
                $results: JSON.stringify(form.results),
                $session: form.sessionId,
                $createdAt: new Date(Date.now()).toISOString()
            });
            stmt.finalize();
            resolve(`match [${matchId}] created successfully!`);
        });
    })

}

MatchController.prototype.DeleteMatchById = function (matchId) {
    return new Promise((resolve, reject) => {
        let stmt = this.db.prepare(`DELETE FROM match WHERE _id = $id`);
        stmt.all({ $id: matchId }, (err) => {
            if (err) reject(err);
            resolve(`Deleted match: [${matchId}]`);
        });
        stmt.finalize();
    });
}

module.exports = {
    MatchController: MatchController
}