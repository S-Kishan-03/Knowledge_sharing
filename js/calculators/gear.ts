/**
 * Spur Gear Ratio & Torque Transformer
 * Pitch diameters, center distance, output speed, and output torque
 */

import { Calculator, GearInputs, GearOutputs, GearInputsType, GearOutputsType } from './types.js';

const TEMPLATE = `
<div class="calculator-card">
  <div class="calc-header">
    <div class="calc-icon">⚙️</div>
    <div>
      <h4 class="calc-title">Spur Gear Ratio & Torque Transformer</h4>
      <p class="calc-subtitle">Compute pitch diameters, center distance, output speed, and output torque</p>
    </div>
  </div>
  <div class="calc-grid">
    <div class="calc-group">
      <label for="gear-z1">Pinion Teeth (Z₁):</label>
      <input type="number" id="gear-z1" data-field="z1" min="10" step="1">
    </div>
    <div class="calc-group">
      <label for="gear-z2">Gear Teeth (Z₂):</label>
      <input type="number" id="gear-z2" data-field="z2" min="10" step="1">
    </div>
    <div class="calc-group">
      <label for="gear-m">Module (m) in mm:</label>
      <input type="number" id="gear-m" data-field="module" min="0.5" step="0.5">
    </div>
    <div class="calc-group">
      <label for="gear-rpm1">Pinion Speed (N₁) in RPM:</label>
      <input type="number" id="gear-rpm1" data-field="rpm1" min="1" step="50">
    </div>
    <div class="calc-group">
      <label for="gear-t1">Input Torque (T₁) in N·m:</label>
      <input type="number" id="gear-t1" data-field="torque1" min="1" step="5">
    </div>
  </div>
  <div class="calc-results">
    <div class="result-box highlight">
      <span class="result-label">Gear Ratio (i)</span>
      <span class="result-value" id="gear-ratio">-- : 1</span>
    </div>
    <div class="result-box">
      <span class="result-label">Output Speed (N₂)</span>
      <span class="result-value" id="gear-rpm2">-- RPM</span>
    </div>
    <div class="result-box">
      <span class="result-label">Output Torque (T₂)</span>
      <span class="result-value" id="gear-t2">-- N·m</span>
    </div>
    <div class="result-box">
      <span class="result-label">Center Distance (a)</span>
      <span class="result-value" id="gear-cd">-- mm</span>
    </div>
  </div>
</div>
`;

export const gearCalculator: Calculator<typeof GearInputs, typeof GearOutputs> = {
  id: 'gear_calculator',
  label: 'Spur Gear',
  icon: '⚙️',
  description: 'Compute pitch diameters, center distance, output speed, and output torque',
  inputSchema: GearInputs,
  outputSchema: GearOutputs,
  compute(inputs: GearInputsType): GearOutputsType {
    const ratio = inputs.z2 / inputs.z1;
    const rpm2 = inputs.rpm1 / ratio;
    const torque2 = inputs.torque1 * ratio;
    const centerDist = (inputs.module * (inputs.z1 + inputs.z2)) / 2;

    return {
      ratio: Number(ratio.toFixed(2)),
      rpm2: Number(rpm2.toFixed(1)),
      torque2: Number(torque2.toFixed(1)),
      centerDistance: Number(centerDist.toFixed(1)),
    };
  },
  render(container: HTMLElement, initialInputs?: Partial<GearInputsType>) {
    container.innerHTML = TEMPLATE;

    const defaults: GearInputsType = {
      z1: 20,
      z2: 60,
      module: 3,
      rpm1: 1440,
      torque1: 50,
      ...initialInputs,
    };

    const fields = {
      z1: container.querySelector('#gear-z1') as HTMLInputElement,
      z2: container.querySelector('#gear-z2') as HTMLInputElement,
      module: container.querySelector('#gear-m') as HTMLInputElement,
      rpm1: container.querySelector('#gear-rpm1') as HTMLInputElement,
      torque1: container.querySelector('#gear-t1') as HTMLInputElement,
    };

    const outputs = {
      ratio: container.querySelector('#gear-ratio') as HTMLElement,
      rpm2: container.querySelector('#gear-rpm2') as HTMLElement,
      torque2: container.querySelector('#gear-t2') as HTMLElement,
      centerDistance: container.querySelector('#gear-cd') as HTMLElement,
    };

    function setInputs(values: GearInputsType) {
      fields.z1.value = String(values.z1);
      fields.z2.value = String(values.z2);
      fields.module.value = String(values.module);
      fields.rpm1.value = String(values.rpm1);
      fields.torque1.value = String(values.torque1);
    }

    function update() {
      const inputs: GearInputsType = {
        z1: parseInt(fields.z1.value) || 1,
        z2: parseInt(fields.z2.value) || 1,
        module: parseFloat(fields.module.value) || 1,
        rpm1: parseFloat(fields.rpm1.value) || 0,
        torque1: parseFloat(fields.torque1.value) || 0,
      };

      const result = gearCalculator.compute(inputs);

      outputs.ratio.textContent = `${result.ratio.toFixed(2)} : 1`;
      outputs.rpm2.textContent = `${result.rpm2.toFixed(1)} RPM`;
      outputs.torque2.textContent = `${result.torque2.toFixed(1)} N·m`;
      outputs.centerDistance.textContent = `${result.centerDistance.toFixed(1)} mm`;
    }

    Object.values(fields).forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });

    setInputs(defaults);
    update();
  },
};