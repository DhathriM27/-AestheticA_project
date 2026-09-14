import { useEffect,useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal'; import { api } from '../services/api';
const fmt=d=>new Date(d).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
export default function TicketDetail({id,onClose,onEdit,onDeleted}){
 const [ticket,setTicket]=useState(null); const [error,setError]=useState(''); const [loading,setLoading]=useState(true);
 useEffect(()=>{setLoading(true);api.getTicket(id).then(setTicket).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[id]);
 const remove=async()=>{if(!confirm('Delete this ticket? This cannot be undone.'))return;try{await api.deleteTicket(id);onDeleted()}catch(e){setError(e.message)}};
 return <Modal title={ticket?`Ticket #${ticket.id}`:'Ticket details'} onClose={onClose} wide>{loading?<div className="center-state">Loading ticket…</div>:error?<div className="error-state">{error}</div>:ticket&&<div className="detail"><div className="detail-top"><div><span className={`pill priority-${ticket.priority.toLowerCase()}`}>{ticket.priority} priority</span><span className={`pill status-${ticket.status.toLowerCase().replaceAll(' ','-')}`}>{ticket.status}</span><h3>{ticket.title}</h3><p className="customer">{ticket.customerName}</p></div><div className="detail-actions"><button className="btn secondary" onClick={()=>onEdit(ticket)}><Pencil size={16}/> Edit</button><button className="btn danger" onClick={remove}><Trash2 size={16}/> Delete</button></div></div><div className="description"><h4>Description</h4><p>{ticket.description}</p></div><div className="metadata"><div><span>Created</span><strong>{fmt(ticket.createdAt)}</strong></div><div><span>Last updated</span><strong>{fmt(ticket.updatedAt)}</strong></div><div><span>Ticket ID</span><strong>#{ticket.id}</strong></div></div></div>}</Modal>
}
