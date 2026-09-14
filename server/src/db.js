import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve('data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, 'tickets.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN ('Low','Medium','High')),
    status TEXT NOT NULL DEFAULT 'Open' CHECK(status IN ('Open','In Progress','Resolved','Closed')),
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
  CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customerName);
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM tickets').get().count;
if (count === 0) {
  const now = new Date().toISOString();
  const insert = db.prepare(`INSERT INTO tickets
    (customerName,title,description,priority,status,createdAt,updatedAt)
    VALUES (?,?,?,?,?,?,?)`);
  const seed = [
    ['Acme Industries','Printer not connecting','The finance team printer cannot be reached from the office network.','High','Open',now,now],
    ['Greenfield Retail','POS software update','Please help install the latest POS update on three billing terminals.','Medium','In Progress',now,now],
    ['Northstar Logistics','Password reset request','User is unable to access the logistics dashboard after a password expiry.','Low','Resolved',now,now],
    ['BluePeak Foods','Invoice export failure','Monthly invoice export produces an empty CSV file.','High','Open',now,now],
    ['Acme Industries','VPN access issue','Remote employee receives a connection timeout when starting the VPN.','Medium','Closed',now,now]
  ];
  for (const row of seed) insert.run(...row);
}
