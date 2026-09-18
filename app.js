'use strict';

/* ------------------------------------------------------------------
   Escores de dificultad respiratoria obstructiva baja — AR-UCIP
   Tal modificado por FC · Pulmonary score · PRAM
-------------------------------------------------------------------*/

var ageGroup = 'lt6';          // solo Tal: <6 m ó ≥6 m
var current = 'tal';
var values = {};               // id de ítem -> puntos
var satSev = null;             // categoría por SatO2 (no suma puntos)

/* --------------------------- definiciones ------------------------ */

var FR_TAL = {
  lt6: [
    { pts: 0, txt: 'Menos de 40/min' },
    { pts: 1, txt: '40 – 55/min' },
    { pts: 2, txt: '56 – 70/min' },
    { pts: 3, txt: 'Más de 70/min' }
  ],
  ge6: [
    { pts: 0, txt: 'Menos de 30/min' },
    { pts: 1, txt: '30 – 45/min' },
    { pts: 2, txt: '46 – 60/min' },
    { pts: 3, txt: 'Más de 60/min' }
  ]
};

var SCORES = {

  tal: {
    name: 'Tal modificado por FC',
    age: '1 a 24 meses',
    max: 12,
    intro: 'Bronquiolitis y síndrome bronquial obstructivo del lactante. Escala de dificultad respiratoria del Ministerio de Salud (EDRAR).',
    items: [
      { id: 'fr', legend: 'Frecuencia respiratoria', options: null },
      {
        id: 'sib', legend: 'Sibilancias', options: [
          { pts: 0, txt: 'No' },
          { pts: 1, txt: 'Fin de espiración, con estetoscopio' },
          { pts: 2, txt: 'Inspiración y espiración, con estetoscopio' },
          { pts: 3, txt: 'Audibles sin estetoscopio, o ausentes por insuficiente entrada de aire' }
        ]
      },
      {
        id: 'fc', legend: 'Frecuencia cardíaca', options: [
          { pts: 0, txt: 'Menos de 120/min' },
          { pts: 1, txt: '120 – 140/min' },
          { pts: 2, txt: '141 – 160/min' },
          { pts: 3, txt: 'Más de 160/min' }
        ]
      },
      {
        id: 'mus', legend: 'Músculos accesorios', options: [
          { pts: 0, txt: 'No' },
          { pts: 1, txt: '(+) Tiraje subcostal' },
          { pts: 2, txt: '(++) Subcostal e intercostal' },
          { pts: 3, txt: '(+++) Universal con aleteo nasal' }
        ]
      }
    ],
    satOptions: [
      { sev: 'leve', txt: '≥ 98%' },
      { sev: 'moderada', txt: '93 – 97%' },
      { sev: 'grave', txt: '≤ 92%' }
    ],
    grade: function (t) {
      if (t <= 4) return 'leve';
      if (t <= 8) return 'moderada';
      return 'grave';
    },
    bands: '0–4 leve · 5–8 moderada · 9–12 grave',
    alert: function (t) {
      return t >= 7 ? 'Puntaje ≥ 7: administrar oxígeno por bigotera o máscara.' : '';
    }
  },

  ps: {
    name: 'Pulmonary score',
    age: '2 a 5 años',
    max: 9,
    intro: 'Crisis asmática del preescolar. La gravedad final surge de integrar el puntaje clínico con la saturación: <b>ante discordancia se toma la categoría más grave</b>.',
    items: [
      {
        id: 'fr', legend: 'Frecuencia respiratoria (< 5 años)', options: [
          { pts: 0, txt: 'Menos de 30/min' },
          { pts: 1, txt: '30 – 45/min' },
          { pts: 2, txt: '46 – 60/min' },
          { pts: 3, txt: 'Más de 60/min' }
        ]
      },
      {
        id: 'sib', legend: 'Sibilancias', options: [
          { pts: 0, txt: 'No' },
          { pts: 1, txt: 'Final de la inspiración' },
          { pts: 2, txt: 'Toda la espiración' },
          { pts: 3, txt: 'Inspiración y espiración, sin estetoscopio' }
        ]
      },
      {
        id: 'ecm', legend: 'Uso de músculos accesorios (esternocleidomastoideo)', options: [
          { pts: 0, txt: 'No' },
          { pts: 1, txt: 'Incremento leve' },
          { pts: 2, txt: 'Aumentado' },
          { pts: 3, txt: 'Actividad máxima' }
        ]
      }
    ],
    satOptions: [
      { sev: 'leve', txt: '> 94%' },
      { sev: 'moderada', txt: '91 – 94%' },
      { sev: 'grave', txt: '< 91%' }
    ],
    grade: function (t) {
      if (t <= 3) return 'leve';
      if (t <= 6) return 'moderada';
      return 'grave';
    },
    bands: '0–3 leve · 4–6 moderada · 7–9 grave'
  },

  pram: {
    name: 'PRAM',
    age: '3 a 17 años',
    max: 12,
    intro: 'Pediatric Respiratory Assessment Measure (Ducharme/Chalut), validado de los 2 a los 17 años. Ante hallazgos asimétricos, puntuar el campo pulmonar más comprometido.',
    items: [
      {
        id: 'sup', legend: 'Retracción supraesternal', options: [
          { pts: 0, txt: 'Ausente' },
          { pts: 2, txt: 'Presente' }
        ]
      },
      {
        id: 'esc', legend: 'Contracción de músculos escalenos', options: [
          { pts: 0, txt: 'Ausente' },
          { pts: 2, txt: 'Presente' }
        ]
      },
      {
        id: 'ent', legend: 'Entrada de aire (ventilación)', options: [
          { pts: 0, txt: 'Normal' },
          { pts: 1, txt: 'Disminuida en bases' },
          { pts: 2, txt: 'Disminución generalizada (vértices y bases)' },
          { pts: 3, txt: 'Ausente o mínima' }
        ]
      },
      {
        id: 'sib', legend: 'Sibilancias', options: [
          { pts: 0, txt: 'Ausentes' },
          { pts: 1, txt: 'Solamente espiratorias' },
          { pts: 2, txt: 'Inspiratorias y espiratorias' },
          { pts: 3, txt: 'Audibles sin estetoscopio, o tórax silente' }
        ]
      },
      {
        id: 'sat', legend: 'Saturación de O₂ (aire ambiente)', options: [
          { pts: 0, txt: '≥ 95%' },
          { pts: 1, txt: '92 – 94%' },
          { pts: 2, txt: 'Menos de 92%' }
        ]
      }
    ],
    grade: function (t) {
      if (t <= 3) return 'leve';
      if (t <= 7) return 'moderada';
      return 'grave';
    },
    bands: '0–3 leve · 4–7 moderada · 8–12 grave'
  }
};

