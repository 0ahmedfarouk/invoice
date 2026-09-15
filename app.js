(() => {
  'use strict';
  const AUTH_EMAIL = 'elsadanym04@gmail.com';
  const AUTH_HASH = '1ce536ce659654b2d828d557a7e4b979b1f693b5c49da94e3553d9eaadb5e801';
  const KEYS = { draft:'qimam_quote_draft_v2', session:'qimam_quote_session_v1', log:'qimam_quote_log_v1', versions:'qimam_quote_versions_v1' };
  const defaultLogo = 'assets/qimam-logo.png';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clone = o => JSON.parse(JSON.stringify(o));
  const fmtDate = d => { const x = new Date(d + 'T00:00:00'); return Number.isNaN(x.getTime()) ? d : x.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase(); };
  const today = () => new Date().toISOString().slice(0,10);
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-'+Date.now()+'-'+Math.random().toString(16).slice(2));
  const toNum = v => Number.parseFloat(v) || 0;
  const money = (n,c) => `${new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)} ${c}`;

  const defaults = {
    language:'en', currency:'SAR', issuedDate:today(), quoteRef:'', title:'Product Quotation', subtitle:'',
    introEnabled:false, introPreset:'business', recipientName:'',
    introEn:'Dear {company},\nWe are pleased to present our quotation and look forward to supporting your requirements with premium quality and reliable delivery.',
    introAr:'السادة/ {company}،\nيسعدنا أن نقدم لكم عرض السعر، ونتطلع لخدمتكم بأعلى مستويات الجودة والالتزام في التوريد.',
    taxEnabled:true, taxLabel:'VAT', taxRate:15, itemsPerPage:10, repeatHeader:true, showPageNumbers:true, pdfFilename:'Qimam_Quotation', changeNote:'',
    logoData:defaultLogo,
    company:{
      nameEn:'QIMAM AL ARAB LIMITED COMPANY', nameAr:'شركة قمم العرب المحدودة',
      addressEn:'6232 Western Ring Road - Exit 26\nShubra District, Riyadh 12989\nSaudi Arabia', addressAr:'6232 الطريق الدائري الغربي - مخرج 26\nحي الشبرا، الرياض 12989\nالمملكة العربية السعودية',
      phone:'+966 54 130 9020', email:'info@q-alarab.com', vat:'311919032900003', cr:'1010953641'
    },
    previousWorkEn:'Qimam Al Arab Limited Company has extensive experience in manufacturing and supplying hotel linens, bath textiles, and related hospitality products. We have successfully executed supply orders for companies and hotel groups in accordance with approved specifications and samples.',
    previousWorkAr:'تتمتع شركة قمم العرب المحدودة بخبرة واسعة في تصنيع وتوريد مفروشات الفنادق والمنسوجات ومنتجات الضيافة ذات الصلة، وقد نفذت أعمال توريد لعدد من الشركات والمجموعات الفندقية وفق المواصفات والعينات المعتمدة.',
    termsEn:'A 50% advance payment shall be transferred upon contract award and confirmation.\nDelivery period: 60 days from the date of confirmation.\nWe are committed to supplying the required specifications at the highest quality level, fully matching the approved samples.',
    termsAr:'يتم تحويل دفعة مقدمة بنسبة 50% عند ترسية العقد والتأكيد.\nمدة التوريد: 60 يومًا من تاريخ التأكيد.\nنلتزم بتوريد المواصفات المطلوبة بأعلى مستوى من الجودة وبما يطابق العينات المعتمدة بالكامل.',
    items:[
      {id:uuid(),title:'Bed Sheet King',details:'Large - 310 × 310 cm  |  White  |  100% Cotton',price:80,qty:1},
      {id:uuid(),title:'Bed Sheet Twin',details:'Single - 230 × 310 cm  |  White  |  100% Cotton',price:50,qty:1},
      {id:uuid(),title:'Bath Towel',details:'Cotton Blend  |  Multi-Stripe Dobby Weave  |  White  |  490 g/m²  |  100 × 150 cm  |  Machine Washable',price:450,qty:1},
      {id:uuid(),title:'Hand Towel',details:'Cotton Blend  |  Multi-Stripe Dobby Weave  |  White  |  490 g/m²  |  50 × 100 cm  |  Machine Washable',price:300,qty:1},
      {id:uuid(),title:'Bath Mat',details:'100% Cotton  |  Stylish Dobby Weave  |  White  |  550 g/m²  |  50 × 70 cm  |  Machine Washable',price:150,qty:1},
      {id:uuid(),title:'Pillow Cases - Standard',details:'55 × 80 cm  |  White  |  100% Cotton',price:900,qty:1},
      {id:uuid(),title:'Duvet Cover King',details:'Large - 305 × 255 cm  |  White  |  100% Cotton',price:70,qty:1},
      {id:uuid(),title:'Duvet Cover Twin',details:'Single - 225 × 255 cm  |  White  |  100% Cotton',price:50,qty:1},
      {id:uuid(),title:'Pool Towel',details:'150 × 100 cm  |  Beige / Blue  |  100% Cotton',price:20,qty:1},
      {id:uuid(),title:'Health Club Towel',details:'50 × 100 cm  |  Blue  |  100% Cotton',price:20,qty:1}
    ]
  };
  let state = loadDraft();
  let renderTimer;

  function loadDraft(){ try{ return {...clone(defaults), ...JSON.parse(localStorage.getItem(KEYS.draft)||'{}')}; }catch{return clone(defaults);} }
  function saveDraft(){ localStorage.setItem(KEYS.draft, JSON.stringify(state)); setSaveState('Saved locally'); }
  function setSaveState(t){ $('#saveState').textContent=t; }
  function debounceRender(){ clearTimeout(renderTimer); setSaveState('Saving…'); renderTimer=setTimeout(()=>{saveDraft();renderAll();},180); }
  async function sha256(text){ const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)); return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join(''); }

  async function handleLogin(e){ e.preventDefault(); $('#loginError').textContent=''; const email=$('#loginEmail').value.trim().toLowerCase(); const pass=$('#loginPassword').value; const hash=await sha256(pass); if(email===AUTH_EMAIL && hash===AUTH_HASH){ if($('#rememberLogin').checked)localStorage.setItem(KEYS.session,'1'); showApp(); } else { $('#loginError').textContent='Incorrect email or password.'; } }
  function showApp(){ $('#loginScreen').classList.add('hidden'); $('#app').classList.remove('hidden'); bindStateToForm(); renderAll(); }
  function logout(){ localStorage.removeItem(KEYS.session); $('#app').classList.add('hidden'); $('#loginScreen').classList.remove('hidden'); $('#loginPassword').value=''; }

  function bindStateToForm(){
    const map={docLanguage:'language',currency:'currency',issuedDate:'issuedDate',quoteRef:'quoteRef',documentTitle:'title',documentSubtitle:'subtitle',introEnabled:'introEnabled',introPreset:'introPreset',recipientName:'recipientName',introEn:'introEn',introAr:'introAr',taxEnabled:'taxEnabled',taxLabel:'taxLabel',taxRate:'taxRate',itemsPerPage:'itemsPerPage',repeatHeader:'repeatHeader',showPageNumbers:'showPageNumbers',pdfFilename:'pdfFilename',changeNote:'changeNote',previousWorkEn:'previousWorkEn',previousWorkAr:'previousWorkAr',termsEn:'termsEn',termsAr:'termsAr'};
    for(const [id,key] of Object.entries(map)){ const el=$('#'+id); if(!el)continue; if(el.type==='checkbox')el.checked=!!state[key]; else el.value=state[key] ?? ''; }
    const cm={companyNameEn:'nameEn',companyNameAr:'nameAr',addressEn:'addressEn',addressAr:'addressAr',companyPhone:'phone',companyEmail:'email',vatNumber:'vat',crNumber:'cr'};
    for(const [id,key] of Object.entries(cm)) $('#'+id).value=state.company[key]||'';
    $('#editorLogoPreview').src=state.logoData||defaultLogo;
    $('#introFields').classList.toggle('muted-block',!state.introEnabled);
    renderItemsEditor();
  }

  function wireInputs(){
    const simple={docLanguage:'language',currency:'currency',issuedDate:'issuedDate',quoteRef:'quoteRef',documentTitle:'title',documentSubtitle:'subtitle',introEnabled:'introEnabled',introPreset:'introPreset',recipientName:'recipientName',introEn:'introEn',introAr:'introAr',taxEnabled:'taxEnabled',taxLabel:'taxLabel',taxRate:'taxRate',itemsPerPage:'itemsPerPage',repeatHeader:'repeatHeader',showPageNumbers:'showPageNumbers',pdfFilename:'pdfFilename',changeNote:'changeNote',previousWorkEn:'previousWorkEn',previousWorkAr:'previousWorkAr',termsEn:'termsEn',termsAr:'termsAr'};
    Object.entries(simple).forEach(([id,key])=>{ const el=$('#'+id); const evt=(el.tagName==='SELECT'||el.type==='checkbox'||el.type==='date')?'change':'input'; el.addEventListener(evt,()=>{ const previous=state[key]; state[key]=el.type==='checkbox'?el.checked:(['taxRate','itemsPerPage'].includes(key)?toNum(el.value):el.value); if(key==='introPreset')applyIntroPreset(); if(key==='introEnabled')$('#introFields').classList.toggle('muted-block',!el.checked); if(key==='language' && (!state.title.trim() || state.title==='Product Quotation' || state.title==='عرض سعر')){ state.title=el.value==='ar'?'عرض سعر':'Product Quotation'; $('#documentTitle').value=state.title; } debounceRender(); }); });
    const cm={companyNameEn:'nameEn',companyNameAr:'nameAr',addressEn:'addressEn',addressAr:'addressAr',companyPhone:'phone',companyEmail:'email',vatNumber:'vat',crNumber:'cr'};
    Object.entries(cm).forEach(([id,key])=>$('#'+id).addEventListener('input',()=>{state.company[key]=$('#'+id).value;debounceRender();}));
  }

  function applyIntroPreset(){
    const c=state.recipientName||'{company}';
    if(state.introPreset==='business'){
      state.introEn=`Dear ${c},\nWe are pleased to present our quotation and look forward to supporting your requirements with premium quality and reliable delivery.`;
      state.introAr=`السادة/ ${c}،\nيسعدنا أن نقدم لكم عرض السعر، ونتطلع لخدمتكم بأعلى مستويات الجودة والالتزام في التوريد.`;
    } else if(state.introPreset==='wedding'){
      state.introEn=`Dear ${c},\nIt is our pleasure to present a tailored quotation for your wedding and event requirements, with careful attention to elegant presentation, premium quality, and reliable delivery.`;
      state.introAr=`السادة/ ${c}،\nيسعدنا أن نقدم لكم عرضًا مخصصًا لاحتياجات حفل الزفاف والفعاليات، مع اهتمام خاص بالأناقة وجودة التنفيذ ودقة مواعيد التوريد.`;
    }
    $('#introEn').value=state.introEn; $('#introAr').value=state.introAr;
  }

  function renderItemsEditor(){
    const root=$('#itemsEditor'); root.innerHTML='';
    state.items.forEach((it,i)=>{
      const card=document.createElement('div'); card.className='item-editor-card'; card.dataset.id=it.id;
      card.innerHTML=`<div class="item-card-head"><div class="item-index"><span>${i+1}</span> Item ${i+1}</div><div class="item-actions"><button class="mini-btn move-up" title="Move up">↑</button><button class="mini-btn move-down" title="Move down">↓</button><button class="mini-btn duplicate" title="Duplicate">⧉</button><button class="mini-btn delete" title="Delete">×</button></div></div>
      <div class="item-fields"><label class="wide">Item / description<input class="it-title" type="text" value="${esc(it.title)}" /></label><label class="wide">Details<input class="it-details" type="text" value="${esc(it.details)}" /></label><label>Price<input class="it-price" type="number" min="0" step="0.01" value="${it.price}" /></label><label>Quantity<input class="it-qty" type="number" min="0" step="0.01" value="${it.qty}" /></label><div class="amount-chip"><span>Amount</span><strong>${money(it.price*it.qty,state.currency)}</strong></div></div>`;
      root.appendChild(card);
    });
    $('#itemCountBadge').textContent=state.items.length;
  }
  function esc(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
  function handleItemEvent(e){ const card=e.target.closest('.item-editor-card'); if(!card)return; const idx=state.items.findIndex(x=>x.id===card.dataset.id); if(idx<0)return; const it=state.items[idx];
    if(e.type==='input'){ if(e.target.classList.contains('it-title'))it.title=e.target.value; if(e.target.classList.contains('it-details'))it.details=e.target.value; if(e.target.classList.contains('it-price'))it.price=toNum(e.target.value); if(e.target.classList.contains('it-qty'))it.qty=toNum(e.target.value); card.querySelector('.amount-chip strong').textContent=money(it.price*it.qty,state.currency); debounceRender(); return; }
    if(e.target.closest('.delete')){ if(state.items.length===1)return toast('At least one item is required.'); state.items.splice(idx,1); renderItemsEditor(); debounceRender(); }
    if(e.target.closest('.duplicate')){ state.items.splice(idx+1,0,{...clone(it),id:uuid()}); renderItemsEditor(); debounceRender(); }
    if(e.target.closest('.move-up') && idx>0){ [state.items[idx-1],state.items[idx]]=[state.items[idx],state.items[idx-1]]; renderItemsEditor(); debounceRender(); }
    if(e.target.closest('.move-down') && idx<state.items.length-1){ [state.items[idx+1],state.items[idx]]=[state.items[idx],state.items[idx+1]]; renderItemsEditor(); debounceRender(); }
  }

  function totals(){ const subtotal=state.items.reduce((s,it)=>s+toNum(it.price)*toNum(it.qty),0); const tax=state.taxEnabled?subtotal*toNum(state.taxRate)/100:0; return{subtotal,tax,grand:subtotal+tax}; }
  function renderAll(){ const t=totals(); $('#subtotalReadout').textContent=money(t.subtotal,state.currency); $('#taxReadout').textContent=money(t.tax,state.currency); $('#grandReadout').textContent=money(t.grand,state.currency); renderPreview(); }

  const tr={
    en:{quotation:'Quotation',item:'ITEM / DESCRIPTION',price:'PRICE',quantity:'QUANTITY',amount:'AMOUNT',subtotal:'Subtotal',grand:'Grand Total',previous:'Previous Work',terms:'Supply Contract Terms',issued:'Issued',page:'Page',continued:'Continued on next page'},
    ar:{quotation:'عرض سعر',item:'البند / الوصف',price:'السعر',quantity:'الكمية',amount:'الإجمالي',subtotal:'المجموع الفرعي',grand:'الإجمالي النهائي',previous:'الأعمال السابقة',terms:'شروط التوريد',issued:'تاريخ الإصدار',page:'صفحة',continued:'يتبع في الصفحة التالية'}
  };
  function textFor(key){return tr[state.language][key];}
  function companyVal(en,ar){return state.language==='ar'?(ar||en):(en||ar);}
  function renderPreview(){
    const root=$('#pdfPreview'); root.innerHTML='';
    const baseMax=Math.max(4,Math.min(12,Number(state.itemsPerPage)||10)); const max=state.introEnabled?Math.max(4,baseMax-2):baseMax;
    const chunks=[]; for(let i=0;i<state.items.length;i+=max) chunks.push(state.items.slice(i,i+max)); if(!chunks.length)chunks.push([]);
    chunks.forEach((items,pi)=>root.appendChild(buildPage(items,pi,chunks.length)));
    $('#pageCounter').textContent=`${chunks.length} page${chunks.length===1?'':'s'}`;
    syncPrintRoot();
  }
  function buildPage(items,pageIndex,pageCount){
    const lang=state.language, rtl=lang==='ar', last=pageIndex===pageCount-1; const t=totals(); const page=document.createElement('section'); page.className='pdf-page'; page.dir=rtl?'rtl':'ltr';
    const name=companyVal(state.company.nameEn,state.company.nameAr); const address=companyVal(state.company.addressEn,state.company.addressAr); const prev=lang==='ar'?state.previousWorkAr:state.previousWorkEn; const terms=(lang==='ar'?state.termsAr:state.termsEn).split('\n').filter(Boolean);
    const introRaw=lang==='ar'?state.introAr:state.introEn; const intro=introRaw.replaceAll('{company}',state.recipientName|| (lang==='ar'?'عميلنا الكريم':'Valued Client'));
    page.innerHTML=`${headerHtml(name,address,pageIndex)}
      <div class="pdf-doc-head"><div><div class="pdf-doc-title">${esc(state.title || (lang==='ar'?'عرض سعر':'Product Quotation'))}${pageCount>1&&pageIndex>0?' - '+(lang==='ar'?'تابع':'Continued'):''}</div><div class="pdf-subtitle">${esc(state.subtitle)}${state.quoteRef?` &nbsp; | &nbsp; ${esc(state.quoteRef)}`:''}</div></div><div class="pdf-issued">${textFor('issued')}: ${esc(fmtDate(state.issuedDate))}</div></div>
      ${state.introEnabled&&pageIndex===0?`<div class="pdf-intro">${esc(intro).replaceAll('\n','<br>')}</div>`:''}
      ${tableHtml(items,pageIndex*(state.introEnabled?Math.max(4,(Number(state.itemsPerPage)||10)-2):(Number(state.itemsPerPage)||10)))}
      ${last?summaryHtml(t):`<div class="continued-note">${textFor('continued')}…</div>`}
      ${last?lowerHtml(prev,terms):''}
      ${footerHtml(name,pageIndex,pageCount)}`;
    return page;
  }
  function headerHtml(name,address,pageIndex){ if(pageIndex>0&&!state.repeatHeader) return '<div style="height:42px"></div>'; const rows=address.split('\n').filter(Boolean); return `<div class="pdf-header"><div><div class="pdf-title">${textFor('quotation')}</div><div class="pdf-title-line"></div><div class="pdf-contact"><div class="pdf-contact-row"><div class="pdf-contact-icon">●</div><div>${rows.map(esc).join('<br>')}</div></div><div class="pdf-contact-row"><div class="pdf-contact-icon">☎</div><div>${esc(state.company.phone)}</div></div><div class="pdf-contact-row"><div class="pdf-contact-icon">✉</div><div>${esc(state.company.email)}</div></div><div class="pdf-contact-row"><div class="pdf-contact-icon">▣</div><div>VAT: ${esc(state.company.vat)} &nbsp;&nbsp; | &nbsp;&nbsp; CR: ${esc(state.company.cr)}</div></div></div></div><div class="pdf-logo-area"><img src="${esc(state.logoData||defaultLogo)}" alt="${esc(name)}"></div></div>`; }
  function tableHtml(items,start){ return `<table class="pdf-table"><thead><tr><th>${textFor('item')}</th><th>${textFor('price')}</th><th>${textFor('quantity')}</th><th>${textFor('amount')}</th></tr></thead><tbody>${items.map((it,j)=>`<tr><td><div class="pdf-item-cell">${state.language==='ar'?`<div><div class="pdf-item-title">${esc(it.title)}</div><div class="pdf-item-detail">${esc(it.details)}</div></div><div class="pdf-item-number">${start+j+1}</div>`:`<div class="pdf-item-number">${start+j+1}</div><div><div class="pdf-item-title">${esc(it.title)}</div><div class="pdf-item-detail">${esc(it.details)}</div></div>`}</div></td><td class="pdf-num">${money(toNum(it.price),state.currency)}</td><td class="pdf-num">${new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(toNum(it.qty))} pcs</td><td class="pdf-num">${money(toNum(it.price)*toNum(it.qty),state.currency)}</td></tr>`).join('')}</tbody></table>`; }
  function summaryHtml(t){return `<div class="pdf-summary"><div class="pdf-summary-row"><span>${textFor('subtotal')}</span><span>${money(t.subtotal,state.currency)}</span></div>${state.taxEnabled?`<div class="pdf-summary-row"><span>${esc(state.taxLabel)} (${toNum(state.taxRate)}%)</span><span>${money(t.tax,state.currency)}</span></div>`:''}<div class="pdf-summary-row grand"><span>${textFor('grand')}</span><strong>${money(t.grand,state.currency)}</strong></div></div>`;}
  function lowerHtml(prev,terms){return `<div class="pdf-lower"><div class="section-rule"></div><div class="pdf-lower-section"><div class="pdf-section-icon">★</div><div><div class="pdf-section-title">${textFor('previous')}</div><div class="pdf-section-text">${esc(prev)}</div></div></div><div class="pdf-lower-section"><div class="pdf-section-icon">✓</div><div><div class="pdf-section-title">${textFor('terms')}</div><div class="pdf-terms">${terms.slice(0,4).map((x,i)=>`<div class="pdf-term"><div class="pdf-term-num">${i+1}</div><div>${esc(x)}</div></div>`).join('')}</div></div></div></div>`;}
  function footerHtml(name,pi,pc){return `<div class="pdf-footer"><span class="footer-diamond"></span><span>${esc(name.toUpperCase())}</span><span class="footer-diamond"></span></div>${state.showPageNumbers&&pc>1?`<div class="pdf-page-number">${textFor('page')} ${pi+1} / ${pc}</div>`:''}`;}
  function syncPrintRoot(){ const root=$('#printRoot'); root.innerHTML=''; $$('.pdf-page',$('#pdfPreview')).forEach(p=>root.appendChild(p.cloneNode(true))); }

  async function handleLogo(file){ if(!file)return; if(!file.type.startsWith('image/'))return toast('Please choose an image file.'); const img=new Image(); const url=URL.createObjectURL(file); img.onload=()=>{ const max=650, scale=Math.min(1,max/Math.max(img.width,img.height)); const c=document.createElement('canvas'); c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height); state.logoData=c.toDataURL('image/png',.95); $('#editorLogoPreview').src=state.logoData; URL.revokeObjectURL(url); debounceRender(); toast('Logo updated.');};img.src=url; }

  function saveVersion(note){ const versions=getVersions(); const t=totals(); versions.unshift({id:uuid(),timestamp:new Date().toISOString(),note:note||state.changeNote||'Manual snapshot',grand:t.grand,currency:state.currency,state:clone(state)}); localStorage.setItem(KEYS.versions,JSON.stringify(versions.slice(0,30))); toast('Version saved locally.'); }
  function getVersions(){try{return JSON.parse(localStorage.getItem(KEYS.versions)||'[]')}catch{return[]}}
  function renderVersions(){ const list=$('#versionsList'),v=getVersions(); list.innerHTML=v.length?v.map(x=>`<div class="version-row" data-id="${x.id}"><div><strong>${esc(x.note)}</strong><div class="version-meta">${new Date(x.timestamp).toLocaleString()} · ${money(x.grand,x.currency)}</div></div><div class="version-actions"><button class="btn btn-soft restore-version">Restore</button><button class="mini-btn delete-version">×</button></div></div>`).join(''):'<p>No saved versions yet.</p>'; }
  function logExport(kind='PDF'){ const logs=getLogs(), t=totals(); logs.unshift({id:uuid(),timestamp:new Date().toISOString(),user:AUTH_EMAIL,kind,note:state.changeNote.trim(),language:state.language,itemCount:state.items.length,subtotal:t.subtotal,tax:t.tax,grand:t.grand,currency:state.currency,ref:state.quoteRef||''}); localStorage.setItem(KEYS.log,JSON.stringify(logs.slice(0,200))); saveVersion(`Auto-saved on ${kind} export: ${state.changeNote.trim()}`); }
  function getLogs(){try{return JSON.parse(localStorage.getItem(KEYS.log)||'[]')}catch{return[]}}
  function renderAudit(){ const list=$('#auditList'),logs=getLogs(); list.innerHTML=logs.length?logs.map(x=>`<div class="audit-row"><div><strong>${esc(x.kind)} · ${money(x.grand,x.currency)}</strong><div class="audit-meta">${new Date(x.timestamp).toLocaleString()} · ${x.itemCount} items · ${x.language.toUpperCase()}${x.ref?' · '+esc(x.ref):''}<br>${esc(x.note)}</div></div></div>`).join(''):'<p>No export activity yet.</p>'; }

  function validateExport(){ if(!state.logoData)return toast('A company logo is required before export.'),false; if(!state.changeNote.trim()){ activateTab('output'); $('#changeNote').focus(); toast('Please add the mandatory export note first.'); return false;} if(!state.items.length)return toast('Add at least one item.'),false; return true; }
  async function exportPDF(){ if(!validateExport())return; logExport('PDF'); saveDraft(); renderAll(); const pages=$$('.pdf-page',$('#pdfPreview')); const filename=safeFileName(state.pdfFilename||'Qimam_Quotation')+'.pdf';
    if(window.html2canvas && window.jspdf?.jsPDF){ try{ toast('Rendering PDF…'); const pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true}); for(let i=0;i<pages.length;i++){ if(i)pdf.addPage(); const canvas=await window.html2canvas(pages[i],{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false}); const img=canvas.toDataURL('image/jpeg',.98); pdf.addImage(img,'JPEG',0,0,210,297,undefined,'FAST'); } pdf.save(filename); toast('PDF downloaded and logged.'); return; }catch(err){console.error(err);}}
    toast('Direct renderer unavailable. Opening browser PDF print…'); setTimeout(()=>window.print(),250);
  }
  function printPDF(){ if(!validateExport())return; logExport('Print/PDF'); saveDraft(); renderAll(); setTimeout(()=>window.print(),100); }
  function safeFileName(s){return s.replace(/[^a-zA-Z0-9-_]+/g,'_').replace(/^_+|_+$/g,'')||'quotation';}
  function downloadLog(){ const rows=getLogs(); if(!rows.length)return toast('No activity to download.'); const heads=['timestamp','user','kind','note','language','itemCount','subtotal','tax','grand','currency','ref']; const csv=[heads.join(','),...rows.map(r=>heads.map(h=>`"${String(r[h]??'').replaceAll('"','""')}"`).join(','))].join('\n'); const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='qimam_activity_log.csv';a.click();URL.revokeObjectURL(a.href);}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2600)}
  function activateTab(name){ $$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===name)); $$('.tab-panel').forEach(x=>x.classList.toggle('active',x.dataset.panel===name)); }
  function resetAll(){ if(!confirm('Reset all local quotation data to the original sample?'))return; state=clone(defaults);localStorage.removeItem(KEYS.draft);bindStateToForm();saveDraft();renderAll();toast('Studio reset.'); }

  function init(){
    $('#loginForm').addEventListener('submit',handleLogin); $('#logoutBtn').addEventListener('click',logout); wireInputs();
    $$('.tab').forEach(t=>t.addEventListener('click',()=>activateTab(t.dataset.tab)));
    $('#itemsEditor').addEventListener('input',handleItemEvent); $('#itemsEditor').addEventListener('click',handleItemEvent);
    $('#addItemBtn').addEventListener('click',()=>{state.items.push({id:uuid(),title:'New Item',details:'Add size, material, color or specification',price:0,qty:1});renderItemsEditor();debounceRender();});
    $('#logoUpload').addEventListener('change',e=>handleLogo(e.target.files[0])); $('#resetLogoBtn').addEventListener('click',()=>{state.logoData=defaultLogo;$('#editorLogoPreview').src=defaultLogo;debounceRender();});
    $('#exportPdfBtn').addEventListener('click',exportPDF); $('#printBtn').addEventListener('click',printPDF);
    $('#saveVersionBtn').addEventListener('click',()=>saveVersion(prompt('Version note:',state.changeNote||'Manual snapshot')||'Manual snapshot')); $('#saveVersionInlineBtn').addEventListener('click',()=>saveVersion(prompt('Version note:',state.changeNote||'Manual snapshot')||'Manual snapshot'));
    $('#auditBtn').addEventListener('click',()=>{renderAudit();$('#auditDialog').showModal()}); $('#openVersionsBtn').addEventListener('click',()=>{renderVersions();$('#versionsDialog').showModal()});
    $$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close())); $('#downloadLogBtn').addEventListener('click',downloadLog); $('#clearLogBtn').addEventListener('click',()=>{if(confirm('Clear local activity log?')){localStorage.removeItem(KEYS.log);renderAudit();}});
    $('#versionsList').addEventListener('click',e=>{const row=e.target.closest('.version-row');if(!row)return;const versions=getVersions(),i=versions.findIndex(x=>x.id===row.dataset.id);if(i<0)return;if(e.target.closest('.restore-version')){state=clone(versions[i].state);saveDraft();bindStateToForm();renderAll();$('#versionsDialog').close();toast('Version restored.');}if(e.target.closest('.delete-version')){versions.splice(i,1);localStorage.setItem(KEYS.versions,JSON.stringify(versions));renderVersions();}});
    $('#resetAllBtn').addEventListener('click',resetAll);
    if(localStorage.getItem(KEYS.session)==='1')showApp();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
