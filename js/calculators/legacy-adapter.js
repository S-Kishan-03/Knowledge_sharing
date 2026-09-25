/**
 * Legacy Calculator Adapter
 * Provides the old Calculators API using the new registry system
 * This allows gradual migration without breaking existing topic references
 */

import { calculators, getCalculator } from './index.js';

// HTML templates matching the old structure
const templates = {
  carnot_calculator: `
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
          <label for="th-temp">Hot Reservoir Temp (T<sub>H</sub>):</label>
          <div class="calc-input-row">
            <input type="number" id="th-temp" value="500" min="-100" max="3000" step="10">
            <select id="th-unit">
              <option value="C">°C</option>
              <option value="K">K</option>
            </select>
          </div>
        </div>
        <div class="calc-group">
          <label for="tc-temp">Cold Reservoir Temp (T<sub>C</sub>):</label>
          <div class="calc-input-row">
            <input type="number" id="tc-temp" value="25" min="-273" max="1000" step="5">
            <select id="tc-unit">
              <option value="C">°C</option>
              <option value="K">K</option>
            </select>
          </div>
        </div>
        <div class="calc-group">
          <label for="heat-in">Heat Input (Q<sub>H</sub>) in kJ:</label>
          <input type="number" id="heat-in" value="1000" min="1" step="50">
        </div>
      </div>
      <div class="calc-results">
        <div class="result-box highlight">
          <span class="result-label">Carnot Efficiency (η)</span>
          <span class="result-value" id="carnot-eff-res">-- %</span>
        </div>
        <div class="result-box">
          <span class="result-label">Max Work Output (W)</span>
          <span class="result-value" id="carnot-work-res">-- kJ</span>
        </div>
        <div class="result-box">
          <span class="result-label">Rejected Heat (Q<sub>C</sub>)</span>
          <span class="result-value" id="carnot-qc-res">-- kJ</span>
        </div>
      </div>
    </div>
  `,
  bernoulli_calculator: `
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
          <label for="d1">Inlet Diameter (D₁) in mm:</label>
          <input type="number" id="d1" value="100" min="5" step="5">
        </div>
        <div class="calc-group">
          <label for="d2">Constriction Diameter (D₂) in mm:</label>
          <input type="number" id="d2" value="50" min="5" step="5">
        </div>
        <div class="calc-group">
          <label for="v1">Inlet Velocity (v₁) in m/s:</label>
          <input type="number" id="v1" value="2.0" min="0.1" step="0.5">
        </div>
        <div class="calc-group">
          <label for="fluid-rho">Fluid Density (ρ) in kg/m³:</label>
          <select id="fluid-rho">
            <option value="1000">Water (1000 kg/m³)</option>
            <option value="1.225">Air (1.225 kg/m³)</option>
            <option value="870">Hydraulic Oil (870 kg/m³)</option>
          </select>
        </div>
      </div>
      <div class="calc-results">
        <div class="result-box">
          <span class="result-label">Constriction Velocity (v₂)</span>
          <span class="result-value" id="b-v2-res">-- m/s</span>
        </div>
        <div class="result-box highlight">
          <span class="result-label">Volumetric Flow Rate (Q)</span>
          <span class="result-value" id="b-q-res">-- L/s</span>
        </div>
        <div class="result-box">
          <span class="result-label">Dynamic Pressure Drop (ΔP)</span>
          <span class="result-value" id="b-dp-res">-- kPa</span>
        </div>
      </div>
    </div>
  `,
  stress_calculator: `
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
          <label for="force">Axial Load (F) in kN:</label>
          <input type="number" id="force" value="50" min="0.1" step="5">
        </div>
        <div class="calc-group">
          <label for="diameter">Bar Diameter (d) in mm:</label>
          <input type="number" id="diameter" value="20" min="1" step="1">
        </div>
        <div class="calc-group">
          <label for="length">Initial Length (L₀) in mm:</label>
          <input type="number" id="length" value="1000" min="10" step="100">
        </div>
        <div class="calc-group">
          <label for="material-e">Young&apos;s Modulus (E):</label>
          <select id="material-e">
            <option value="200">Structural Steel (200 GPa)</option>
            <option value="70">Aluminum (70 GPa)</option>
            <option value="110">Titanium (110 GPa)</option>
            <option value="105">Brass (105 GPa)</option>
          </select>
        </div>
      </div>
      <div class="calc-results">
        <div class="result-box highlight">
          <span class="result-label">Normal Stress (σ)</span>
          <span class="result-value" id="stress-val">-- MPa</span>
        </div>
        <div class="result-box">
          <span class="result-label">Strain (ε)</span>
          <span class="result-value" id="strain-val">--</span>
        </div>
        <div class="result-box">
          <span class="result-label">Elongation (ΔL)</span>
          <span class="result-value" id="elongation-val">-- mm</span>
        </div>
      </div>
    </div>
  `,
  gear_calculator: `
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
          <label for="z1">Pinion Teeth (Z₁):</label>
          <input type="number" id="z1" value="20" min="10" step="1">
        </div>
        <div class="calc-group">
          <label for="z2">Gear Teeth (Z₂):</label>
          <input type="number" id="z2" value="60" min="10" step="1">
        </div>
        <div class="calc-group">
          <label for="gear-module">Module (m) in mm:</label>
          <input type="number" id="gear-module" value="3" min="0.5" step="0.5">
        </div>
        <div class="calc-group">
          <label for="rpm1">Pinion Speed (N₁) in RPM:</label>
          <input type="number" id="rpm1" value="1440" min="1" step="50">
        </div>
        <div class="calc-group">
          <label for="torque1">Input Torque (T₁) in N·m:</label>
          <input type="number" id="torque1" value="50" min="1" step="5">
        </div>
      </div>
      <div class="calc-results">
        <div class="result-box highlight">
          <span class="result-label">Gear Ratio (i)</span>
          <span class="result-value" id="gear-ratio-res">-- : 1</span>
        </div>
        <div class="result-box">
          <span class="result-label">Output Speed (N₂)</span>
          <span class="result-value" id="gear-rpm2-res">-- RPM</span>
        </div>
        <div class="result-box">
          <span class="result-label">Output Torque (T₂)</span>
          <span class="result-value" id="gear-t2-res">-- N·m</span>
        </div>
        <div class="result-box">
          <span class="result-label">Center Distance (a)</span>
          <span class="result-value" id="gear-cd-res">-- mm</span>
        </div>
      </div>
    </div>
  `,
  machining_calculator: `
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
          <label for="m-vc">Cutting Speed (Vc) in m/min:</label>
          <select id="m-vc">
            <option value="300">Aluminum 6061 (300 m/min)</option>
            <option value="120" selected>Mild Steel (120 m/min)</option>
            <option value="80">Alloy Steel (80 m/min)</option>
            <option value="60">Stainless 304 (60 m/min)</option>
            <option value="40">Titanium Ti-6Al-4V (40 m/min)</option>
          </select>
        </div>
        <div class="calc-group">
          <label for="m-d">Cutter Diameter (D) in mm:</label>
          <input type="number" id="m-d" value="16" min="1" step="1">
        </div>
        <div class="calc-group">
          <label for="m-z">Flutes / Teeth (z):</label>
          <input type="number" id="m-z" value="4" min="1" step="1">
        </div>
        <div class="calc-group">
          <label for="m-fz">Feed per Tooth (f<sub>z</sub>) in mm/tooth:</label>
          <input type="number" id="m-fz" value="0.08" min="0.001" step="0.01">
        </div>
        <div class="calc-group">
          <label for="m-ap">Axial Depth of Cut (a<sub>p</sub>) in mm:</label>
          <input type="number" id="m-ap" value="6" min="0.1" step="0.5">
        </div>
        <div class="calc-group">
          <label for="m-ae">Radial Depth of Cut (a<sub>e</sub>) in mm:</label>
          <input type="number" id="m-ae" value="12" min="0.1" step="0.5">
        </div>
      </div>
      <div class="calc-results">
        <div class="result-box highlight">
          <span class="result-label">Spindle Speed (N)</span>
          <span class="result-value" id="m-n-res">-- RPM</span>
        </div>
        <div class="result-box">
          <span class="result-label">Table Feed Rate (F)</span>
          <span class="result-value" id="m-f-res">-- mm/min</span>
        </div>
        <div class="result-box">
          <span class="result-label">Material Removal Rate (MRR)</span>
          <span class="result-value" id="m-mrr-res">-- cm³/min</span>
        </div>
      </div>
    </div>
  `,
  gdnt_position_calculator: `
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
          <label for="g-spec">Specified Position Tol (T<sub>spec</sub>) in mm:</label>
          <input type="number" id="g-spec" value="0.1" min="0.001" step="0.01">
        </div>
        <div class="calc-group">
          <label for="g-mmc">MMC Hole Size (D<sub>MMC</sub>) in mm:</label>
          <input type="number" id="g-mmc" value="10.0" min="0.1" step="0.1">
        </div>
        <div class="calc-group">
          <label for="g-actual">Actual Hole Size (D<sub>actual</sub>) in mm:</label>
          <input type="number" id="g-actual" value="10.15" min="0.1" step="0.01">
        </div>
        <div class="calc-group">
          <label for="g-poserr">Measured Position Error (mm):</label>
          <input type="number" id="g-poserr" value="0.08" min="0" step="0.01">
        </div>
      </div>
      <div class="calc-results">
        <div class="result-box">
          <span class="result-label">Bonus Tolerance (T<sub>bonus</sub>)</span>
          <span class="result-value" id="g-bonus-res">-- mm</span>
        </div>
        <div class="result-box highlight">
          <span class="result-label">Total Allowable Position Tol.</span>
          <span class="result-value" id="g-total-res">-- mm</span>
        </div>
        <div class="result-box">
          <span class="result-label">Inspection Result</span>
          <span class="result-value" id="g-verdict-res">--</span>
        </div>
      </div>
    </div>
  `,
};

