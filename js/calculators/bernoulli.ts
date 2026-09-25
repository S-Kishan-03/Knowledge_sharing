/**
 * Bernoulli & Pipe Flow Calculator
 * Fluid velocity and dynamic pressure differential across pipe reduction
 */

import { Calculator, BernoulliInputs, BernoulliOutputs, BernoulliInputsType, BernoulliOutputsType } from './types.js';

const TEMPLATE = `
<div class="calculator-card">
  <div class="calc-header">
    <div class="calc-icon">🌊</div>
    <div>
      <h4 class="calc-title">Fluid Continuity & Pressure Drop Calculator</h4>
      <p class="calc-subtitle">Compute fluid velocity and dynamic pressure differential across pipe reduction</p>
    </div>
  </div>
  <div class="calc-grid">
    <div class="calc-group">
      <label for="bernoulli-d1">Inlet Diameter (D₁) in mm:</label>
      <input type="number" id="bernoulli-d1" data-field="d1" min="5" step="5">
    </div>
    <div class="calc-group">
      <label for="bernoulli-d2">Constriction Diameter (D₂) in mm:</label>
      <input type="number" id="bernoulli-d2" data-field="d2" min="5" step="5">
    </div>
    <div class="calc-group">
      <label for="bernoulli-v1">Inlet Velocity (v₁) in m/s:</label>
      <input type="number" id="bernoulli-v1" data-field="v1" min="0.1" step="0.5">
    </div>
    <div class="calc-group">
      <label for="bernoulli-rho">Fluid Density (ρ) in kg/m³:</label>
      <select id="bernoulli-rho" data-field="rho">
        <option value="1000">Water (1000 kg/m³)</option>
        <option value="1.225">Air (1.225 kg/m³)</option>
        <option value="870">Hydraulic Oil (870 kg/m³)</option>
        <option value="custom">Custom...</option>
      </select>
      <input type="number" id="bernoulli-rho-custom" data-field="rhoCustom" placeholder="Custom density" style="display:none; margin-top: 0.4rem;" min="0.1" step="1">
    </div>
  </div>
  <div class="calc-results">
    <div class="result-box">
      <span class="result-label">Constriction Velocity (v₂)</span>
      <span class="result-value" id="bernoulli-v2">-- m/s</span>
    </div>
    <div class="result-box highlight">
      <span class="result-label">Volumetric Flow Rate (Q)</span>
      <span class="result-value" id="bernoulli-q">-- L/s</span>
    </div>
    <div class="result-box">
      <span class="result-label">Dynamic Pressure Drop (ΔP)</span>
      <span class="result-value" id="bernoulli-dp">-- kPa</span>
    </div>
  </div>
</div>
`;

export const bernoulliCalculator: Calculator<typeof BernoulliInputs, typeof BernoulliOutputs> = {
  id: 'bernoulli_calculator',
  label: 'Bernoulli Flow',
  icon: '🌊',
  description: 'Compute fluid velocity and dynamic pressure differential across pipe reduction',
  inputSchema: BernoulliInputs,
  outputSchema: BernoulliOutputs,
  compute(inputs: BernoulliInputsType): BernoulliOutputsType {
    const r1 = (inputs.d1 / 1000) / 2;
    const r2 = (inputs.d2 / 1000) / 2;
    const a1 = Math.PI * r1 * r1;
    const a2 = Math.PI * r2 * r2;

    const v2 = (a1 * inputs.v1) / a2;
    const q_m3s = a1 * inputs.v1;
    const q_Ls = q_m3s * 1000;
    const deltaP_Pa = 0.5 * inputs.rho * (v2 * v2 - inputs.v1 * inputs.v1);
    const deltaP_kPa = deltaP_Pa / 1000;

    return {
      v2: Number(v2.toFixed(2)),
      flowRate: Number(q_Ls.toFixed(2)),
      deltaP: Number(deltaP_kPa.toFixed(2)),
    };
  },
  render(container: HTMLElement, initialInputs?: Partial<BernoulliInputsType>) {
    container.innerHTML = TEMPLATE;

    const defaults: BernoulliInputsType = {
      d1: 100,
      d2: 50,
      v1: 2.0,
      rho: 1000,
      ...initialInputs,
    };

    const fields = {
      d1: container.querySelector('#bernoulli-d1') as HTMLInputElement,
      d2: container.querySelector('#bernoulli-d2') as HTMLInputElement,
      v1: container.querySelector('#bernoulli-v1') as HTMLInputElement,
      rho: container.querySelector('#bernoulli-rho') as HTMLSelectElement,
      rhoCustom: container.querySelector('#bernoulli-rho-custom') as HTMLInputElement,
    };

    const outputs = {
      v2: container.querySelector('#bernoulli-v2') as HTMLElement,
      q: container.querySelector('#bernoulli-q') as HTMLElement,
      dp: container.querySelector('#bernoulli-dp') as HTMLElement,
    };

    function setInputs(values: BernoulliInputsType) {
      fields.d1.value = String(values.d1);
      fields.d2.value = String(values.d2);
      fields.v1.value = String(values.v1);
      fields.rho.value = String(values.rho);
      if (values.rho && !['1000', '1.225', '870'].includes(String(values.rho))) {
        fields.rho.value = 'custom';
        fields.rhoCustom.style.display = 'block';
        fields.rhoCustom.value = String(values.rho);
      }
    }

    function getRho(): number {
      if (fields.rho.value === 'custom') {
        return parseFloat(fields.rhoCustom.value) || 1000;
      }
      return parseFloat(fields.rho.value);
    }

    function update() {
      const inputs: BernoulliInputsType = {
        d1: parseFloat(fields.d1.value) || 1,
        d2: parseFloat(fields.d2.value) || 1,
        v1: parseFloat(fields.v1.value) || 0,
        rho: getRho(),
      };

      const result = bernoulliCalculator.compute(inputs);

      outputs.v2.textContent = `${result.v2.toFixed(2)} m/s`;
      outputs.q.textContent = `${result.flowRate.toFixed(2)} L/s`;
      outputs.dp.textContent = `${result.deltaP.toFixed(2)} kPa`;
    }

    fields.rho.addEventListener('change', () => {
      fields.rhoCustom.style.display = fields.rho.value === 'custom' ? 'block' : 'none';
      update();
    });

    Object.values(fields).forEach(el => {
      if (el && el !== fields.rhoCustom) {
        el.addEventListener('input', update);
        el.addEventListener('change', update);
      }
    });
    if (fields.rhoCustom) {
      fields.rhoCustom.addEventListener('input', update);
    }

    setInputs(defaults);
    update();
  },
};