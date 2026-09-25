/**
 * Carnot Efficiency Calculator
 * Maximum theoretical thermodynamic efficiency & work output
 */

import { Calculator, CarnotInputs, CarnotOutputs, CarnotInputsType, CarnotOutputsType } from './types.js';

const TEMPLATE = `
<div class="calculator-card">
  <div class="calc-header">
    <div class="calc-icon">⚡</div>
    <div>
      <h4 class="calc-title">Carnot Engine Efficiency Calculator</h4>
      <p class="calc-subtitle">Calculate maximum theoretical thermodynamic efficiency & work output</p>
    </div>
  </div>
  <div class="calc-grid">
    <div class="calc-group">
      <label for="carnot-th">Hot Reservoir Temp (T<sub>H</sub>):</label>
      <div class="calc-input-row">
        <input type="number" id="carnot-th" data-field="th" min="-100" max="3000" step="10">
        <select id="carnot-th-unit" data-field="thUnit">
          <option value="C">°C</option>
          <option value="K">K</option>
        </select>
      </div>
    </div>
    <div class="calc-group">
      <label for="carnot-tc">Cold Reservoir Temp (T<sub>C</sub>):</label>
      <div class="calc-input-row">
        <input type="number" id="carnot-tc" data-field="tc" min="-273" max="1000" step="5">
        <select id="carnot-tc-unit" data-field="tcUnit">
          <option value="C">°C</option>
          <option value="K">K</option>
        </select>
      </div>
    </div>
    <div class="calc-group">
      <label for="carnot-qh">Heat Input (Q<sub>H</sub>) in kJ:</label>
      <input type="number" id="carnot-qh" data-field="qh" min="1" step="50">
    </div>
  </div>
  <div class="calc-results">
    <div class="result-box highlight">
      <span class="result-label">Carnot Efficiency (η)</span>
      <span class="result-value" id="carnot-eff">-- %</span>
    </div>
    <div class="result-box">
      <span class="result-label">Max Work Output (W)</span>
      <span class="result-value" id="carnot-work">-- kJ</span>
    </div>
    <div class="result-box">
      <span class="result-label">Rejected Heat (Q<sub>C</sub>)</span>
      <span class="result-value" id="carnot-qc">-- kJ</span>
    </div>
    <div class="result-box" id="carnot-warning" style="display:none; grid-column: 1/-1; color: #f87171; font-size: 0.85rem;"></div>
  </div>
</div>
`;

function toKelvin(value: number, unit: 'C' | 'K'): number {
  return unit === 'C' ? value + 273.15 : value;
}

export const carnotCalculator: Calculator<typeof CarnotInputs, typeof CarnotOutputs> = {
  id: 'carnot_calculator',
  label: 'Carnot Efficiency',
  icon: '⚡',
  description: 'Calculate maximum theoretical thermodynamic efficiency & work output',
  inputSchema: CarnotInputs,
  outputSchema: CarnotOutputs,
  compute(inputs: CarnotInputsType): CarnotOutputsType {
    const Th_K = toKelvin(inputs.th, inputs.thUnit);
    const Tc_K = toKelvin(inputs.tc, inputs.tcUnit);

    if (Tc_K <= 0 || Th_K <= 0 || Tc_K >= Th_K) {
      return { efficiency: 0, work: 0, qc: 0, valid: false };
    }

    const eff = 1 - (Tc_K / Th_K);
    const work = inputs.qh * eff;
    const qc = inputs.qh - work;

    return {
      efficiency: Number(eff.toFixed(4)),
      work: Number(work.toFixed(2)),
      qc: Number(qc.toFixed(2)),
      valid: true,
    };
  },
  render(container: HTMLElement, initialInputs?: Partial<CarnotInputsType>) {
    container.innerHTML = TEMPLATE;

    const defaults: CarnotInputsType = {
      th: 500,
      thUnit: 'C',
      tc: 25,
      tcUnit: 'C',
      qh: 1000,
      ...initialInputs,
    };

    const fields = {
      th: container.querySelector('#carnot-th') as HTMLInputElement,
      thUnit: container.querySelector('#carnot-th-unit') as HTMLSelectElement,
      tc: container.querySelector('#carnot-tc') as HTMLInputElement,
      tcUnit: container.querySelector('#carnot-tc-unit') as HTMLSelectElement,
      qh: container.querySelector('#carnot-qh') as HTMLInputElement,
    };

    const outputs = {
      efficiency: container.querySelector('#carnot-eff') as HTMLElement,
      work: container.querySelector('#carnot-work') as HTMLElement,
      qc: container.querySelector('#carnot-qc') as HTMLElement,
      warning: container.querySelector('#carnot-warning') as HTMLElement,
    };

    function setInputs(values: CarnotInputsType) {
      fields.th.value = String(values.th);
      fields.thUnit.value = values.thUnit;
      fields.tc.value = String(values.tc);
      fields.tcUnit.value = values.tcUnit;
      fields.qh.value = String(values.qh);
    }

    function update() {
      const inputs: CarnotInputsType = {
        th: parseFloat(fields.th.value) || 0,
        thUnit: fields.thUnit.value as 'C' | 'K',
        tc: parseFloat(fields.tc.value) || 0,
        tcUnit: fields.tcUnit.value as 'C' | 'K',
        qh: parseFloat(fields.qh.value) || 0,
      };

      const result = carnotCalculator.compute(inputs);

      if (!result.valid) {
        outputs.efficiency.textContent = 'Invalid Temps';
        outputs.work.textContent = '--';
        outputs.qc.textContent = '--';
        outputs.warning.textContent = '⚠️ T<sub>C</sub> must be > 0 K and < T<sub>H</sub>';
        outputs.warning.style.display = 'block';
      } else {
        outputs.efficiency.textContent = `${(result.efficiency * 100).toFixed(2)}%`;
        outputs.work.textContent = `${result.work.toFixed(2)} kJ`;
        outputs.qc.textContent = `${result.qc.toFixed(2)} kJ`;
        outputs.warning.style.display = 'none';
      }
    }

    Object.values(fields).forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });

    setInputs(defaults);
    update();
  },
};