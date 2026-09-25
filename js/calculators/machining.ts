/**
 * Machining Cutting Speed & Feed Calculator
 * Spindle speed, table feed rate, and material removal rate for milling
 */

import { Calculator, MachiningInputs, MachiningOutputs, MachiningInputsType, MachiningOutputsType } from './types.js';

const TEMPLATE = `
<div class="calculator-card">
  <div class="calc-header">
    <div class="calc-icon">⚒️</div>
    <div>
      <h4 class="calc-title">Machining Cutting Speed & Feed Calculator</h4>
      <p class="calc-subtitle">Compute spindle speed, table feed rate, and material removal rate for milling</p>
    </div>
  </div>
  <div class="calc-grid">
    <div class="calc-group">
      <label for="mach-vc">Cutting Speed (Vc) in m/min:</label>
      <select id="mach-vc" data-field="cuttingSpeed">
        <option value="300">Aluminum 6061 (300 m/min)</option>
        <option value="120" selected>Mild Steel (120 m/min)</option>
        <option value="80">Alloy Steel (80 m/min)</option>
        <option value="60">Stainless 304 (60 m/min)</option>
        <option value="40">Titanium Ti-6Al-4V (40 m/min)</option>
        <option value="custom">Custom...</option>
      </select>
      <input type="number" id="mach-vc-custom" data-field="cuttingSpeedCustom" placeholder="Custom Vc" style="display:none; margin-top: 0.4rem;" min="1" step="1">
    </div>
    <div class="calc-group">
      <label for="mach-d">Cutter Diameter (D) in mm:</label>
      <input type="number" id="mach-d" data-field="diameter" min="1" step="1">
    </div>
    <div class="calc-group">
      <label for="mach-z">Flutes / Teeth (z):</label>
      <input type="number" id="mach-z" data-field="flutes" min="1" step="1">
    </div>
    <div class="calc-group">
      <label for="mach-fz">Feed per Tooth (fz) in mm/tooth:</label>
      <input type="number" id="mach-fz" data-field="feedPerTooth" min="0.001" step="0.01">
    </div>
    <div class="calc-group">
      <label for="mach-ap">Axial Depth of Cut (ap) in mm:</label>
      <input type="number" id="mach-ap" data-field="depthOfCut" min="0.1" step="0.5">
    </div>
    <div class="calc-group">
      <label for="mach-ae">Radial Depth of Cut (ae) in mm:</label>
      <input type="number" id="mach-ae" data-field="widthOfCut" min="0.1" step="0.5">
    </div>
  </div>
  <div class="calc-results">
    <div class="result-box highlight">
      <span class="result-label">Spindle Speed (N)</span>
      <span class="result-value" id="mach-n">-- RPM</span>
    </div>
    <div class="result-box">
      <span class="result-label">Table Feed Rate (F)</span>
      <span class="result-value" id="mach-f">-- mm/min</span>
    </div>
    <div class="result-box">
      <span class="result-label">Material Removal Rate (MRR)</span>
      <span class="result-value" id="mach-mrr">-- cm³/min</span>
    </div>
  </div>
</div>
`;

export const machiningCalculator: Calculator<typeof MachiningInputs, typeof MachiningOutputs> = {
  id: 'machining_calculator',
  label: 'Machining',
  icon: '⚒️',
  description: 'Compute spindle speed, table feed rate, and material removal rate for milling',
  inputSchema: MachiningInputs,
  outputSchema: MachiningOutputs,
  compute(inputs: MachiningInputsType): MachiningOutputsType {
    const N = (inputs.cuttingSpeed * 1000) / (Math.PI * inputs.diameter);
    const F = inputs.feedPerTooth * inputs.flutes * N;
    const MRR_cm3 = (inputs.depthOfCut * inputs.widthOfCut * F) / 1000;

    return {
      spindleSpeed: Number(N.toFixed(0)),
      feedRate: Number(F.toFixed(1)),
      mrr: Number(MRR_cm3.toFixed(2)),
    };
  },
  render(container: HTMLElement, initialInputs?: Partial<MachiningInputsType>) {
    container.innerHTML = TEMPLATE;

    const defaults: MachiningInputsType = {
      cuttingSpeed: 120,
      diameter: 16,
      flutes: 4,
      feedPerTooth: 0.08,
      depthOfCut: 6,
      widthOfCut: 12,
      ...initialInputs,
    };

    const fields = {
      cuttingSpeed: container.querySelector('#mach-vc') as HTMLSelectElement,
      cuttingSpeedCustom: container.querySelector('#mach-vc-custom') as HTMLInputElement,
      diameter: container.querySelector('#mach-d') as HTMLInputElement,
      flutes: container.querySelector('#mach-z') as HTMLInputElement,
      feedPerTooth: container.querySelector('#mach-fz') as HTMLInputElement,
      depthOfCut: container.querySelector('#mach-ap') as HTMLInputElement,
      widthOfCut: container.querySelector('#mach-ae') as HTMLInputElement,
    };

    const outputs = {
      n: container.querySelector('#mach-n') as HTMLElement,
      f: container.querySelector('#mach-f') as HTMLElement,
      mrr: container.querySelector('#mach-mrr') as HTMLElement,
    };

    function setInputs(values: MachiningInputsType) {
      fields.cuttingSpeed.value = String(values.cuttingSpeed);
      if (values.cuttingSpeed && !['300', '120', '80', '60', '40'].includes(String(values.cuttingSpeed))) {
        fields.cuttingSpeed.value = 'custom';
        fields.cuttingSpeedCustom.style.display = 'block';
        fields.cuttingSpeedCustom.value = String(values.cuttingSpeed);
      }
      fields.diameter.value = String(values.diameter);
      fields.flutes.value = String(values.flutes);
      fields.feedPerTooth.value = String(values.feedPerTooth);
      fields.depthOfCut.value = String(values.depthOfCut);
      fields.widthOfCut.value = String(values.widthOfCut);
    }

    function getVc(): number {
      if (fields.cuttingSpeed.value === 'custom') {
        return parseFloat(fields.cuttingSpeedCustom.value) || 120;
      }
      return parseFloat(fields.cuttingSpeed.value);
    }

    function update() {
      const inputs: MachiningInputsType = {
        cuttingSpeed: getVc(),
        diameter: parseFloat(fields.diameter.value) || 1,
        flutes: parseInt(fields.flutes.value) || 1,
        feedPerTooth: parseFloat(fields.feedPerTooth.value) || 0,
        depthOfCut: parseFloat(fields.depthOfCut.value) || 0,
        widthOfCut: parseFloat(fields.widthOfCut.value) || 0,
      };

      const result = machiningCalculator.compute(inputs);

      outputs.n.textContent = `${result.spindleSpeed.toFixed(0)} RPM`;
      outputs.f.textContent = `${result.feedRate.toFixed(1)} mm/min`;
      outputs.mrr.textContent = `${result.mrr.toFixed(2)} cm³/min`;
    }

    fields.cuttingSpeed.addEventListener('change', () => {
      fields.cuttingSpeedCustom.style.display = fields.cuttingSpeed.value === 'custom' ? 'block' : 'none';
      update();
    });

    Object.values(fields).forEach(el => {
      if (el && el !== fields.cuttingSpeedCustom) {
        el.addEventListener('input', update);
        el.addEventListener('change', update);
      }
    });
    if (fields.cuttingSpeedCustom) {
      fields.cuttingSpeedCustom.addEventListener('input', update);
    }

    setInputs(defaults);
    update();
  },
};