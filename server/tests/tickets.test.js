import test, { beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/db.js';
import * as model from '../models/ticketModel.js';

beforeEach(() => db.exec('DELETE FROM tickets'));
after(() => db.close());

const ticket = { customerName:'Test Customer', title:'Login issue', description:'Cannot log in', priority:'High', status:'Open' };

test('creates and retrieves a ticket', () => {
  const created = model.createTicket(ticket);
  assert.equal(created.customerName, 'Test Customer');
  assert.equal(model.findTicket(created.id).title, 'Login issue');
});

test('filters and searches tickets', () => {
  model.createTicket(ticket);
  model.createTicket({ ...ticket, customerName:'Other Co', title:'Printer issue', priority:'Low' });
  assert.equal(model.listTickets({search:'printer'}).total, 1);
  assert.equal(model.listTickets({priority:'High'}).total, 1);
});

test('updates and deletes a ticket', () => {
  const created = model.createTicket(ticket);
  const updated = model.updateTicket(created.id, { status:'Resolved' });
  assert.equal(updated.status, 'Resolved');
  assert.equal(model.deleteTicket(created.id), true);
  assert.equal(model.findTicket(created.id), undefined);
});