/* --------------------------- utilidades -------------------------- */

function itemOptions(sc, item) {
  if (sc === SCORES.tal && item.id === 'fr') return FR_TAL[ageGroup];
  return item.options;
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

// al cambiar de calculadora, volver al encabezado sin que el foco arrastre la vista
function scrollToTop() {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' }); }
  catch (err) { window.scrollTo(0, 0); }
}

/* ---------------------------- render ----------------------------- */

function render() {
  var sc = SCORES[current];
  var html = '<p class="intro"><span class="eyebrow">' + sc.name + ' · ' + sc.age + '</span>' + sc.intro + '</p>';

  if (current === 'tal') {
    html += '<div class="seg" role="group" aria-label="Edad del paciente">' +
      '<button type="button" data-age="lt6" aria-pressed="' + (ageGroup === 'lt6') + '">Menor de 6 meses</button>' +
      '<button type="button" data-age="ge6" aria-pressed="' + (ageGroup === 'ge6') + '">6 meses o más</button>' +
      '</div>';
  }

  sc.items.forEach(function (item) {
    var opts = itemOptions(sc, item);
    html += '<fieldset><legend>' + item.legend + '</legend><div class="opts">';
    opts.forEach(function (o, i) {
      var id = current + '-' + item.id + '-' + i;
      var checked = values[item.id] === o.pts ? ' checked' : '';
      html += '<label class="opt" for="' + id + '">' +
        '<input type="radio" name="' + current + '-' + item.id + '" id="' + id + '" value="' + o.pts + '"' + checked + '>' +
        '<span class="pts">' + o.pts + '</span><span class="txt">' + esc(o.txt) + '</span></label>';
    });
    html += '</div>';
    if (item.id === 'sib' && current === 'ps') {
      html += '<p class="hint">Si no hay sibilancias y la actividad del ECM está aumentada, este ítem se puntúa 3.</p>';
    }
    html += '</fieldset>';
  });

  if (sc.satOptions) {
    html += '<fieldset><legend>Saturación de O₂ (opcional)</legend>' +
      '<p class="hint">No suma puntos: se compara con la clasificación clínica.</p>' +
      '<div class="opts">';
    sc.satOptions.forEach(function (o, i) {
      var id = current + '-satcat-' + i;
      var checked = satSev === o.sev ? ' checked' : '';
      html += '<label class="opt" for="' + id + '">' +
        '<input type="radio" name="' + current + '-satcat" id="' + id + '" value="' + o.sev + '"' + checked + '>' +
        '<span class="pts">·</span><span class="txt">' + esc(o.txt) + '</span></label>';
    });
    html += '</div></fieldset>';
  }

  document.getElementById('panel').innerHTML = html;
  document.body.setAttribute('data-score', current);

  ['tab-tal', 'tab-ps', 'tab-pram'].forEach(function (id) {
    var t = document.getElementById(id);
    t.setAttribute('aria-selected', String(t.dataset.score === current));
  });

  compute();
}

/* ---------------------------- cálculo ---------------------------- */

function compute() {
  var sc = SCORES[current];
  var total = 0, done = 0, psRule = false;

  sc.items.forEach(function (item) {
    var v = values[item.id];
    if (v === undefined) return;
    done++;
    total += v;
  });

  // Pulmonary score: sin sibilancias + ECM aumentado => sibilancias 3
  if (current === 'ps' && values.sib === 0 && values.ecm >= 2) {
    total += 3;
    psRule = true;
  }

  var complete = done === sc.items.length;
  var num = document.getElementById('score-num');
  var label = document.getElementById('score-label');
  var note = document.getElementById('score-note');
  var sheet = document.getElementById('result');

  num.textContent = done ? total : '–';
  document.getElementById('score-max').textContent = '/' + sc.max;

  if (!complete) {
    sheet.removeAttribute('data-sev');
    label.textContent = done ? 'Faltan ' + (sc.items.length - done) + ' ítem(s)' : 'Completá los ítems';
    note.textContent = sc.bands;
    return;
  }

  var clin = sc.grade(total);
  var order = { leve: 1, moderada: 2, grave: 3 };
  var final = clin, extra = '';
  if (sc.satOptions && satSev && order[satSev] > order[clin]) {
    final = satSev;
    extra = 'Discordancia con SatO₂: se toma la categoría más grave.';
  }

  sheet.setAttribute('data-sev', final);
  label.textContent = 'Crisis ' + final;
  var parts = [sc.bands];
  if (psRule) parts.push('Se aplicó la regla: sibilancias puntuadas 3.');
  if (extra) parts.push(extra);
  if (sc.alert) { var a = sc.alert(total); if (a) parts.push(a); }
  note.textContent = parts.join(' · ');
}

/* --------------------------- resumen ----------------------------- */

function summary() {
  var sc = SCORES[current];
  var lines = [sc.name + ' (' + sc.age + ')'];
  if (current === 'tal') lines.push('Edad: ' + (ageGroup === 'lt6' ? 'menor de 6 meses' : '6 meses o más'));
  sc.items.forEach(function (item) {
    var opts = itemOptions(sc, item);
    var v = values[item.id];
    var txt = '–';
    if (v !== undefined) {
      for (var i = 0; i < opts.length; i++) if (opts[i].pts === v) txt = opts[i].txt;
    }
    lines.push('· ' + item.legend + ': ' + txt + ' (' + (v === undefined ? '–' : v) + ')');
  });
  if (sc.satOptions && satSev) {
    for (var j = 0; j < sc.satOptions.length; j++) {
      if (sc.satOptions[j].sev === satSev) lines.push('· SatO₂: ' + sc.satOptions[j].txt);
    }
  }
  lines.push('Total: ' + document.getElementById('score-num').textContent + '/' + sc.max +
    ' — ' + document.getElementById('score-label').textContent);
  return lines.join('\n');
}

/* ---------------------------- eventos ---------------------------- */

document.querySelectorAll('.tab').forEach(function (t) {
  t.addEventListener('click', function () {
    current = t.dataset.score;
    values = {};
    satSev = null;
    render();
    var panel = document.getElementById('panel');
    if (panel.focus) { try { panel.focus({ preventScroll: true }); } catch (err) { panel.focus(); } }
    scrollToTop();
  });
});

document.getElementById('panel').addEventListener('change', function (e) {
  var el = e.target;
  if (el.type !== 'radio') return;
  var id = el.name.split('-')[1];
  if (id === 'satcat') satSev = el.value;
  else values[id] = parseInt(el.value, 10);
  compute();
});

document.getElementById('panel').addEventListener('click', function (e) {
  var b = e.target.closest('[data-age]');
  if (!b) return;
  ageGroup = b.dataset.age;
  delete values.fr;
  render();
});

document.getElementById('reset').addEventListener('click', function () {
  values = {};
  satSev = null;
  render();
});

document.getElementById('copy').addEventListener('click', function () {
  var txt = summary();
  var btn = this;
  var ok = function () { btn.textContent = 'Copiado'; setTimeout(function () { btn.textContent = 'Copiar'; }, 1400); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(ok, function () { window.prompt('Copiar resultado:', txt); });
  } else {
    window.prompt('Copiar resultado:', txt);
  }
});

render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () { });
  });
}
