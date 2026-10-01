(function () {
  'use strict';
  const B = window.BankruptEngine, $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Куда ведёт кнопка «Остались вопросы». Временно - ВК владельца, до решения по боту.
  const ASK_URL = 'https://vk.ru/pyankov_vv';

  function read() {
    const a = { debt: +$('debt').value || 0, ipYears: +$('ipYears').value || 0, incomeMonthly: +$('incomeMonthly').value || 0,
      otherActiveIp: $('otherActiveIp').checked };
    document.querySelectorAll('.opts-r[data-k]').forEach(g => {
      const v = g.querySelector('input:checked'); if (!v) return;
      const k = g.dataset.k; a[k] = (k === 'overdue3m' || k === 'canPay') ? v.value === '1' : v.value;
    });
    document.querySelectorAll('input[type=checkbox][data-k]').forEach(c => { a[c.dataset.k] = c.checked; });
    return a;
  }

  function draw() {
    const a = read();
    $('ipMore').style.display = a.ip && a.ip !== 'none' ? '' : 'none';
    if (!a.debt) { $('res').innerHTML = '<div class="empty"><div class="ic">🧭</div><b>Укажите сумму долгов - и увидите результат</b></div>'; return; }
    const r = B.assess(a);
    const cls = r.code === 'mfc' ? 'mfc' : r.code.startsWith('court') ? 'court' : 'stop';
    let h = `<div class="res-card ${cls}"><div>Результат</div><div class="big">${esc(r.title)}</div><div>${esc(r.text)}</div>`;
    if (r.cost) h += `<div class="kpis"><div><span>Стоимость</span><b>${esc(r.cost)}</b></div><div><span>Срок</span><b>${esc(r.term)}</b></div></div>`;
    h += '</div>';
    if (r.docs.length) h += `<b>Какие документы понадобятся</b><ul class="docs">${r.docs.map(d => `<li>${esc(d)}</li>`).join('')}</ul>`;
    for (const f of r.flags) h += `<div class="alert"><span>${esc(f)}</span></div>`;
    if (r.code.startsWith('court') || r.code === 'mfc')
      h += '<div class="alert"><span>После банкротства 5 лет кредиты выдают только с указанием факта банкротства, и 5 лет нельзя снова подать на банкротство.</span></div>';
    h += `<div class="row" style="margin-top:14px"><a class="btn pri" href="${ASK_URL}" target="_blank" rel="noopener">💬 Остались вопросы - спросить</a>
<a class="btn ghost" href="https://kalkulyator-dolgov.github.io/" target="_blank" rel="noopener">💳 Посчитать план погашения</a></div>
<p class="note">Пишите без паспортных данных и номеров договоров - для первого ответа достаточно результата этого теста.</p>`;
    $('res').innerHTML = h;
  }
  $('form').addEventListener('input', draw); $('form').addEventListener('change', draw);
  draw();
})();
