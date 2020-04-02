const uniqid = require('uniqid');

function Controller(db) {
    this.db = db;
}

Controller.prototype.GetCompendiums = function () {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            this.db.all(`SELECT _id as id, name, createdAt FROM comp ORDER BY createdAt DESC`, (err, comps) => {
                if (err) reject(err);
                resolve(comps);
            });
        });
    });
}

Controller.prototype.GetCompendiumById = function (compId) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                `SELECT _id as id, name
                FROM comp WHERE id = $id
                `);

            stmt.get({ $id: compId }, (err, comp) => {
                if (err) reject(err);
                resolve(comp);
            });
            stmt.finalize();
        });
    })
}

Controller.prototype.CreateCompendium = function (form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form!');
        if (form.name) this.db.serialize(() => {
            let stmt = this.db.prepare(
                `INSERT INTO comp (
                    _id,
                    name,
                    createdAt
                )
                VALUES (
                    $id,
                    $name,
                    $createdAt
                )`
            );
            let compId = uniqid('cmp_');
            stmt.run({
                $id: compId,
                $name: form.name,
                $createdAt: new Date(Date.now()).toISOString()
            });
            stmt.finalize();
            resolve(`Compendium [${compId}] created successfully!`);
        });
    });
}

Controller.prototype.DeleteCompendiumById = function (compId) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(`DELETE FROM comp WHERE _id = $id`);
            stmt.all({ $id: compId }, (err) => {
                if (err) reject(err);
                resolve(`Deleted compendium [${compId}]`);
            });
            stmt.finalize();
        });
    });
}

Controller.prototype.UpdateCompendiumById = function (form) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            let stmt = this.db.prepare(
                ` UPDATE comp SET name = $name
                WHERE _id = $id
                `);
            stmt.all({ $id: form.id, $name: form.name }, (err) => {
                if (err) reject(err);
                resolve(`Successfully edited comp [${form.id}] name to [${form.name}]`);
            });
            stmt.finalize();
        });
    });
}

module.exports = {
    Controller: Controller
}