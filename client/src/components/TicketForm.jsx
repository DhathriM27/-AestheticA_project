import { useState } from 'react';
const initial={customerName:'',title:'',description:'',priority:'Medium',status:'Open'};
export default function TicketForm({ticket,onSubmit,onCancel,loading}){
 const [form,setForm]=useState(ticket||initial); const [error,setError]=useState('');
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault(); setError(''); try{await onSubmit(form)}catch(err){setError(err.message)}};
 return <form onSubmit={submit} className="ticket-form">
  {error&&<div className="form-error">{error}</div>}
  <label>Customer name<input name="customerName" value={form.customerName} onChange={change} placeholder="e.g. Acme Industries" maxLength="120" required/></label>
  <label>Title<input name="title" value={form.title} onChange={change} placeholder="Brief issue title" maxLength="160" required/></label>
  <label>Description<textarea name="description" value={form.description} onChange={change} rows="5" placeholder="Describe the service request..." maxLength="5000" required/></label>
  <div className="form-grid"><label>Priority<select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Status<select name="status" value={form.status} onChange={change}><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></label></div>
  <div className="form-actions"><button type="button" className="btn secondary" onClick={onCancel}>Cancel</button><button className="btn primary" disabled={loading}>{loading?'Saving…':ticket?'Save changes':'Create ticket'}</button></div>
 </form>
}
