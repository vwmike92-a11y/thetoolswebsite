/* Email links open a small box (copy / Gmail / Outlook / own app) instead of launching Mail directly. */
(function(){
  var css='.mh-ov{position:fixed;inset:0;background:rgba(30,10,60,.55);display:flex;align-items:center;justify-content:center;z-index:4000;padding:16px;}'+
  '.mh-box{background:#fff;border-radius:18px;max-width:440px;width:100%;padding:1.4rem 1.3rem;font-family:Nunito,Arial,sans-serif;color:#3d1a6e;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.3);text-align:left;}'+
  '.mh-box h3{margin:0 0 .5rem;font-family:"Fredoka One",cursive;font-size:1.25rem;color:#3d1a6e;}'+
  '.mh-box p{margin:0 0 .9rem;font-size:.95rem;line-height:1.5;color:#3d1a6e;}'+
  '.mh-row{display:flex;flex-wrap:wrap;gap:.5rem;}'+
  '.mh-b{display:inline-block;padding:.5rem .95rem;border-radius:999px;border:2px solid #5b2a9e;background:#fff;color:#3d1a6e;font:inherit;font-size:.9rem;font-weight:700;text-decoration:none;cursor:pointer;}'+
  '.mh-b:hover{background:#5b2a9e;color:#fff;}'+
  '.mh-x{position:absolute;top:.6rem;right:.7rem;border:none;background:none;font-size:1.4rem;color:#3d1a6e;cursor:pointer;line-height:1;}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function open(to,subject,raw){
    var su=encodeURIComponent(subject||'');
    var ov=document.createElement('div');ov.className='mh-ov';
    ov.innerHTML='<div class="mh-box" role="dialog" aria-modal="true"><button class="mh-x" aria-label="Close">×</button>'+
      '<h3>Email us</h3><p>Send an email to <strong>'+esc(to)+'</strong>'+(subject?' with the subject <em>“'+esc(subject)+'”</em>':'')+'</p>'+
      '<div class="mh-row"><button type="button" class="mh-b mh-copy">📋 Copy email address</button>'+
      '<a class="mh-b" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to)+'&su='+su+'">Open in Gmail</a>'+
      '<a class="mh-b" target="_blank" rel="noopener" href="https://outlook.live.com/mail/0/deeplink/compose?to='+encodeURIComponent(to)+'&subject='+su+'">Open in Outlook</a>'+
      '<a class="mh-b mh-app" href="'+esc(raw)+'">Use my email app</a></div></div>';
    function close(){ov.remove();document.removeEventListener('keydown',key);}
    function key(e){if(e.key==='Escape')close();}
    ov.addEventListener('click',function(e){if(e.target===ov)close();});
    ov.querySelector('.mh-x').addEventListener('click',close);
    ov.querySelector('.mh-copy').addEventListener('click',function(){
      var b=this,done=function(){b.textContent='✅ Copied';setTimeout(function(){b.textContent='📋 Copy email address';},2000);};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(to).then(done,function(){prompt('Copy this email address:',to);});}
      else{prompt('Copy this email address:',to);}
    });
    document.addEventListener('keydown',key);
    document.body.appendChild(ov);ov.querySelector('.mh-copy').focus();
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="mailto:"]');
    if(!a||a.classList.contains('mh-app')||a.hasAttribute('data-direct-mail'))return;
    e.preventDefault();
    var raw=a.getAttribute('href'),q=raw.slice(7).split('?'),to=decodeURIComponent(q[0]),subject='';
    if(q[1]){q[1].split('&').forEach(function(p){var kv=p.split('=');if(kv[0].toLowerCase()==='subject')subject=decodeURIComponent((kv[1]||'').replace(/\+/g,' '));});}
    open(to,subject,raw);
  });
})();
