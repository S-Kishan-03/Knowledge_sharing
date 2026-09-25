/**
 * GD&T Position Tolerance @ MMC Bonus Calculator
 * Bonus and total allowable position tolerance for a hole at MMC
 */

import { Calculator, GdntPositionInputs, GdntPositionOutputs, GdntPositionInputsType, GdntPositionOutputsType } from './types.js';

const TEMPLATE = `
<div class="calculator-card">
  <div class="calc-header">
    <div class="calc-icon">📏</div>
    <div>
      <h4 class="calc-title">Position Tolerance @ MMC Bonus Calculator</h4>
      <p class="calc-subtitle">Compute bonus and total allowable position tolerance for a hole at Maximum Material Condition</p>
    </div>
  </div>
  <div class="calc-grid">
    <div class="calc-group">
      <label for="gdn-spec">Specified Position Tol (T<sub>spec</sub>) in mm:</label>
      <input type="number" id="gdn-spec" data-field="specifiedTol" min="0.001" step="0.01">
    </div>
    <div class="calc-group">
      <label for="gdn-mmc">MMC Hole Size (D<sub>MMC</sub>) in mm:</label>
      <input type="number" id="gdn-mmc" data-field="mmcSize" min="0.1" step="0.1">
    </div>
    <div class="calc-group">
      <label for="gdn-act">Actual Hole Size (D<sub>actual</sub>) in mm:</label>
      <input type="number" id="gdn-act" data-field="actualSize" min="0.1" step="0.01">
    </div>
    <div class="calc-group">
      <label for="gdn-pos">Measured Position Error in mm:</label>
      <input type="number" id="gdn-pos" data-field="positionError" min="0" step="0.01">
    </div>
  </div>
  <div class="calc-results">
    <div class="result-box">
      <span class="result-label">Bonus Tolerance (T<sub>bonus</sub>)</span>
      <span class="result-value" id="gdn-bonus">-- mm</span>
    </div>
    <div class="result-box highlight">
      <span class="result-label">Total Allowable Position Tol.</span>
      <span class="result-value" id="gdn-total">-- mm</span>
    </div>
    <div class="result-box" id="gdn-verdict">
      <span class="result-label">Inspection Result</span>
      <span class="result-value">--</span>
    </div>
    <div class="result-box" id="gdn-warning" style="display:none; grid-column: 1/-1; color: #f87171; font-size: 0.85rem;"></div>
  </div>
</div>
`;

export const gdntPositionCalculator: Calculator<typeof GdntPositionInputs, typeof GdntPositionOutputs> = {
  id: 'gdnt_position_calculator',
  label: 'GD&T Position @ MMC',
  icon: '📏',
  description: 'Compute bonus and total allowable position tolerance for a hole at MMC',
  inputSchema: GdntPositionInputs,
  outputSchema: GdntPositionOutputs,
  compute(inputs: GdntPositionInputsType): GdntPositionOutputsType {
    if (inputs.actualSize < inputs.mmcSize) {
      return { bonus: 0, total: 0, pass: false };
    }

    const bonus = inputs.actualSize - inputs.mmcSize;
    const total = inputs.specifiedTol + bonus;
    const pass = inputs.positionError <= total;

    return {
      bonus: Number(bonus.toFixed(3)),
      total: Number(total.toFixed(3)),
      pass,
    };
  },
  render(container: HTMLElement, initialInputs?: Partial<GdntPositionInputsType>) {
    container.innerHTML = TEMPLATE;

    const defaults: GdntPositionInputsType = {
      specifiedTol: 0.1,
      mmcSize: 10.0,
      actualSize: 10.15,
      positionError: 0.08,
      ...initialInputs,
    };

    const fields = {
      specifiedTol: container.querySelector('#gdn-spec') as HTMLInputElement,
      mmcSize: container.querySelector('#gdn-mmc') as HTMLInputElement,
      actualSize: container.querySelector('#gdn-act') as HTMLInputElement,
      positionError: container.querySelector('#gdn-pos') as HTMLInputElement,
    };

    const outputs = {
      bonus: container.querySelector('#gdn-bonus') as HTMLElement,
      total: container.querySelector('#gdn-total') as HTMLElement,
      verdict: container.querySelector('#gdn-verdict') as HTMLElement,
      warning: container.querySelector('#gdn-warning') as HTMLElement,
    };

    function setInputs(values: GdntPositionInputsType) {
      fields.specifiedTol.value = String(values.specifiedTol);
      fields.mmcSize.value = String(values.mmcSize);
      fields.actualSize.value = String(values.actualSize);
      fields.positionError.value = String(values.positionError);
    }

    function update() {
      const inputs: GdntPositionInputsType = {
        specifiedTol: parseFloat(fields.specifiedTol.value) || 0,
        mmcSize: parseFloat(fields.mmcSize.value) || 0,
        actualSize: parseFloat(fields.actualSize.value) || 0,
        positionError: parseFloat(fields.positionError.value) || 0,
      };

      if (inputs.actualSize < inputs.mmcSize) {
        outputs.bonus.textContent = 'Invalid (actual < MMC)';
        outputs.total.textContent = '--';
        outputs.verdict.querySelector('.result-value')!.textContent = '--';
        outputs.warning.textContent = '⚠️ Actual size cannot be less than MMC size';
        outputs.warning.style.display = 'block';
        return;
      }

      outputs.warning.style.display = 'none';

      const result = gdntPositionCalculator.compute(inputs);

      outputs.bonus.textContent = `${result.bonus.toFixed(3)} mm`;
      outputs.total.textContent = `${result.total.toFixed(3)} mm`;

      const verdictEl = outputs.verdict.querySelector('.result-value')!;
      verdictEl.textContent = result.pass ? '✓ Within Tolerance' : '✗ Out of Tolerance';
      verdictEl.style.color = result.pass ? '#2ecc71' : '#e74c3c';
    }

    Object.values(fields).forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });

    setInputs(defaults);
    update();
  },
};