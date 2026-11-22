'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const msg=(id,t,ok)=>{const e=$(id);e.textContent=t;e.classList.toggle('ok',!!ok)};
const S={role:false,profile:null,type:'est',step:0,alt:false,tk:null,filter:'all',bl:new Set(),refs:[],timer:null,fl:5,
 occ:[{n:'Carlos A.',t:'PMR',z:2,r:3,s:'p'},{n:'Isabel D.',t:'AM',z:4,r:2,s:'p'},{n:'Ocupante P3-07',t:'PMR',z:3,r:1,s:'p'},{n:'Ocupante P5-02',t:'AM',z:1,r:1,s:'s'},{n:'Ocupante P2-11',t:'PMR',z:5,r:1,s:'s'}]};
const RT={est:[['Sal de la sala por la puerta norte',10],['Gira a la izquierda',5],['Baja por la escalera A',20],['Sal al patio norte',8]],
 acc:[['Sal de la sala por la puerta norte',10],['Gira a la izquierda',5],['Avanza por la rampa oeste',12],['Llega a la zona de refugio B',8]]};
const ALT={est:[['Regresa al pasillo',6],['Gira a la derecha',5],['Baja por la escalera B',20],['Sal al patio norte',8]],
 acc:[['Regresa al pasillo',6],['Gira a la derecha',5],['Avanza por la rampa este',14],['Llega a la zona de refugio B',8]]};
const PACE={est:60,mu:25,sr:35}, RISK={3:'Crítico',2:'Alto',1:'Medio'};
const route=()=>(S.alt?ALT:RT)[S.type==='est'?'est':'acc'];

/* HU14 gravedad por zonas */
function gravedad(d,w){const h=[1,2,3,4,5].map(i=>{const c=i===d?'d':i===w?'w':'s';
 const t=c==='d'?'⛔ Peligro: no pasar':c==='w'?'▲ Precaución':'✓ Seguro';return `<div class="z ${c}"><b>Zona ${i}</b><br>${t}</div>`}).join('');$('#gravedad').innerHTML=h}
/* HU09, HU10, HU11 */
function alerta(tit,txt){$('#p-tit').textContent=tit;$('#p-txt').textContent=txt;$('#p-acc').hidden=false;$('#pantalla').focus()}
$('#b-sismo').onclick=()=>{clearInterval(S.timer);let n=5;alerta('Sismo detectado · magnitud 6.4','Mantén la calma. Ve primero a la zona segura del piso.');
 const t=()=>{$('#p-cuenta').textContent=n>0?`Llegada de la onda en ${n} s`:'Movimiento en curso: protégete.'};t();
 S.timer=setInterval(()=>{n--;t();if(n<=0)clearInterval(S.timer)},1000);gravedad(2,4)};
$('#b-fuego').onclick=()=>{clearInterval(S.timer);const f=+$('#piso').value;alerta(`Incendio en el piso ${f}`,'Evacúa por la ruta indicada. No uses ascensores.');
 $('#p-cuenta').textContent=`Foco de incendio en el piso ${f}.`;gravedad(f,f%5+1)};
$('#b-ruta').onclick=()=>{location.hash='#guiado';$('#b-ini').focus()};
$('#b-aux').onclick=()=>{location.hash='#ayuda';$('#b-pedir').focus()};

/* HU01, HU08 perfil; HU03 rol */
$('#f-perfil').onsubmit=e=>{e.preventDefault();const n=$('#nom').value.trim(),m=($('input[name=mov]:checked')||{}).value;
 if(n.length<2)return msg('#m-perfil','Escribe tu nombre.');
 if(!m)return msg('#m-perfil','Selecciona cómo te desplazas.');
 if(!$('#cons').checked)return msg('#m-perfil','Debes aceptar el uso de tus datos para guardar el perfil.');
 S.profile={nom:n,mov:m};S.type=m==='sr'?'sr':m==='am'||m==='mu'||m==='ba'?'mu':'est';$('#tipo').value=S.type;msg('#m-perfil',`Perfil guardado para ${n}.`,1)};
$('#f-brig').onsubmit=e=>{e.preventDefault();const c=$('#cod').value.trim();
 if(!c)return msg('#m-brig','Ingresa tu código.');
 if(c!=='BRIG-2026')return msg('#m-brig','Código inválido. Revisa el código de demostración.');
 S.role=true;msg('#m-brig','Rol de brigadista activo.',1);renderPanel()};

/* HU24, HU17-HU22, HU06, HU13 guiado */
function speak(t){if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='es-ES';speechSynthesis.speak(u)}else msg('#g-av','Tu navegador no admite lectura en voz alta. Instrucción: '+t)}
function plano(){const z=[1,2,3,4,5].map(i=>`<div class="z ${i===3?'ref':''}"><b>Zona ${i}</b><br>${i===3?'Refugio B (destino)':'&nbsp;'}</div>`).join('');$('#plano-g').innerHTML=z}
function paso(){const r=route();if(S.step>=r.length){$('#g-ins').textContent='Llegaste al destino. Pulsa «Estoy a salvo» en Ayuda humana.';$('#g-met').textContent='Quedan 0 m';$('#b-sig').disabled=true;return}
 const rest=r.slice(S.step).reduce((a,x)=>a+x[1],0);$('#g-ins').textContent=r[S.step][0];
 $('#g-met').textContent=`Quedan ${rest} m · aprox. ${Math.max(1,Math.ceil(rest/PACE[S.type]))} min`;
 $('#g-pos').textContent=`Baliza B-${S.step+1} · Piso 5 · precisión ±2 m`;
 if($('#vib').checked){navigator.vibrate&&navigator.vibrate(200);speak(r[S.step][0])}}
