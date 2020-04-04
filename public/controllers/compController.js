const uniqid = require('uniqid');

function CompController(db) {
    this.db = db;
}

CompController.prototype.GetCompendiums = function () {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            this.db.all(`SELECT _id as id, name, createdAt FROM comp ORDER BY createdAt DESC`, (err, comps) => {
                if (err) reject(err);
                resolve(comps);
            });
        });
    });
}

CompController.prototype.GetCompendiumById = function (compId) {
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

CompController.prototype.CreateCompendium = function (form) {
    return new Promise((resolve, reject) => {
        if (!form.name) {console.log('rejected!'); reject('Invalid form!')};
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

CompController.prototype.DeleteCompendiumById = function (compId) {
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

CompController.prototype.UpdateCompendiumById = function (form) {
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
    CompContoller: CompController
}