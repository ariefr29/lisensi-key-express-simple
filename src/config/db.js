const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');

// Wrapper functions to make it synchronous-like with callbacks
const dbWrapper = {
    prepare: (sql) => {
        return {
            get: (params, callback) => {
                if (typeof params === 'function') {
                    callback = params;
                    params = [];
                }
                return new Promise((resolve, reject) => {
                    db.get(sql, params, (err, row) => {
                        if (err) reject(err);
                        else resolve(callback ? callback(err, row) : row);
                    });
                });
            },
            all: (params, callback) => {
                if (typeof params === 'function') {
                    callback = params;
                    params = [];
                }
                return new Promise((resolve, reject) => {
                    db.all(sql, params, (err, rows) => {
                        if (err) reject(err);
                        else resolve(callback ? callback(err, rows) : rows);
                    });
                });
            },
            run: (params, callback) => {
                if (typeof params === 'function') {
                    callback = params;
                    params = [];
                }
                return new Promise((resolve, reject) => {
                    db.run(sql, params, function (err) {
                        if (err) reject(err);
                        else resolve(callback ? callback(err, { lastID: this.lastID, changes: this.changes }) : { lastID: this.lastID, changes: this.changes });
                    });
                });
            }
        };
    },
    exec: (sql, callback) => {
        return new Promise((resolve, reject) => {
            db.exec(sql, (err) => {
                if (err) reject(err);
                else resolve(callback ? callback(err) : true);
            });
        });
    },
    run: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(callback ? callback(err, this) : this);
            });
        });
    },
    close: () => {
        db.close();
    },
    pragma: (pragma) => {
        db.run(`PRAGMA ${pragma}`);
    }
};

module.exports = dbWrapper;