$('#tipo').onchange=e=>{S.type=e.target.value};
$('#b-ini').onclick=()=>{S.step=0;S.alt=false;msg('#g-av','');['#b-sig','#b-rep','#b-blq'].forEach(s=>$(s).disabled=false);paso()};
$('#b-sig').onclick=()=>{S.step++;paso()};
$('#b-rep').onclick=()=>speak($('#g-ins').textContent);
$('#b-blq').onclick=()=>{S.alt=true;S.step=0;$('#b-blq').disabled=true;msg('#g-av','Aviso: ruta recalculada por bloqueo.');paso()};

/* HU25, HU26, HU27, HU29, HU15 ayuda */
$('#b-pedir').onclick=()=>{if(S.tk)return msg('#a-est','Ya tienes la solicitud '+S.tk+'.');
 S.tk='#EA-'+String(400+S.occ.length).padStart(4,'0');const p=S.profile;S.occ.push({n:p?p.nom:'Tú',t:p&&p.mov==='am'?'AM':'PMR',z:2,r:3,s:'p',mine:1});
 $('#a-est').textContent=`Solicitud ${S.tk} enviada. Buscando brigadista cercano…`;renderPanel();
 setTimeout(()=>{if(S.tk&&!S.occ.find(o=>o.mine&&o.s==='s'))$('#a-est').textContent=`Auxilio confirmado: Ricardo G. viene en camino. Llegada estimada: 2 min (a 45 m).`},2500)};
$('#rap').onclick=e=>{if(e.target.tagName==='BUTTON')$('#a-log').textContent='Enviado: '+e.target.textContent};
$('#f-med').onsubmit=e=>{e.preventDefault();if($('#med').value.trim().length<3)return msg('#m-med','Describe qué ayuda necesitas.');
 if(!$('#cmed').checked)return msg('#m-med','Debes autorizar compartir esta información.');msg('#m-med','Enviado solo al brigadista asignado.',1)};
$('#b-salvo').onclick=()=>{$('#conf').hidden=false;$('#c-si').focus()};
$('#c-no').onclick=()=>{$('#conf').hidden=true};
$('#c-si').onclick=()=>{let o=S.occ.find(x=>x.mine);if(!o){o={n:'Tú',t:'PMR',z:2,r:1,s:'s',mine:1};S.occ.push(o)}o.s='s';$('#conf').hidden=true;
 $('#a-est').textContent='Confirmado: estás a salvo. Tu ubicación en vivo se detuvo.';renderPanel()};

/* HU33-HU37, HU32 panel */
function renderPanel(){const pen=S.occ.filter(o=>o.s==='p');$('#n-pe').textContent=pen.length;$('#n-ev').textContent=S.occ.length-pen.length;
 const ord=pen.slice().sort((a,b)=>b.r-a.r||a.n.localeCompare(b.n));
 $('#lista').innerHTML=ord.length?ord.map(o=>`<li class="r${o.r}"><span class="tag">${RISK[o.r]}</span> ${o.n} · ${o.t} · Zona ${o.z} <button class="b-sec" type="button" data-n="${S.occ.indexOf(o)}">Rescate completado</button></li>`).join(''):'<li>No hay solicitudes pendientes.</li>';
 $('#calor').innerHTML=[1,2,3,4,5].map(i=>{const l=pen.filter(o=>o.z===i&&(S.filter==='all'||o.t===S.filter));const b=S.bl.has(i);
  const c=b||l.length>1?'d':l.length?'w':'s';return `<div class="z ${c}"><b>Zona ${i}</b><br>${b?'⛔ Bloqueada<br>':''}${l.length} pendiente(s)<br>${l.map(o=>o.n.charAt(0)).join(' ')}</div>`}).join('')}
$('#lista').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(!S.role)return msg('#m-panel','Activa el rol de brigadista (HU03) para usar esta acción.');
 S.occ[+b.dataset.n].s='s';msg('#m-panel','Rescate registrado como completado.',1);renderPanel()};
$$('[data-f]').forEach(b=>b.onclick=()=>{S.filter=b.dataset.f;$$('[data-f]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderPanel()});
$('#b-bloq').onclick=()=>{if(!S.role)return msg('#m-panel','Activa el rol de brigadista (HU03) para usar esta acción.');
 S.bl.add(+$('#zb').value);msg('#m-panel',`Zona ${$('#zb').value} marcada como bloqueada.`,1);renderPanel()};

/* HU07, HU41, HU44 edificio */
function planoE(){const p=$('#pl').value;if(!p)return;$('#plano-e').innerHTML=[0,1,2,3,4].map(i=>{const r=S.refs.filter((x,k)=>k%5===i).map(x=>x.n).join(', ');
 return `<div class="z ${r?'ref':''}"><b>${p} · Z${i+1}</b><br>${r}</div>`}).join('')}
$('#edi').onchange=e=>{const n=+e.target.value,pl=$('#pl');if(!n){pl.disabled=true;pl.innerHTML='<option>Elige un edificio</option>';$('#plano-e').innerHTML='';return msg('#m-edi','')}
 pl.disabled=false;pl.innerHTML=Array.from({length:n},(_,i)=>`<option>Piso ${i+1}</option>`).join('');
 msg('#m-edi',`Plano cargado: ${e.target.selectedOptions[0].text}.`,1);planoE()};
$('#pl').onchange=planoE;
$('#f-ref').onsubmit=e=>{e.preventDefault();const n=$('#rn').value.trim();if(n.length<3)return msg('#m-ref','Escribe un nombre de al menos 3 letras.');
 S.refs.push({n,t:$('#rt').value});$('#l-ref').innerHTML=S.refs.map(r=>`<li>${r.t}: ${r.n}</li>`).join('');$('#rn').value='';msg('#m-ref','Agregado.',1);planoE()};

gravedad(0,0);plano();renderPanel();
