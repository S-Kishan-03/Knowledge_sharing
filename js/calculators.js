/**
 * MechWiki Calculators - Modular Architecture with Legacy Compatibility
 * 
 * This file combines the new TypeScript-inspired modular calculator system
 * with the legacy Calculators API for backward compatibility.
 * 
 * Architecture:
 * - Calculator registry with Zod-like validation schemas
 * - Type-safe compute functions
 * - Declarative HTML templates
 * - Automatic event binding
 * - Legacy Calculators.render() API preserved
 */

(function() {
  'use strict';

  // ============================================================================
  // Validation Helpers (Zod-inspired)
  // ============================================================================
  const Validators = {
    number: (min, max) => (v) => {
      const n = Number(v);
      return !isNaN(n) && (min === undefined || n >= min) && (max === undefined || n <= max);
    },
    positive: () => (v) => {
      const n = Number(v);
      return !isNaN(n) && n > 0;
    },
    integer: (min) => (v) => {
      const n = Number(v);
      return Number.isInteger(n) && (min === undefined || n >= min);
    },
    enum: (...values) => (v) => values.includes(v),
  };

  function validate(schema, data) {
    const errors = {};
    for (const [key, validator] of Object.entries(schema)) {
      if (!validator(data[key])) {
        errors[key] = `Invalid value for ${key}`;
      }
    }
    return { valid: Object.keys(errors).length === 0, errors, data };
  }

  // ============================================================================
  // Calculator Definitions
  // ============================================================================
  const calculatorRegistry = new Map();

  function registerCalculator(calc) {
    calculatorRegistry.set(calc.id, calc);
  }

  function getCalculator(id) {
    return calculatorRegistry.get(id);
  }

  function getAllCalculators() {
    return Array.from(calculatorRegistry.values());
  }

  // ---- Carnot ----
  registerCalculator({
    id: 'carnot_calculator',
    label: 'Carnot Efficiency',
    icon: '⚡',
    description: 'Maximum theoretical thermodynamic efficiency & work output',
    template: `
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
              <input type="number" data-field="th" value="500" min="-100" max="3000" step="10">
              <select data-field="thUnit">
                <option value="C">°C</option>
                <option value="K">K</option>
              </select>
            </div>
          </div>
          <div class="calc-group">
            <label for="tc-temp">Cold Reservoir Temp (T<sub>C</sub>):</label>
            <div class="calc-input-row">
              <input type="number" data-field="tc" value="25" min="-273" max="1000" step="5">
              <select data-field="tcUnit">
                <option value="C">°C</option>
                <option value="K">K</option>
              </select>
            </div>
          </div>
          <div class="calc-group">
            <label for="heat-in">Heat Input (Q<sub>H</sub>) in kJ:</label>
            <input type="number" data-field="qh" value="1000" min="1" step="50">
          </div>
        </div>
        <div class="calc-results">
          <div class="result-box highlight">
            <span class="result-label">Carnot Efficiency (η)</span>
            <span class="result-value" data-output="efficiency">-- %</span>
          </div>
          <div class="result-box">
            <span class="result-label">Max Work Output (W)</span>
            <span class="result-value" data-output="work">-- kJ</span>
          </div>
          <div class="result-box">
            <span class="result-label">Rejected Heat (Q<sub>C</sub>)</span>
            <span class="result-value" data-output="qc">-- kJ</span>
          </div>
          <div class="result-box" data-output="warning" style="display:none; grid-column: 1/-1; color: #f87171; font-size: 0.85rem;"></div>
        </div>
      </div>
    `,
    schema: {
      th: Validators.number(-100, 3000),
      thUnit: Validators.enum('C', 'K'),
      tc: Validators.number(-273, 1000),
      tcUnit: Validators.enum('C', 'K'),
      qh: Validators.positive(),
    },
    compute(form) {
      const Th_K = form.thUnit === 'C' ? form.th + 273.15 : form.th;
      const Tc_K = form.tcUnit === 'C' ? form.tc + 273.15 : form.tc;

      if (Tc_K <= 0 || Th_K <= 0 || Tc_K >= Th_K) {
        return { valid: false, warning: 'T<sub>C</sub> must be > 0 K and < T<sub>H</sub>' };
      }

      const eff = 1 - (Tc_K / Th_K);
      const work = form.qh * eff;
      const qc = form.qh - work;

      return {
        valid: true,
        efficiency: `${(eff * 100).toFixed(2)}%`,
        work: `${work.toFixed(2)} kJ`,
        qc: `${qc.toFixed(2)} kJ`,
      };
    },
  });

  // ---- Bernoulli ----
  registerCalculator({
    id: 'bernoulli_calculator',
    label: 'Bernoulli Flow',
    icon: '🌊',
    description: 'Fluid velocity and dynamic pressure differential across pipe reduction',
    template: `
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
            <input type="number" data-field="d1" value="100" min="5" step="5">
          </div>
          <div class="calc-group">
            <label for="d2">Constriction Diameter (D₂) in mm:</label>
            <input type="number" data-field="d2" value="50" min="5" step="5">
          </div>
          <div class="calc-group">
            <label for="v1">Inlet Velocity (v₁) in m/s:</label>
            <input type="number" data-field="v1" value="2.0" min="0.1" step="0.5">
          </div>
          <div class="calc-group">
            <label for="fluid-rho">Fluid Density (ρ) in kg/m³:</label>
            <select data-field="rho">
              <option value="1000">Water (1000 kg/m³)</option>
              <option value="1.225">Air (1.225 kg/m³)</option>
              <option value="870">Hydraulic Oil (870 kg/m³)</option>
              <option value="custom">Custom...</option>
            </select>
            <input type="number" data-field="rhoCustom" placeholder="Custom density" style="display:none; margin-top: 0.4rem;" min="0.1" step="1">
          </div>
        </div>
        <div class="calc-results">
          <div class="result-box">
            <span class="result-label">Constriction Velocity (v₂)</span>
            <span class="result-value" data-output="v2">-- m/s</span>
          </div>
          <div class="result-box highlight">
            <span class="result-label">Volumetric Flow Rate (Q)</span>
            <span class="result-value" data-output="flowRate">-- L/s</span>
          </div>
          <div class="result-box">
            <span class="result-label">Dynamic Pressure Drop (ΔP)</span>
            <span class="result-value" data-output="deltaP">-- kPa</span>
          </div>
        </div>
      </div>
    `,
    schema: {
      d1: Validators.number(5),
      d2: Validators.number(5),
      v1: Validators.number(0.1),
      rho: Validators.positive(),
    },
    compute(form) {
      const rho = form.rho === 'custom' ? (form.rhoCustom || 1000) : Number(form.rho);
      const r1 = (form.d1 / 1000) / 2;
      const r2 = (form.d2 / 1000) / 2;
      const a1 = Math.PI * r1 * r1;
      const a2 = Math.PI * r2 * r2;

      const v2 = (a1 * form.v1) / a2;
      const q_m3s = a1 * form.v1;
      const q_Ls = q_m3s * 1000;
      const deltaP_Pa = 0.5 * rho * (v2 * v2 - form.v1 * form.v1);
      const deltaP_kPa = deltaP_Pa / 1000;

      return {
        valid: true,
        v2: `${v2.toFixed(2)} m/s`,
        flowRate: `${q_Ls.toFixed(2)} L/s`,
        deltaP: `${deltaP_kPa.toFixed(2)} kPa`,
      };
    },
  });

  // ---- Stress ----
  registerCalculator({
    id: 'stress_calculator',
    label: 'Stress/Strain',
    icon: '🏗️',
    description: 'Tension/compression stress and total bar deflection under load',
    template: `
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
            <input type="number" data-field="force" value="50" min="0.1" step="5">
          </div>
          <div class="calc-group">
            <label for="diameter">Bar Diameter (d) in mm:</label>
            <input type="number" data-field="diameter" value="20" min="1" step="1">
          </div>
          <div class="calc-group">
            <label for="length">Initial Length (L₀) in mm:</label>
            <input type="number" data-field="length" value="1000" min="10" step="100">
          </div>
          <div class="calc-group">
            <label for="material-e">Young&apos;s Modulus (E):</label>
            <select data-field="youngsModulus">
              <option value="200">Structural Steel (200 GPa)</option>
              <option value="70">Aluminum (70 GPa)</option>
              <option value="110">Titanium (110 GPa)</option>
              <option value="105">Brass (105 GPa)</option>
              <option value="custom">Custom...</option>
            </select>
            <input type="number" data-field="youngsModulusCustom" placeholder="Custom E (GPa)" style="display:none; margin-top: 0.4rem;" min="0.1" step="1">
          </div>
        </div>
        <div class="calc-results">
          <div class="result-box highlight">
            <span class="result-label">Normal Stress (σ)</span>
            <span class="result-value" data-output="stress">-- MPa</span>
          </div>
          <div class="result-box">
            <span class="result-label">Strain (ε)</span>
            <span class="result-value" data-output="strain">--</span>
          </div>
          <div class="result-box">
            <span class="result-label">Elongation (ΔL)</span>
            <span class="result-value" data-output="elongation">-- mm</span>
          </div>
        </div>
      </div>
    `,
    schema: {
      force: Validators.number(0.1),
      diameter: Validators.number(1),
      length: Validators.number(10),
      youngsModulus: Validators.positive(),
    },
    compute(form) {
      const E = form.youngsModulus === 'custom' ? (form.youngsModulusCustom || 200) : Number(form.youngsModulus);
      const force_N = form.force * 1000;
      const area_mm2 = (Math.PI / 4) * (form.diameter * form.diameter);
      const E_MPa = E * 1000;

      const stress_MPa = force_N / area_mm2;
      const strain = stress_MPa / E_MPa;
      const deltaL_mm = strain * form.length;

      return {
        valid: true,
        stress: `${stress_MPa.toFixed(2)} MPa`,
        strain: strain.toExponential(4),
        elongation: `${deltaL_mm.toFixed(3)} mm`,
      };
    },
  });

  // ---- Gear ----
  registerCalculator({
    id: 'gear_calculator',
    label: 'Spur Gear',
    icon: '⚙️',
    description: 'Pitch diameters, center distance, output speed, and output torque',
    template: `
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
            <input type="number" data-field="z1" value="20" min="10" step="1">
          </div>
          <div class="calc-group">
            <label for="z2">Gear Teeth (Z₂):</label>
            <input type="number" data-field="z2" value="60" min="10" step="1">
          </div>
          <div class="calc-group">
            <label for="gear-module">Module (m) in mm:</label>
            <input type="number" data-field="module" value="3" min="0.5" step="0.5">
          </div>
          <div class="calc-group">
            <label for="rpm1">Pinion Speed (N₁) in RPM:</label>
            <input type="number" data-field="rpm1" value="1440" min="1" step="50">
          </div>
          <div class="calc-group">
            <label for="torque1">Input Torque (T₁) in N·m:</label>
            <input type="number" data-field="torque1" value="50" min="1" step="5">
          </div>
        </div>
        <div class="calc-results">
          <div class="result-box highlight">
            <span class="result-label">Gear Ratio (i)</span>
            <span class="result-value" data-output="ratio">-- : 1</span>
          </div>
          <div class="result-box">
            <span class="result-label">Output Speed (N₂)</span>
            <span class="result-value" data-output="rpm2">-- RPM</span>
          </div>
          <div class="result-box">
            <span class="result-label">Output Torque (T₂)</span>
            <span class="result-value" data-output="torque2">-- N·m</span>
          </div>
          <div class="result-box">
            <span class="result-label">Center Distance (a)</span>
            <span class="result-value" data-output="centerDistance">-- mm</span>
          </div>
        </div>
      </div>
    `,
    schema: {
      z1: Validators.integer(10),
      z2: Validators.integer(10),
      module: Validators.number(0.5),
      rpm1: Validators.number(1),
      torque1: Validators.number(1),
    },
    compute(form) {
      const ratio = form.z2 / form.z1;
      const rpm2 = form.rpm1 / ratio;
      const torque2 = form.torque1 * ratio;
      const centerDist = (form.module * (form.z1 + form.z2)) / 2;

      return {
        valid: true,
        ratio: `${ratio.toFixed(2)} : 1`,
        rpm2: `${rpm2.toFixed(1)} RPM`,
        torque2: `${torque2.toFixed(1)} N·m`,
        centerDistance: `${centerDist.toFixed(1)} mm`,
      };
    },
  });

  // ---- Machining ----
  registerCalculator({
    id: 'machining_calculator',
    label: 'Machining',
    icon: '⚒️',
    description: 'Spindle speed, table feed rate, and material removal rate for milling',
    template: `
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
            <select data-field="cuttingSpeed">
              <option value="300">Aluminum 6061 (300 m/min)</option>
              <option value="120" selected>Mild Steel (120 m/min)</option>
              <option value="80">Alloy Steel (80 m/min)</option>
              <option value="60">Stainless 304 (60 m/min)</option>
              <option value="40">Titanium Ti-6Al-4V (40 m/min)</option>
              <option value="custom">Custom...</option>
            </select>
            <input type="number" data-field="cuttingSpeedCustom" placeholder="Custom Vc" style="display:none; margin-top: 0.4rem;" min="1" step="1">
          </div>
          <div class="calc-group">
            <label for="m-d">Cutter Diameter (D) in mm:</label>
            <input type="number" data-field="diameter" value="16" min="1" step="1">
          </div>
          <div class="calc-group">
            <label for="m-z">Flutes / Teeth (z):</label>
            <input type="number" data-field="flutes" value="4" min="1" step="1">
          </div>
          <div class="calc-group">
            <label for="m-fz">Feed per Tooth (f<sub>z</sub>) in mm/tooth:</label>
            <input type="number" data-field="feedPerTooth" value="0.08" min="0.001" step="0.01">
          </div>
          <div class="calc-group">
            <label for="m-ap">Axial Depth of Cut (a<sub>p</sub>) in mm:</label>
            <input type="number" data-field="depthOfCut" value="6" min="0.1" step="0.5">
          </div>
          <div class="calc-group">
            <label for="m-ae">Radial Depth of Cut (a<sub>e</sub>) in mm:</label>
            <input type="number" data-field="widthOfCut" value="12" min="0.1" step="0.5">
          </div>
        </div>
        <div class="calc-results">
          <div class="result-box highlight">
            <span class="result-label">Spindle Speed (N)</span>
            <span class="result-value" data-output="spindleSpeed">-- RPM</span>
          </div>
          <div class="result-box">
            <span class="result-label">Table Feed Rate (F)</span>
            <span class="result-value" data-output="feedRate">-- mm/min</span>
          </div>
          <div class="result-box">
            <span class="result-label">Material Removal Rate (MRR)</span>
            <span class="result-value" data-output="mrr">-- cm³/min</span>
          </div>
        </div>
      </div>
    `,
    schema: {
      cuttingSpeed: Validators.positive(),
      diameter: Validators.number(1),
      flutes: Validators.integer(1),
      feedPerTooth: Validators.number(0.001),
      depthOfCut: Validators.number(0.1),
      widthOfCut: Validators.number(0.1),
    },
    compute(form) {
      const Vc = form.cuttingSpeed === 'custom' ? (form.cuttingSpeedCustom || 120) : Number(form.cuttingSpeed);
      const N = (Vc * 1000) / (Math.PI * form.diameter);
      const F = form.feedPerTooth * form.flutes * N;
      const MRR_cm3 = (form.depthOfCut * form.widthOfCut * F) / 1000;

      return {
        valid: true,
        spindleSpeed: `${N.toFixed(0)} RPM`,
        feedRate: `${F.toFixed(1)} mm/min`,
        mrr: `${MRR_cm3.toFixed(2)} cm³/min`,
      };
    },
  });

  // ---- GD&T Position ----
  registerCalculator({
    id: 'gdnt_position_calculator',
    label: 'GD&T Position @ MMC',
    icon: '📏',
    description: 'Bonus and total allowable position tolerance for a hole at MMC',
    template: `
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
            <input type="number" data-field="specifiedTol" value="0.1" min="0.001" step="0.01">
          </div>
          <div class="calc-group">
            <label for="g-mmc">MMC Hole Size (D<sub>MMC</sub>) in mm:</label>
            <input type="number" data-field="mmcSize" value="10.0" min="0.1" step="0.1">
          </div>
          <div class="calc-group">
            <label for="g-actual">Actual Hole Size (D<sub>actual</sub>) in mm:</label>
            <input type="number" data-field="actualSize" value="10.15" min="0.1" step="0.01">
          </div>
          <div class="calc-group">
            <label for="g-poserr">Measured Position Error in mm:</label>
            <input type="number" data-field="positionError" value="0.08" min="0" step="0.01">
          </div>
        </div>
        <div class="calc-results">
          <div class="result-box">
            <span class="result-label">Bonus Tolerance (T<sub>bonus</sub>)</span>
            <span class="result-value" data-output="bonus">-- mm</span>
          </div>
          <div class="result-box highlight">
            <span class="result-label">Total Allowable Position Tol.</span>
            <span class="result-value" data-output="total">-- mm</span>
          </div>
          <div class="result-box" data-output="verdict">
            <span class="result-label">Inspection Result</span>
            <span class="result-value">--</span>
          </div>
          <div class="result-box" data-output="warning" style="display:none; grid-column: 1/-1; color: #f87171; font-size: 0.85rem;"></div>
        </div>
      </div>
    `,
    schema: {
      specifiedTol: Validators.number(0.001),
      mmcSize: Validators.number(0.1),
      actualSize: Validators.number(0.1),
      positionError: Validators.number(0),
    },
    compute(form) {
      if (form.actualSize < form.mmcSize) {
        return {
          valid: false,
          warning: 'Actual size cannot be less than MMC size',
        };
      }

      const bonus = form.actualSize - form.mmcSize;
      const total = form.specifiedTol + bonus;
      const pass = form.positionError <= total;

      return {
        valid: true,
        bonus: `${bonus.toFixed(3)} mm`,
        total: `${total.toFixed(3)} mm`,
        verdict: pass ? '✓ Within Tolerance' : '✗ Out of Tolerance',
        verdictColor: pass ? '#2ecc71' : '#e74c3c',
      };
    },
  });

  // ============================================================================
  // Legacy Calculators API (Backward Compatibility)
  // ============================================================================
  const Calculators = {
    calculatorTypes: Array.from(calculatorRegistry.keys()),

    getCount() {
      return this.calculatorTypes.length;
    },

    render(calculatorType, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const calc = getCalculator(calculatorType);
      if (!calc) {
        container.innerHTML = `<div class="calc-placeholder">Calculator '${calculatorType}' not found.</div>`;
        return;
      }

      container.innerHTML = calc.template;

      // Find all input/select elements with data-field
      const fields = container.querySelectorAll('[data-field]');
      const outputs = container.querySelectorAll('[data-output]');

      function collectFormData() {
        const data = {};
        fields.forEach(el => {
          const field = el.dataset.field;
          if (el.type === 'checkbox') {
            data[field] = el.checked;
          } else if (el.type === 'number') {
            data[field] = parseFloat(el.value) || 0;
          } else {
            data[field] = el.value;
          }
        });
        return data;
      }

      function updateOutputs(result) {
        outputs.forEach(el => {
          const output = el.dataset.output;
          if (output === 'warning') {
            if (result.warning) {
              el.textContent = `⚠️ ${result.warning}`;
              el.style.display = 'block';
            } else {
              el.style.display = 'none';
            }
          } else if (output === 'verdict') {
            const valueEl = el.querySelector('.result-value') || el;
            valueEl.textContent = result.verdict || '--';
            if (result.verdictColor) valueEl.style.color = result.verdictColor;
          } else if (result[output] !== undefined) {
            el.textContent = result[output];
          }
        });
      }

      function compute() {
        const formData = collectFormData();
        const { valid, errors } = validate(calc.schema, formData);

        if (!valid) {
          console.warn('Validation errors:', errors);
          return;
        }

        const result = calc.compute(formData);
        updateOutputs(result);
      }

      // Attach event listeners
      fields.forEach(el => {
        el.addEventListener('input', compute);
        el.addEventListener('change', compute);
      });

      // Handle custom select options
      const customSelects = container.querySelectorAll('select[data-field]');
      customSelects.forEach(select => {
        const field = select.dataset.field;
        const customInput = container.querySelector(`[data-field="${field}Custom"]`);
        if (customInput) {
          select.addEventListener('change', () => {
            customInput.style.display = select.value === 'custom' ? 'block' : 'none';
            compute();
          });
        }
      });

      // Initial computation
      compute();
    },
  };

  // Export globally
  window.Calculators = Calculators;
  window.getCalculator = getCalculator;
  window.getAllCalculators = getAllCalculators;
  window.calculatorRegistry = calculatorRegistry;

  console.log(`🧮 Calculators loaded: ${Calculators.getCount()} calculators registered`);
})();