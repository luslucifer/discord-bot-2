import sqlite3 from "sqlite3";
import { Browse } from "./browser";
import * as cheerio  from "cheerio"
// Open a database connection
export class Db {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("mydatabase.sqlite3", (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    });
  }

  async create_db(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS sheet (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT,
          mavely TEXT 
        )`,
        (err) => {
          if (err) {
            console.error("Error creating table:", err.message);
            reject(err);
          } else {
            console.log("Table created or already exists.");
            resolve();
          }
        }
      );
    });
  }

  async write(url: string, mavely: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO sheet (url, mavely) VALUES (?, ?)`,
        [url, mavely],
        function (err) {
          if (err) {
            console.error("Error inserting data:", err.message);
            reject(err);
          } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            resolve();
          }
        }
      );
    });
  }

  async read(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM sheet WHERE url = ?`,
        [url],
        (err, row) => {
          if (err) {
            console.error("Error reading data:", err.message);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async delete(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM sheet WHERE url = ?`,
        [url],
        function (err) {
          if (err) {
            console.error("Error deleting data:", err.message);
            reject(err);
          } else {
            console.log(`Row(s) deleted: ${this.changes}`);
            resolve();
          }
        }
      );
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error("Error closing the database:", err.message);
          reject(err);
        } else {
          console.log("Database connection closed.");
          resolve();
        }
      });
    });
  }

async writeRow(url:string){
    console.log(`writing record for ${url}`)
    const b = new Browse();
    const mavely: any = await b.main(url);
    await this.write(url, mavely);
    return mavely;
}

  async main(url: string): Promise<string> {
    await this.create_db();
    const row = await this.read(url);
    if (row) {
        console.log('record found ')
      const link =  row.mavely
      return link
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
         

    } else {
      let res  = await this.writeRow(url)
      return res 
    }
  }
}

// Example usage