// Compute functions (matching old API)
function toKelvin(value, unit) {
  return unit === 'C' ? value + 273.15 : value;
}

const computeFns = {
  carnot_calculator: () => {
    const Th = parseFloat(document.getElementById('th-temp').value) || 0;
    const Tc = parseFloat(document.getElementById('tc-temp').value) || 0;
    const thUnit = document.getElementById('th-unit').value;
    const tcUnit = document.getElementById('tc-unit').value;
    const Qh = parseFloat(document.getElementById('heat-in').value) || 0;

    const Th_K = toKelvin(Th, thUnit);
    const Tc_K = toKelvin(Tc, tcUnit);

    if (Tc_K <= 0 || Th_K <= 0 || Tc_K >= Th_K) {
      document.getElementById('carnot-eff-res').innerText = 'Invalid Temps';
      document.getElementById('carnot-work-res').innerText = '--';
      document.getElementById('carnot-qc-res').innerText = '--';
      return;
    }

    const eff = 1 - (Tc_K / Th_K);
    const effPct = (eff * 100).toFixed(2);
    const W = (Qh * eff).toFixed(2);
    const Qc = (Qh - W).toFixed(2);

    document.getElementById('carnot-eff-res').innerText = `${effPct}%`;
    document.getElementById('carnot-work-res').innerText = `${W} kJ`;
    document.getElementById('carnot-qc-res').innerText = `${Qc} kJ`;
  },
  bernoulli_calculator: () => {
    const d1_mm = parseFloat(document.getElementById('d1').value) || 1;
    const d2_mm = parseFloat(document.getElementById('d2').value) || 1;
    const v1 = parseFloat(document.getElementById('v1').value) || 0;
    const rho = parseFloat(document.getElementById('fluid-rho').value) || 1000;

    const r1 = (d1_mm / 1000) / 2;
    const r2 = (d2_mm / 1000) / 2;
    const a1 = Math.PI * r1 * r1;
    const a2 = Math.PI * r2 * r2;

    const v2 = (a1 * v1) / a2;
    const Q_m3s = a1 * v1;
    const Q_Ls = Q_m3s * 1000;
    const deltaP_Pa = 0.5 * rho * (v2 * v2 - v1 * v1);
    const deltaP_kPa = deltaP_Pa / 1000;

    document.getElementById('b-v2-res').innerText = `${v2.toFixed(2)} m/s`;
    document.getElementById('b-q-res').innerText = `${Q_Ls.toFixed(2)} L/s`;
    document.getElementById('b-dp-res').innerText = `${deltaP_kPa.toFixed(2)} kPa`;
  },
  stress_calculator: () => {
    const Force_kN = parseFloat(document.getElementById('force').value) || 0;
    const dia_mm = parseFloat(document.getElementById('diameter').value) || 1;
    const L0_mm = parseFloat(document.getElementById('length').value) || 1;
    const E_GPa = parseFloat(document.getElementById('material-e').value) || 200;

    const Force_N = Force_kN * 1000;
    const Area_mm2 = (Math.PI / 4) * (dia_mm * dia_mm);
    const E_MPa = E_GPa * 1000;

    const stress_MPa = Force_N / Area_mm2;
    const strain = stress_MPa / E_MPa;
    const deltaL_mm = strain * L0_mm;

    document.getElementById('stress-val').innerText = `${stress_MPa.toFixed(2)} MPa`;
    document.getElementById('strain-val').innerText = strain.toExponential(4);
    document.getElementById('elongation-val').innerText = `${deltaL_mm.toFixed(3)} mm`;
  },
  gear_calculator: () => {
    const z1 = parseInt(document.getElementById('z1').value) || 1;
    const z2 = parseInt(document.getElementById('z2').value) || 1;
    const mod = parseFloat(document.getElementById('gear-module').value) || 1;
    const N1 = parseFloat(document.getElementById('rpm1').value) || 0;
    const T1 = parseFloat(document.getElementById('torque1').value) || 0;

    const ratio = z2 / z1;
    const N2 = N1 / ratio;
    const T2 = T1 * ratio;
    const centerDist = (mod * (z1 + z2)) / 2;

    document.getElementById('gear-ratio-res').innerText = `${ratio.toFixed(2)} : 1`;
    document.getElementById('gear-rpm2-res').innerText = `${N2.toFixed(1)} RPM`;
    document.getElementById('gear-t2-res').innerText = `${T2.toFixed(1)} N·m`;
    document.getElementById('gear-cd-res').innerText = `${centerDist.toFixed(1)} mm`;
  },
  machining_calculator: () => {
    const Vc = parseFloat(document.getElementById('m-vc').value) || 100;
    const D = parseFloat(document.getElementById('m-d').value) || 1;
    const z = parseInt(document.getElementById('m-z').value) || 1;
    const fz = parseFloat(document.getElementById('m-fz').value) || 0;
    const ap = parseFloat(document.getElementById('m-ap').value) || 0;
    const ae = parseFloat(document.getElementById('m-ae').value) || 0;

    const N = (Vc * 1000) / (Math.PI * D);
    const F = fz * z * N;
    const MRR_cm3 = (ap * ae * F) / 1000;

    document.getElementById('m-n-res').innerText = `${N.toFixed(0)} RPM`;
    document.getElementById('m-f-res').innerText = `${F.toFixed(1)} mm/min`;
    document.getElementById('m-mrr-res').innerText = `${MRR_cm3.toFixed(2)} cm³/min`;
  },
  gdnt_position_calculator: () => {
    const Tspec = parseFloat(document.getElementById('g-spec').value) || 0;
    const Dmmc = parseFloat(document.getElementById('g-mmc').value) || 0;
    const Dact = parseFloat(document.getElementById('g-actual').value) || 0;
    const posErr = parseFloat(document.getElementById('g-poserr').value) || 0;

    if (Dact < Dmmc) {
      document.getElementById('g-bonus-res').innerText = 'Invalid (actual < MMC)';
      document.getElementById('g-total-res').innerText = '--';
      document.getElementById('g-verdict-res').innerText = '--';
      return;
    }

    const bonus = Dact - Dmmc;
    const total = Tspec + bonus;
    const pass = posErr <= total;

    document.getElementById('g-bonus-res').innerText = `${bonus.toFixed(3)} mm`;
    document.getElementById('g-total-res').innerText = `${total.toFixed(3)} mm`;

    const verdict = document.getElementById('g-verdict-res');
    verdict.innerText = pass ? '✓ Within Tolerance' : '✗ Out of Tolerance';
    verdict.style.color = pass ? '#2ecc71' : '#e74c3c';
  },
};

// Legacy Calculators object (maintains backward compatibility)
const Calculators = {
  calculatorTypes: [
    'carnot_calculator',
    'bernoulli_calculator',
    'stress_calculator',
    'gear_calculator',
    'machining_calculator',
    'gdnt_position_calculator',
  ],

  getCount() {
    return this.calculatorTypes.length;
  },

  render(calculatorType, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const template = templates[calculatorType];
    if (!template) {
      container.innerHTML = `<div class="calc-placeholder">Calculator '${calculatorType}' not found.</div>`;
      return;
    }

    container.innerHTML = template;

    const computeFn = computeFns[calculatorType];
    if (computeFn) {
      // Attach event listeners to all inputs in the container
      const inputs = container.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', computeFn);
        input.addEventListener('change', computeFn);
      });
      // Initial computation
      computeFn();
    }
  },
};

// Export for both module and global usage
if (typeof window !== 'undefined') {
  window.Calculators = Calculators;
}

export { Calculators };
export default Calculators;