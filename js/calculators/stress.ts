/**
 * Axial Stress, Strain & Elongation Calculator
 * Tension/compression stress and total bar deflection under load
 */

import { Calculator, StressInputs, StressOutputs, StressInputsType, StressOutputsType } from './types.js';

const TEMPLATE = `
<div class="calculator-card">
  <div class="calc-header">
    <div class="calc-icon">🏗️</div>
    <div>
      <h4 class="calc-title">Axial Stress, Strain & Elongation Calculator</h4>
      <p class="calc-subtitle">Compute tension/compression stress and total bar deflection under load</p>
    </div>
  </div>
  <div class="calc-grid">
    <div class="calc-group">
      <label for="stress-force">Axial Load (F) in kN:</label>
      <input type="number" id="stress-force" data-field="force" min="0.1" step="5">
    </div>
    <div class="calc-group">
      <label for="stress-dia">Bar Diameter (d) in mm:</label>
      <input type="number" id="stress-dia" data-field="diameter" min="1" step="1">
    </div>
    <div class="calc-group">
      <label for="stress-len">Initial Length (L₀) in mm:</label>
      <input type="number" id="stress-len" data-field="length" min="10" step="100">
    </div>
    <div class="calc-group">
      <label for="stress-e">Young&apos;s Modulus (E):</label>
      <select id="stress-e" data-field="youngsModulus">
        <option value="200">Structural Steel (200 GPa)</option>
        <option value="70">Aluminum (70 GPa)</option>
        <option value="110">Titanium (110 GPa)</option>
        <option value="105">Brass (105 GPa)</option>
        <option value="custom">Custom...</option>
      </select>
      <input type="number" id="stress-e-custom" data-field="youngsModulusCustom" placeholder="Custom E (GPa)" style="display:none; margin-top: 0.4rem;" min="0.1" step="1">
    </div>
  </div>
  <div class="calc-results">
    <div class="result-box highlight">
      <span class="result-label">Normal Stress (σ)</span>
      <span class="result-value" id="stress-stress">-- MPa</span>
    </div>
    <div class="result-box">
      <span class="result-label">Strain (ε)</span>
      <span class="result-value" id="stress-strain">--</span>
    </div>
    <div class="result-box">
      <span class="result-label">Elongation (ΔL)</span>
      <span class="result-value" id="stress-elongation">-- mm</span>
    </div>
  </div>
</div>
`;

export const stressCalculator: Calculator<typeof StressInputs, typeof StressOutputs> = {
  id: 'stress_calculator',
  label: 'Stress/Strain',
  icon: '🏗️',
  description: 'Compute tension/compression stress and total bar deflection under load',
  inputSchema: StressInputs,
  outputSchema: StressOutputs,
  compute(inputs: StressInputsType): StressOutputsType {
    const force_N = inputs.force * 1000;
    const area_mm2 = (Math.PI / 4) * (inputs.diameter * inputs.diameter);
    const E_MPa = inputs.youngsModulus * 1000;

    const stress_MPa = force_N / area_mm2;
    const strain = stress_MPa / E_MPa;
    const deltaL_mm = strain * inputs.length;

    return {
      stress: Number(stress_MPa.toFixed(2)),
      strain: Number(strain.toExponential(4)),
      elongation: Number(deltaL_mm.toFixed(3)),
    };
  },
  render(container: HTMLElement, initialInputs?: Partial<StressInputsType>) {
    container.innerHTML = TEMPLATE;

    const defaults: StressInputsType = {
      force: 50,
      diameter: 20,
      length: 1000,
      youngsModulus: 200,
      ...initialInputs,
    };

    const fields = {
      force: container.querySelector('#stress-force') as HTMLInputElement,
      diameter: container.querySelector('#stress-dia') as HTMLInputElement,
      length: container.querySelector('#stress-len') as HTMLInputElement,
      youngsModulus: container.querySelector('#stress-e') as HTMLSelectElement,
      youngsModulusCustom: container.querySelector('#stress-e-custom') as HTMLInputElement,
    };

    const outputs = {
      stress: container.querySelector('#stress-stress') as HTMLElement,
      strain: container.querySelector('#stress-strain') as HTMLElement,
      elongation: container.querySelector('#stress-elongation') as HTMLElement,
    };

    function setInputs(values: StressInputsType) {
      fields.force.value = String(values.force);
      fields.diameter.value = String(values.diameter);
      fields.length.value = String(values.length);
      fields.youngsModulus.value = String(values.youngsModulus);
      if (values.youngsModulus && !['200', '70', '110', '105'].includes(String(values.youngsModulus))) {
        fields.youngsModulus.value = 'custom';
        fields.youngsModulusCustom.style.display = 'block';
        fields.youngsModulusCustom.value = String(values.youngsModulus);
      }
    }

    function getE(): number {
      if (fields.youngsModulus.value === 'custom') {
        return parseFloat(fields.youngsModulusCustom.value) || 200;
      }
      return parseFloat(fields.youngsModulus.value);
    }

    function update() {
      const inputs: StressInputsType = {
        force: parseFloat(fields.force.value) || 0,
        diameter: parseFloat(fields.diameter.value) || 1,
        length: parseFloat(fields.length.value) || 1,
        youngsModulus: getE(),
      };

      const result = stressCalculator.compute(inputs);

      outputs.stress.textContent = `${result.stress.toFixed(2)} MPa`;
      outputs.strain.textContent = result.strain;
      outputs.elongation.textContent = `${result.elongation.toFixed(3)} mm`;
    }

    fields.youngsModulus.addEventListener('change', () => {
      fields.youngsModulusCustom.style.display = fields.youngsModulus.value === 'custom' ? 'block' : 'none';
      update();
    });

    Object.values(fields).forEach(el => {
      if (el && el !== fields.youngsModulusCustom) {
        el.addEventListener('input', update);
        el.addEventListener('change', update);
      }
    });
    if (fields.youngsModulusCustom) {
      fields.youngsModulusCustom.addEventListener('input', update);
    }

    setInputs(defaults);
    update();
  },
};