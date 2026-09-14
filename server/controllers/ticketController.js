import * as model from '../models/ticketModel.js';

const priorities = ['Low','Medium','High'];
const statuses = ['Open','In Progress','Resolved','Closed'];

function validateId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateTicket(body, partial=false) {
  const errors = {};
  const required = ['customerName','title','description','priority','status'];
  if (!partial) for (const field of required) if (typeof body[field] !== 'string' || !body[field].trim()) errors[field] = 'This field is required.';
  for (const field of ['customerName','title','description']) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || !body[field].trim())) errors[field] = 'Must be a non-empty string.';
    if (typeof body[field] === 'string' && body[field].trim().length > 5000) errors[field] = 'Must be 5000 characters or fewer.';
  }
  if (body.priority !== undefined && !priorities.includes(body.priority)) errors.priority = `Must be one of: ${priorities.join(', ')}.`;
  if (body.status !== undefined && !statuses.includes(body.status)) errors.status = `Must be one of: ${statuses.join(', ')}.`;
  return errors;
}

export function getTickets(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit || '10', 10)));
    const result = model.listTickets({ page, limit, search: String(req.query.search || '').trim(), status: req.query.status || '', priority: req.query.priority || '', customer: req.query.customer || '', sortBy: req.query.sortBy || 'createdAt', sortOrder: req.query.sortOrder || 'desc' });
    res.json(result);
  } catch (err) { next(err); }
}

export function getTicket(req, res, next) {
  try {
    const id = validateId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid ticket ID.' });
    const ticket = model.findTicket(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    res.json(ticket);
  } catch (err) { next(err); }
}

export function createTicket(req, res, next) {
  try {
    const errors = validateTicket(req.body || {});
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', fields: errors });
    res.status(201).json(model.createTicket({
      customerName: req.body.customerName.trim(), title: req.body.title.trim(), description: req.body.description.trim(), priority: req.body.priority, status: req.body.status
    }));
  } catch (err) { next(err); }
}

export function updateTicket(req, res, next) {
  try {
    const id = validateId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid ticket ID.' });
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Request body cannot be empty.' });
    const errors = validateTicket(req.body, true);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', fields: errors });
    const payload = { ...req.body };
    for (const f of ['customerName','title','description']) if (payload[f] !== undefined) payload[f] = payload[f].trim();
    const ticket = model.updateTicket(id, payload);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    res.json(ticket);
  } catch (err) { next(err); }
}

export function deleteTicket(req, res, next) {
  try {
    const id = validateId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid ticket ID.' });
    if (!model.deleteTicket(id)) return res.status(404).json({ error: 'Ticket not found.' });
    res.status(204).send();
  } catch (err) { next(err); }
}

export function getCustomers(req, res, next) {
  try { res.json(model.customers()); } catch (err) { next(err); }
}
