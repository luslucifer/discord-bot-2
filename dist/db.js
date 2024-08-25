"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const browser_1 = require("./browser");
// Open a database connection
class Db {
    constructor() {
        this.db = new sqlite3_1.default.Database("mydatabase.sqlite3", (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
            }
            else {
                console.log("Connected to the SQLite database.");
            }
        });
    }
    create_db() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.run(`CREATE TABLE IF NOT EXISTS sheet (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT,
          mavely TEXT 
        )`, (err) => {
                    if (err) {
                        console.error("Error creating table:", err.message);
                        reject(err);
                    }
                    else {
                        console.log("Table created or already exists.");
                        resolve();
                    }
                });
            });
        });
    }
    write(url, mavely) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO sheet (url, mavely) VALUES (?, ?)`, [url, mavely], function (err) {
                    if (err) {
                        console.error("Error inserting data:", err.message);
                        reject(err);
                    }
                    else {
                        console.log(`A row has been inserted with rowid ${this.lastID}`);
                        resolve();
                    }
                });
            });
        });
    }
    read(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.get(`SELECT * FROM sheet WHERE url = ?`, [url], (err, row) => {
                    if (err) {
                        console.error("Error reading data:", err.message);
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.run(`DELETE FROM sheet WHERE url = ?`, [url], function (err) {
                    if (err) {
                        console.error("Error deleting data:", err.message);
                        reject(err);
                    }
                    else {
                        console.log(`Row(s) deleted: ${this.changes}`);
                        resolve();
                    }
                });
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        console.error("Error closing the database:", err.message);
                        reject(err);
                    }
                    else {
                        console.log("Database connection closed.");
                        resolve();
                    }
                });
            });
        });
    }
    writeRow(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`writing record for ${url}`);
            const b = new browser_1.Browse();
            const mavely = yield b.main(url);
            yield this.write(url, mavely);
            return mavely;
        });
    }
    main(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.create_db();
            const row = yield this.read(url);
            if (row) {
                console.log('record found ');
                const link = row.mavely;
                return link;
                // let res = await fetch(link)
                //   let html = await res.text()
                //   let $  = cheerio.load(html)
                //   // console.log()
                //   const title = $('title').text().trim()
                //   if (title.startsWith('Robot')){
                //       // let res = await this.writeRow(url)
                //       return link
                //   }
                //   else {
                //       this.delete(url)
                //       let res = await this.writeRow(url)
                //       return res
                //   }
            }
            else {
                let res = yield this.writeRow(url);
                return res;
            }
        });
    }
}
exports.Db = Db;
// Example usage
