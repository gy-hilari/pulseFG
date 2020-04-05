exports.CheckOrCreateModels = (db) => {
    return new Promise((resolve, reject) => {
        let tables = [
            {
                tableName: 'comp',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' }
            },
            {
                tableName: 'session',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                comp: { foreignKey: false, string: 'TEXT NOT NULL' },
                compKey: { foreignKey: true, string: 'FOREIGN KEY (comp) REFERENCES comp(_id)' }
            },
            {
                tableName: 'pulsegraph',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                session: { foreignKey: false, string: 'TEXT NOT NULL' },
                sessionKey: { foreignKey: true, string: 'FOREIGN KEY (session) REFERENCES session(_id)' }
            },
            {
                /*
                    Make foreign key to session table,
                    pass down as props to match to DICTATE options for results field
                 */
                tableName: 'measurement',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                mode: { foreignKey: false, string: 'TEXT NOT NULL' },
                /*
                    MEASUREMENT NEEDS A MAX VALUE IN ORDER FOR BINARY PULSE TO SCALE CORRECTLY
                */                
                session: { foreignKey: false, string: 'TEXT NOT NULL' },
                sessionKey: { foreignKey: true, string: 'FOREIGN KEY (session) REFERENCES session(_id)' }
            },
            {
                tableName: 'match',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                results: { foreignKey: false, string: 'TEXT NOT NULL' },
                session: { foreignKey: false, string: 'TEXT NOT NULL' },
                sessionKey: { foreignKey: true, string: 'FOREIGN KEY (session) REFERENCES session(_id)' }
            },
            {
                tableName: 'widget_parameter',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                title: { foreignKey: false, string: 'TEXT NOT NULL' },
                imagePath: { foreignKey: false, string: 'TEXT' }, // IMAGES OPTIONAL
                match: { foreignKey: false, string: 'TEXT NOT NULL' },
                matchKey: { foreignKey: true, string: 'FOREIGN KEY (match) REFERENCES match(_id)' }
            },
            {
                tableName: 'widget_notebox',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                title: { foreignKey: false, string: 'TEXT NOT NULL' },
                text: { foreignKey: false, string: 'TEXT NOT NULL' },
                imagePath: { foreignKey: false, string: 'TEXT' }, // IMAGES OPTIONAL
                match: { foreignKey: false, string: 'TEXT NOT NULL' },
                matchKey: { foreignKey: true, string: 'FOREIGN KEY (match) REFERENCES match(_id)' }
            }
        ];

        db.serialize(() => {
            tables.forEach(t => {
                let sql =
                    `CREATE TABLE IF NOT EXISTS ${t.tableName} (
                    _id TEXT PRIMARY KEY,
                    `;

                let fields = Object.keys(t);
                for (let k = 0; k < fields.length; k++) {
                    if (fields[k] != 'tableName') {
                        sql += !t[fields[k]].foreignKey ? `${fields[k]} ${t[fields[k]].string}` : `${t[fields[k]].string}`;
                        if (k + 1 < fields.length) sql += `,
                        `;
                    }
                }
                sql += `
                )`;
                let stmt = db.prepare(sql);
                stmt.run(err => {
                    reject(err);
                });
                stmt.finalize();
            });
            resolve('Models created!');
        });
    });
}
