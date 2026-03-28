'use strict';

let currentFx = 1;
let planData = {}; // { organId_constraintIdx: value }

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  setupFractionButtons();
  setupFilters();
  render();
});

function setupFractionButtons() {
  document.querySelectorAll('.fraction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fraction-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFx = parseInt(btn.dataset.fx);
      document.getElementById('fxLabel').textContent = currentFx;
      planData = {};
      render();
    });
  });
}

function setupFilters() {
  document.getElementById('categoryFilter').addEventListener('change', render);
  document.getElementById('searchInput').addEventListener('input', render);
}

// ===== Render =====
function render() {
  const category = document.getElementById('categoryFilter').value;
  const search = document.getElementById('searchInput').value.trim().toLowerCase();

  let organs = getAllConstraints(currentFx);

  if (category !== 'all') {
    organs = organs.filter(o => o.category === category);
  }
  if (search) {
    organs = organs.filter(o =>
      o.name.includes(search) ||
      o.nameEn.toLowerCase().includes(search)
    );
  }

  renderChecker(organs);
  renderReference(organs);
}

// ===== Checker Table =====
function renderChecker(organs) {
  const container = document.getElementById('checkerTable');
  if (organs.length === 0) {
    container.innerHTML = '<p class="empty">該当する臓器が見つかりません</p>';
    return;
  }

  let html = '';
  organs.forEach(organ => {
    const constraints = organ.activeConstraints;
    let rows = '';
    let hasViolation = false;
    let hasWarning = false;
    let hasInput = false;

    constraints.forEach((c, idx) => {
      const key = `${organ.id}_${idx}`;
      const inputVal = planData[key];
      let statusClass = '';
      let statusLabel = '';
      let statusIcon = '';

      if (inputVal !== undefined && inputVal !== '') {
        hasInput = true;
        const val = parseFloat(inputVal);
        if (!isNaN(val)) {
          const ratio = val / c.limit;
          if (ratio <= 1.0) {
            statusClass = 'status-ok';
            statusLabel = '適合';
            statusIcon = '✓';
          } else if (ratio <= 1.1) {
            statusClass = 'status-warn';
            statusLabel = '注意';
            statusIcon = '!';
            hasWarning = true;
          } else {
            statusClass = 'status-ng';
            statusLabel = '超過';
            statusIcon = '✗';
            hasViolation = true;
          }
        }
      }

      const limitLabel = c.type === 'dose_volume'
        ? `${c.limit} ${c.unit}`
        : `${c.limit} ${c.unit}`;

      rows += `
        <div class="constraint-row">
          <div class="constraint-label">${c.label}</div>
          <div class="constraint-limit">
            <span class="limit-badge ${c.type === 'dose_volume' ? 'parallel-badge' : 'serial-badge'}">
              制約: ${limitLabel}
            </span>
          </div>
          <div class="constraint-input">
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="${c.type === 'dose_volume' ? '体積(cc)' : '線量(Gy)'}"
              value="${inputVal !== undefined ? inputVal : ''}"
              data-key="${key}"
              data-limit="${c.limit}"
              class="dose-input ${statusClass}"
            >
            <span class="unit-hint">${c.type === 'dose_volume' ? 'cc' : 'Gy'}</span>
          </div>
          <div class="constraint-status ${statusClass}">
            ${statusIcon ? `<span class="status-badge ${statusClass}">${statusIcon} ${statusLabel}</span>` : ''}
          </div>
        </div>`;
    });

    let cardClass = 'organ-card';
    if (hasInput) {
      if (hasViolation) cardClass += ' card-ng';
      else if (hasWarning) cardClass += ' card-warn';
      else cardClass += ' card-ok';
    }

    const categoryBadge = organ.category === 'serial'
      ? '<span class="cat-badge serial">直列</span>'
      : '<span class="cat-badge parallel">並列</span>';

    html += `
      <div class="${cardClass}">
        <div class="organ-header">
          <div class="organ-title">
            <h3>${organ.name}</h3>
            <span class="organ-en">${organ.nameEn}</span>
          </div>
          <div class="organ-meta">
            ${categoryBadge}
            ${organ.note ? `<span class="organ-note">${organ.note}</span>` : ''}
          </div>
        </div>
        <div class="constraints-grid">
          ${rows}
        </div>
      </div>`;
  });

  container.innerHTML = html;

  // Event listeners for inputs
  container.querySelectorAll('.dose-input').forEach(input => {
    input.addEventListener('input', (e) => {
      planData[e.target.dataset.key] = e.target.value;
      const val = parseFloat(e.target.value);
      const limit = parseFloat(e.target.dataset.limit);
      e.target.classList.remove('status-ok', 'status-warn', 'status-ng');
      if (!isNaN(val) && e.target.value !== '') {
        const ratio = val / limit;
        if (ratio <= 1.0) e.target.classList.add('status-ok');
        else if (ratio <= 1.1) e.target.classList.add('status-warn');
        else e.target.classList.add('status-ng');
      }
    });
  });
}

// ===== Reference Table =====
function renderReference(organs) {
  const container = document.getElementById('referenceTable');
  if (organs.length === 0) {
    container.innerHTML = '<p class="empty">該当する臓器が見つかりません</p>';
    return;
  }

  let html = `
    <table class="ref-table">
      <thead>
        <tr>
          <th>臓器</th>
          <th>種別</th>
          <th>制約内容</th>
          <th>制約値</th>
        </tr>
      </thead>
      <tbody>`;

  organs.forEach(organ => {
    const constraints = organ.activeConstraints;
    constraints.forEach((c, idx) => {
      const limitStr = `${c.limit} ${c.unit}`;
      const typeBadge = organ.category === 'serial'
        ? '<span class="cat-badge serial">直列</span>'
        : '<span class="cat-badge parallel">並列</span>';

      html += `
        <tr>
          ${idx === 0 ? `<td rowspan="${constraints.length}" class="organ-cell">
            <strong>${organ.name}</strong><br>
            <span class="organ-en small">${organ.nameEn}</span>
            ${organ.note ? `<br><span class="note-text">${organ.note}</span>` : ''}
          </td>` : ''}
          ${idx === 0 ? `<td rowspan="${constraints.length}" class="center">${typeBadge}</td>` : ''}
          <td>${c.label}</td>
          <td class="limit-cell">
            <span class="limit-badge ${organ.category === 'parallel' ? 'parallel-badge' : 'serial-badge'}">${limitStr}</span>
          </td>
        </tr>`;
    });
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}
