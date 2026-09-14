const request = async (url, options={}) => {
  const response = await fetch(url, { headers:{'Content-Type':'application/json', ...(options.headers||{})}, ...options });
  if (!response.ok) { const body=await response.json().catch(()=>({})); const e=new Error(body.error||`Request failed (${response.status})`); e.fields=body.fields||{}; throw e; }
  return response.status===204 ? null : response.json();
};
export const api={
 listTickets:(p)=>request(`/api/tickets?${new URLSearchParams(p)}`),
 getTicket:(id)=>request(`/api/tickets/${id}`),
 createTicket:(d)=>request('/api/tickets',{method:'POST',body:JSON.stringify(d)}),
 updateTicket:(id,d)=>request(`/api/tickets/${id}`,{method:'PUT',body:JSON.stringify(d)}),
 deleteTicket:(id)=>request(`/api/tickets/${id}`,{method:'DELETE'}),
 customers:()=>request('/api/tickets/customers')
};
