import { db } from '../src/db.js';

const allowedSort = new Set(['createdAt','updatedAt','priority','title','status','customerName']);
const priorityRank = { Low: 1, Medium: 2, High: 3 };

export function listTickets({ page=1, limit=10, search='', status='', priority='', customer='', sortBy='createdAt', sortOrder='desc' }) {
  const conditions = [];
  const params = {};
  if (search) { conditions.push('(LOWER(title) LIKE LOWER(@search) OR LOWER(customerName) LIKE LOWER(@search))'); params.search = `%${search}%`; }
  if (status) { conditions.push('status = @status'); params.status = status; }
  if (priority) { conditions.push('priority = @priority'); params.priority = priority; }
  if (customer) { conditions.push('customerName = @customer'); params.customer = customer; }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const safeSort = allowedSort.has(sortBy) ? sortBy : 'createdAt';
  const direction = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const order = safeSort === 'priority'
    ? `CASE priority WHEN 'High' THEN 3 WHEN 'Medium' THEN 2 ELSE 1 END ${direction}`
    : `${safeSort} ${direction}`;
  const total = db.prepare(`SELECT COUNT(*) AS count FROM tickets ${where}`).get(params).count;
  const offset = (page - 1) * limit;
  const rows = db.prepare(`SELECT * FROM tickets ${where} ORDER BY ${order}, id DESC LIMIT @limit OFFSET @offset`).all({ ...params, limit, offset });
  return { rows, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function findTicket(id) {
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
}

export function createTicket(data) {
  const now = new Date().toISOString();
  const result = db.prepare(`INSERT INTO tickets (customerName,title,description,priority,status,createdAt,updatedAt)
    VALUES (@customerName,@title,@description,@priority,@status,@now,@now)`).run({ ...data, now });
  return findTicket(result.lastInsertRowid);
}

export function updateTicket(id, data) {
  const current = findTicket(id);
  if (!current) return null;
  const next = {
    customerName: data.customerName ?? current.customerName,
    title: data.title ?? current.title,
    description: data.description ?? current.description,
    priority: data.priority ?? current.priority,
    status: data.status ?? current.status,
    updatedAt: new Date().toISOString(),
    id
  };
  db.prepare(`UPDATE tickets SET customerName=@customerName,title=@title,description=@description,
    priority=@priority,status=@status,updatedAt=@updatedAt WHERE id=@id`).run(next);
  return findTicket(id);
}

export function deleteTicket(id) {
  return db.prepare('DELETE FROM tickets WHERE id = ?').run(id).changes > 0;
}

export function customers() {
  return db.prepare('SELECT DISTINCT customerName FROM tickets ORDER BY customerName').all().map(x => x.customerName);
}

export { priorityRank };
