# MechWiki - Mechanical Engineering Knowledge Sharing Platform

A modern, data-driven, interactive Mechanical Engineering wiki platform built specifically for zero-configuration hosting on **GitHub Pages**.

![MechWiki Preview](https://img.shields.io/badge/Status-Active-success) ![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

- ⚙️ **JSON-Driven Content**: Topic content is fully separated into human-editable JSON files (`data/topics/*.json`), allowing seamless additions and updates.
- 📐 **LaTeX Math Rendering**: Integrated **KaTeX** for rendering LaTeX equations ($$\Delta U = Q - W$$) natively.
- 🧮 **Embedded Interactive Engineering Calculators**:
  - Carnot Engine Efficiency Calculator
  - Fluid Flow & Bernoulli Pressure Drop Calculator
  - Axial Stress, Strain & Elongation Calculator
  - Spur Gear Ratio, Speed & Torque Transformer
- 📚 **Wiki Infoboxes & Inter-links**: Wikipedia-style quick reference infoboxes and cross-topic wiki links (`[[topic-id|Link Text]]`).
- 🔍 **Instant Live Search**: Search across titles, summaries, tags, and categories in real-time.
- 🌙 **Dark & Light Mode**: Sleek glassmorphism theme with theme persistence (`localStorage`).
- 📱 **Fully Responsive**: Collapsible sidebar navigation optimized for desktop, tablet, and mobile.

---

## 🚀 How to Host on GitHub Pages

1. **Push Repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of MechWiki"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your GitHub repository **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, choose **Deploy from a branch**.
   - Select **Branch**: `main`, Folder: `/ (root)`.
   - Click **Save**.

3. **View Live Site**:
   - Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` in seconds!

---

## 📝 How to Add a New Topic

Adding a new Mechanical Engineering topic is as easy as adding two JSON entries:

### Step 1: Add topic metadata in `data/index.json`
```json
{
  "id": "heat-transfer-conduction",
  "title": "Fourier's Law of Heat Conduction",
  "category": "Thermal & Energy Engineering",
  "categoryId": "thermal",
  "readTime": "6 min",
  "difficulty": "Beginner",
  "icon": "flame",
  "summary": "Thermal conductivity, Fourier's law, and heat flux through flat walls.",
  "tags": ["Heat Transfer", "Fourier Law", "Conduction"]
}
```

### Step 2: Create `data/topics/heat-transfer-conduction.json`
```json
{
  "id": "heat-transfer-conduction",
  "title": "Fourier's Law of Heat Conduction",
  "category": "Thermal & Energy Engineering",
  "categoryId": "thermal",
  "readTime": "6 min",
  "difficulty": "Beginner",
  "icon": "flame",
  "summary": "Thermal conductivity, Fourier's law, and heat flux through flat walls.",
  "infobox": {
    "title": "Heat Conduction",
    "imageSymbol": "🔥",
    "keyFormulas": [
      { "label": "Fourier's Law", "math": "q = -k \\cdot A \\cdot \\frac{dT}{dx}" }
    ],
    "siUnits": "W/m·K, Watt (W)"
  },
  "sections": [
    {
      "id": "intro",
      "heading": "Introduction to Conduction",
      "content": "Conduction is the transfer of thermal energy through solid matter..."
    }
  ],
  "keyTakeaways": [
    "Heat flux is proportional to thermal conductivity and temperature gradient."
  ]
}
```

---

## 🛠️ Local Development & Preview

To preview locally using Python's built-in HTTP server:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your web browser.
