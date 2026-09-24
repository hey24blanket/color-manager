import {openDB, type IDBPDatabase} from 'idb';
import {blank,validate,type Workspace} from './domain.ts';
export type Snapshot={id:string,time:string,data:Workspace};
let db:IDBPDatabase;
export async function init(){db=await openDB('color-manager',1,{upgrade(d){d.createObjectStore('state');d.createObjectStore('history',{keyPath:'id'})}});const value=await db.get('state','workspace');if(value&&(!Array.isArray(value.groups)||value.schemaVersion!==1))throw Error('corrupt');return value??blank()}
export async function read(){return await db.get('state','workspace')??blank()}
export async function commit(base:Workspace,desired:Workspace,forceSnapshot=false){const tx=db.transaction(['state','history'],'readwrite');const state=tx.objectStore('state');const current:Workspace=await state.get('workspace')??blank();
// Serialize per-database transaction and merge independent group changes. Same-group conflicts never overwrite.
const next=structuredClone(current);const oldMap=new Map(base.groups.map(g=>[g.id,g])),newMap=new Map(desired.groups.map(g=>[g.id,g]));
try{for(const id of new Set([...oldMap.keys(),...newMap.keys()])){const old=oldMap.get(id),want=newMap.get(id);if(JSON.stringify(old)===JSON.stringify(want))continue;const now=current.groups.find(g=>g.id===id);if(JSON.stringify(old)!==JSON.stringify(now))throw Error('conflict');if(!want)next.groups=next.groups.filter(g=>g.id!==id);else {const n={...want,version:(now?.version??0)+1};const i=next.groups.findIndex(g=>g.id===id);if(i<0)next.groups.push(n);else next.groups[i]=n}}
const order=(w:Workspace)=>w.groups.map(g=>g.id).join(',');if(order(base)!==order(desired)){if(order(current)!==order(base))throw Error('conflict');next.groups=desired.groups.map(g=>next.groups.find(x=>x.id===g.id)!)}
validate(next);next.revision=current.revision+1;next.updatedAt=new Date().toISOString();const hist=tx.objectStore('history');const all:Snapshot[]=await hist.getAll();all.sort((a,b)=>b.time.localeCompare(a.time));if(forceSnapshot||!all[0]||Date.now()-Date.parse(all[0].time)>30000){const snap={id:crypto.randomUUID(),time:new Date().toISOString(),data:current};await hist.put(snap);all.unshift(snap)}let bytes=0;for(let i=0;i<all.length;i++){bytes+=new Blob([JSON.stringify(all[i])]).size;if(i>=20||bytes>10*1024**2)await hist.delete(all[i].id)}await state.put(next,'workspace');await tx.done;return next}catch(e){tx.abort();await tx.done.catch(()=>{});throw e}}
export async function history(){return (await db.getAll('history') as Snapshot[]).sort((a,b)=>b.time.localeCompare(a.time))}
export async function deleteSnapshot(id:string){await db.delete('history',id)}
export async function rawBackup(){return await db.get('state','workspace')}
