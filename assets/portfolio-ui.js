/* Shared interactive portfolio layer. Keeps existing academic controls intact. */
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pathname = location.pathname;
  const onEight = pathname.includes('/atividade-8/');
  const onSeven = pathname.includes('/atividade-7/');
  const onSixSlides = pathname.endsWith('atividade-6-slides.html');
  const onSix = pathname.endsWith('atividade-6.html') || onSixSlides;
  const onHome = !onEight && !onSeven && !onSix;

  // Global reading progress: it is independent of each page's old script.
  const progress = document.createElement('div');
  progress.className = 'lab-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.max(0,Math.min(100,(scrollY/max)*100)) : 0}%`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});
  updateProgress();

  // A single navigation works from the index, technical report, slide deck and A8.
  const links = onHome ? [
    ['início','#inicio'],['06','#atividade-6'],['07','#atividade-7'],['08','atividade-8/']
  ] : onEight ? [
    ['início','../index.html'],['06','../atividade-6.html'],['07','../atividade-7/'],['08','#conteudo']
  ] : onSeven ? [
    ['início','../index.html'],['06','../atividade-6.html'],['07','#topo'],['08','../atividade-8/']
  ] : [
    ['início','index.html'],['06',onSixSlides?'atividade-6.html':'#fluxos'],['07','atividade-7/'],['08','atividade-8/']
  ];
  const dock=document.createElement('nav');
  dock.className='lab-dock';
  dock.setAttribute('aria-label','Navegação conectada entre atividades');
  dock.innerHTML=links.map(([label,href],i)=>`<a href="${href}" data-dock="${i}" title="${i===0?'Página inicial':'Atividade '+label}"><span class="lab-dock-number">${i===0?'⌂':label}</span><span>${i===0?'Início':'Ativ. '+label}</span></a>`).join('');
  document.body.appendChild(dock);
  function activeDock(index){
    dock.querySelectorAll('a').forEach((a,i)=>{
      a.classList.toggle('is-active',i===index);
      if(i===index)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }
  activeDock(onEight?3:onSeven?2:onSix?1:0);
  if(onHome && 'IntersectionObserver' in window){
    const sections=[document.querySelector('#inicio'),document.querySelector('#atividade-6'),document.querySelector('#atividade-7')].filter(Boolean);
    const observer=new IntersectionObserver(entries=>{
      for(const e of entries){if(e.isIntersecting){activeDock(e.target.id==='inicio'?0:e.target.id==='atividade-6'?1:2);}}
    },{rootMargin:'-15% 0px -56% 0px',threshold:0});
    sections.forEach(s=>observer.observe(s));
  }

  // Subtle page entrance and per-section reveal with reduced-motion fallback.
  if('IntersectionObserver' in window && !reduceMotion){
    const selection = onSixSlides ? '.slide' : '.overview-card,.panel,.model,.metric,.stage,.step,.evidence,.finding,.section-head,.activity-header,.lab-explorer,.lab-chart,.lab-event-explorer,.lab7-process article,.lab7-evidence,.lab7-stat';
    const elements=[...document.querySelectorAll(selection)];
    elements.forEach(el=>el.classList.add('lab-reveal'));
    document.documentElement.classList.add('lab-motion');
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('lab-visible');observer.unobserve(e.target);}});
    },{threshold:.05,rootMargin:'0px 0px -25px 0px'});
    elements.forEach(el=>observer.observe(el));
  }

  const explorer=document.getElementById('lab-explorer');
  if(explorer){
    const items={
      '6':{title:'Três processos, três formas de avaliar',description:'Compare os critérios de SBSeg 2026, USENIX Security 2025 e MODELS 2025. Explore as matrizes e os fluxogramas preservados no relatório técnico.',meta1:'3 eventos',meta2:'18 dimensões',url:'atividade-6.html',button:'Abrir Atividade 6'},
      '7':{title:'O mesmo K-Agent, pareceres distintos',description:'Revise as avaliações documentais e os registros históricos das três LLMs. Separe o teste random, a tentativa interrompida e a auditoria posterior de duas rodadas.',meta1:'3 provedores',meta2:'2 selos',url:'atividade-7/',button:'Abrir página da Atividade 7'},
      '8':{title:'As decisões mudam com a configuração?',description:'Compare GPT-6 High, Gemini 4 Hydrogen Thinking e Claude Sonnet 5.0 Extra. A Tarefa 8 reúne seis pareceres, auditoria de erros factuais e limitações metodológicas.',meta1:'6 pareceres',meta2:'3 configurações',url:'atividade-8/',button:'Abrir comparador da Atividade 8'}
    };
    const buttons=explorer.querySelectorAll('[data-lab-category]');
    const panel=explorer.querySelector('.lab-explorer-content');
    function choose(key){
      const d=items[key];if(!d)return;
      buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.labCategory===key)));
      const render=()=>{
        panel.querySelector('h3').textContent=d.title;
        panel.querySelector('p').textContent=d.description;
        panel.querySelector('[data-metric=one]').textContent=d.meta1;
        panel.querySelector('[data-metric=two]').textContent=d.meta2;
        const a=panel.querySelector('a');a.href=d.url;a.textContent=d.button;
      };
      if(!reduceMotion && panel.animate){
        panel.animate([{opacity:1,transform:'translateY(0)'},{opacity:.2,transform:'translateY(9px)'}],{duration:140,easing:'ease-in'}).finished.then(()=>{
          render();panel.animate([{opacity:.2,transform:'translateY(-9px)'},{opacity:1,transform:'translateY(0)'}],{duration:270,easing:'ease-out'});
        }).catch(render);
      }else render();
    }
    buttons.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.labCategory)));
    choose('6');
  }

  // Descriptive distribution of post-log judgments. A count, never a badge awarded.
  const chart=document.querySelector('[data-lab-chart]');
  if(chart){
    const judged={
      F:{t7:{approve:1,partial:2,deny:0},t8:{approve:1,partial:1,deny:1},text:'Funcional (F): a Tarefa 8 divide os três pareceres entre atribuir, parcial e não atribuir.'},
      R:{t7:{approve:1,partial:2,deny:0},t8:{approve:0,partial:1,deny:2},text:'Reprodutível (R): nenhuma LLM da Tarefa 8 recomendou atribuição definitiva com os logs enviados.'}
    };
    const labels={approve:'Atribuir',partial:'Parcial',deny:'Não atribuir'};
    const panels=[['t7','Tarefa 7'],['t8','Tarefa 8']];
    function change(seal){
      chart.querySelectorAll('[data-seal]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.seal===seal)));
      const plot=chart.querySelector('.lab-chart-plot');plot.replaceChildren();
      for(const [key,title] of panels){
        const row=document.createElement('div');row.className='lab-chart-row';
        const caption=document.createElement('div');caption.className='lab-chart-label';caption.textContent=title;
        const track=document.createElement('div');track.className='lab-chart-track';track.setAttribute('role','img');
        track.setAttribute('aria-label',`${title}, selo ${seal}: ${Object.entries(judged[seal][key]).map(([s,n])=>labels[s]+' '+n).join(', ')}`);
        for(const status of ['approve','partial','deny']){
          const n=judged[seal][key][status];if(!n)continue;
          const bar=document.createElement('div');bar.className='lab-chart-segment';bar.dataset.status=status;
          bar.title=`${labels[status]}: ${n} de 3 pareceres`;
          bar.textContent=n;bar.style.width=(n/3*100)+'%';track.appendChild(bar);
        }
        row.append(caption,track);plot.appendChild(row);
      }
      chart.querySelector('.lab-chart-caption').textContent=judged[seal].text+' Dados descritivos de três pareceres por etapa; não são selos oficiais.';
    }
    chart.querySelectorAll('[data-seal]').forEach(b=>b.addEventListener('click',()=>change(b.dataset.seal)));
    change('F');
  }

  const eventExplorer=document.getElementById('lab-event-explorer');
  if(eventExplorer){
    const events={
      sbseg:{name:'SBSeg 2026 · Revisão e rebuttal',text:'Quatro selos D/F/S/R; a revisão passa por r1, resposta dos autores e r2-decision. Um funcionamento demonstrado não equivale a reproduzir as reivindicações científicas.'},
      usenix:{name:'USENIX Security 2025 · Duas fases',text:'Disponibilidade exigida antes da versão final, salvo exceções justificadas. A avaliação adicional para Functional e Results Reproduced é opcional e baseada em evidências práticas.'},
      models:{name:'MODELS 2025 · Checagem e reúso',text:'README, STATUS e pacote técnico; checagem inicial e avaliação por revisores. Available, Functional e Reusable representam condições diferentes; Results Validated não é concedido nesta fase.'}
    };
    const buttons=eventExplorer.querySelectorAll('[data-event]');
    const title=eventExplorer.querySelector('[data-event-title]');
    const detail=eventExplorer.querySelector('[data-event-detail]');
    function change(key){
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.event===key)));
      title.textContent=events[key].name;detail.textContent=events[key].text;
      if(!reduceMotion&&detail.animate)detail.animate([{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});
    }
    buttons.forEach(b=>b.addEventListener('click',()=>change(b.dataset.event)));
    change('sbseg');
  }
})();
