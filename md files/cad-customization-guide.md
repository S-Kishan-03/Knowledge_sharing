# CAD Customization Across Platforms: NXOpen, Creo, SolidWorks, CATIA, and Autodesk

## What You Get From This Guide

A practical comparison of customization approaches across the five major CAD platforms, with concrete techniques, real trade-offs, and selection criteria for your specific use case.

---

## The Customization Landscape

Every major CAD vendor exposes an API layer. The difference isn't *whether* you can customize—it's *how much friction* you accept between your workflow and the platform's architecture.

| Platform | API Family | Language Options | Licensing Model |
|----------|------------|------------------|-----------------|
| Siemens NX | NXOpen | C++, C#, Python, Java | Seat + runtime license |
| PTC Creo | TOOLKIT / OTK / Creo Parametric API | C, C++, C# | Seat + advanced license |
| Dassault CATIA | CAA V5 / 3DEXPERIENCE Automation | C++, C# (COM), Python | Seat + CAA license |
| SolidWorks | SolidWorks API / SwAddin | VBA, C#, VB.NET, C++ | Included with Pro/Premium |
| Autodesk Inventor | Inventor API / iLogic | VB.NET, C#, Python (via IronPython) | Included with subscription |

---

## Siemens NX — NXOpen

### The Architecture

NXOpen is a native C++ API with managed wrappers. You write against the same interfaces NX developers use. The Python binding (introduced in NX 11) wraps the C++ layer—same objects, same memory model.

### Techniques

**Journal Recording → Python Script → Compiled Application**

```python
# Recorded journal, cleaned up
import NXOpen
session = NXOpen.Session.GetSession()
work_part = session.Parts.Work

# Create a block feature programmatically
block_builder = work_part.Features.CreateBlockBuilder(NXOpen.Features.Block.Null)
block_builder.Type = NXOpen.Features.BlockBuilder.Types.OriginAndEdgeLengths
block_builder.Origin = NXOpen.Point3d(0, 0, 0)
block_builder.Length.Value = "50"
block_builder.Width.Value = "30"
block_builder.Height.Value = "20"
block_builder.Commit()
block_builder.Destroy()
```

**Custom Commands via MenuScript/UX** — Define `.men` files for ribbon integration, `.dlx` for compiled UX libraries.

**NXOpen Block Styler** — Drag-drop UI builder generating C#/Python callback stubs. Good for dialogs; limited for complex property panels.

### Advantages

- **Full kernel access**: Same geometric kernel (Parasolid) NX uses internally. No translation layer.
- **Performance**: C++ plugins run in-process. Python adds ~15% overhead but enables rapid iteration.
- **Associativity preserved**: Features you create participate in the update cycle like native ones.
- **Teamcenter integration**: Native SOA/SDK access for PLM workflows.
- **Version stability**: NXOpen API deprecation policy—10+ year support windows.

### Disadvantages

- **Steep learning curve**: C++ API surface is massive (~3,000 classes). Python helps but doesn't hide complexity.
- **License cost**: NXOpen runtime license required on every seat running custom code.
- **Debugging friction**: C++ crashes take down NX. Python exceptions are catchable but stack traces cross native/managed boundary.
- **UI framework aging**: Block Styler hasn't evolved significantly since NX 10. Modern WPF/WinForms requires manual P/Invoke.

### When to Choose NXOpen

- You need parametric feature creation that survives model edits
- Teamcenter PLM integration is required
- Large assemblies (100k+ components) where performance matters
- Your team has C++/C# capability

---

## PTC Creo — TOOLKIT, OTK, and Creo Parametric API

### The Architecture

Three layers, increasing abstraction:

1. **Pro/TOOLKIT (C)** — Direct kernel access. Functions like `ProSolidFeatureCreate()`. No hand-holding.
2. **OTK (C++)** — Object-oriented wrapper around TOOLKIT. `ProSolid`, `ProFeature` classes.
3. **Creo Parametric API (C#)** — COM-interop layer. Used by most modern customization.

### Techniques

**Mapkeys → Trail Files → OTK Application**

```c
// OTK C++: Create an extrude feature
ProSolid solid = ...;
ProFeatureCreateOptions opts;
ProExtrudeFeatureCreate(&solid, sketch, PRO_EXTRUDE_ONE_SIDE, 25.0, &opts);
```

**Creo Parametric API (C#)** — Visual Studio template generates add-in skeleton.

```csharp
public class MyAddin : IProServer
{
    public void OnStartup() 
    {
        // Register custom ribbon tab
        RibbonAPI.AddTab("MyTools", "CustomTools");
    }
}
```

**J-Link (Java)** — Runs in separate JVM, communicates via socket. Slower but isolates crashes.

### Advantages

- **Granular control**: TOOLKIT exposes nearly every kernel operation. If Creo can do it, you can script it.
- **Mapkey-to-code pipeline**: Record → edit → compile is a real workflow.
- **Family tables & Pro/Program**: Native automation for design variants.
- **No separate runtime license** for C# API (included in seat).

### Disadvantages

- **Three APIs, inconsistent coverage**: Some operations only in TOOLKIT, some only in C# API. You'll mix them.
- **Documentation gaps**: OTK examples often outdated. C# API docs lag releases by 6-12 months.
- **Memory management**: TOOLKIT/OTK require manual `ProMdlFree()`, `ProArrayFree()`. Leaks crash Creo.
- **UI framework**: Ribbon API is WinForms-era. Modern XAML requires hosting WPF in WinForms host.
- **Regeneration failures**: Custom features can leave model in "failed regen" state that blocks save.

### When to Choose Creo APIs

- Heavy topology automation (skeleton-driven design, master model)
- Pro/Program logic for variant configuration
- Team already knows C/C++ and tolerates manual memory management
- Cost-sensitive: C# API included in seat

---

## SolidWorks — SolidWorks API (SldWorks)

### The Architecture

COM-based automation interface. `SldWorks` object is the entry point. Every entity (Part, Assembly, Feature, Sketch) exposes `IModelDoc2`, `IFeature`, `ISketchManager` etc.

### Techniques

**Macro Recorder → VBA → C# Add-in**

```vba
' Recorded macro, cleaned
Dim swApp As SldWorks.SldWorks
Dim Part As SldWorks.ModelDoc2
Set swApp = Application.SldWorks
Set Part = swApp.ActiveDoc

Dim myFeature As SldWorks.Feature
Set myFeature = Part.FeatureManager.FeatureExtrusion3(
    True, False, False, 0, 0, 25, 0, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False
)
```

**C# Add-in (SwAddin)** — Implements `ISwAddin`. Loaded at startup. Ribbon integration via `CommandManager`.

```csharp
public class MyAddin : ISwAddin
{
    public bool ConnectToSW(object ThisSW, int Cookie)
    {
        _swApp = (SldWorks)ThisSW;
        _cmdMgr = _swApp.GetCommandManager();
        _cmdMgr.AddCommandGroup("MyTools", "Custom Tools", -1, "", "", ref _cmdGroupID);
        return true;
    }
}
```

**PropertyManager Pages (PMP)** — Native UI framework. XAML-like XML definition with callback handlers.

### Advantages

- **Lowest barrier to entry**: Macro recorder works. VBA editor built in. C# add-in template in SDK.
- **Huge community**: 25+ years of forums, macros, third-party tools (e.g., CADSharp, SolidWorks Macros).
- **No extra license**: API included with Professional/Premium seats.
- **Event system**: `DSwPartEvents`, `DSwAssemEvents` for reacting to user actions.
- **Configuration/Design Table automation**: First-class API support.

### Disadvantages

- **COM overhead**: Every cross-process call marshals. Large loops (10k+ features) are slow.
- **No kernel access**: You automate UI commands, not geometric kernel directly. Some operations require "select → command" simulation.
- **64-bit only since 2014**: Legacy 32-bit macros need rewrite.
- **PMP limitations**: XML-based UI definition. Complex dynamic UIs require WinForms/WPF host.
- **PDM API separate**: SOLIDWORKS PDM has its own COM interface (`IEdmVault5`), different object model.

### When to Choose SolidWorks API

- Shop-floor automation (drawings, BOMs, export)
- Design Table / Configuration driven workflows
- Team has .NET skills, no C++ budget
- PDM Professional integration needed

---

## Dassault CATIA — CAA V5 / 3DEXPERIENCE Automation

### The Architecture

Two distinct eras:

**CAA V5 (C++)** — Component Application Architecture. COM-like component model. You implement interfaces (`CATIModel`, `CATIGeometry`), register via `CATEnv`. Runs in-process.

**3DEXPERIENCE Automation (C#/Python)** — REST + Web Services + .NET SDK on 3DX platform. Different object model. Not backward compatible with V5.

### Techniques

**CAA V5 — C++ Workshop**

```cpp
// CAA V5: Create a PartDocument and a Pad
CATIContainer *container = NULL;
CATCreateObject("CATIPart", &container);
CATIPart *part = NULL;
container->QueryInterface(IID_CATIPart, (void**)&part);

CATIBody *body = part->GetBody();
CATIFactory *factory = body->GetFactory();
CATIPad *pad = factory->CreatePad(sketch, 25.0, CATIFactory::UpToLast);
```

**3DEXPERIENCE — .NET SDK**

```csharp
using DassaultSystemes.CATIA.Automation;
// Requires 3DX platform tenant
var session = new CATIAApplication();
var partDoc = session.Documents.Add("Part");
var part = (Part)partDoc.Part;
var body = part.MainBody;
var shapeFactory = part.ShapeFactory;
var pad = shapeFactory.AddNewPad(sketch, 25.0);
```

**Knowledgeware / EKL** — Rule language embedded in CATIA. No compilation. Good for parametric logic, not UI.

### Advantages

- **Deepest kernel access**: CAA V5 exposes CATIA's geometric kernel (CGM) directly. Surfaces, wireframe, boolean ops at kernel level.
- **Enterprise scale**: Designed for 10k+ seat deployments with PLM (ENOVIA) integration.
- **Multi-CAD**: 3DX Automation works across CATIA, SIMULIA, DELMIA in same session.
- **Knowledgeware**: Capture engineering intent as rules, not code.

### Disadvantages

- **CAA V5 is a different profession**: Requires C++ expertise, CMake build system, `mkfile` generation, `CATEnv` registration. 6-12 month ramp.
- **Two incompatible stacks**: V5 customization doesn't transfer to 3DX. Migration is rewrite.
- **License complexity**: CAA development license (~$15k/seat/year) separate from runtime.
- **Documentation behind paywall**: CAA docs require DS partner portal access.
- **3DX Automation latency**: Cloud-hosted services add 50-200ms per call vs in-process.

### When to Choose CATIA Automation

- Aerospace/automotive OEM supply chain (mandated by customer)
- Complex surface/Class-A work needing kernel-level control
- 3DEXPERIENCE platform adoption (new projects)
- Knowledge capture via EKL rules

---

## Autodesk Inventor — Inventor API / iLogic

### The Architecture

**Inventor API (COM)** — `Application`, `PartDocument`, `AssemblyDocument`, `PartComponentDefinition`. Full object model exposed to VB.NET/C#.

**iLogic** — Rules engine embedded in Inventor. VB.NET snippets stored *in the document*. Triggered by parameter change, event, or manual run.

### Techniques

**iLogic Rule (stored in .ipt/.iam)**

```vb
' iLogic: Drive hole pattern from parameter
Dim holeCount As Integer = Parameter("HoleCount")
Dim pitch As Double = Parameter("Pitch")

Dim holeFeature As PartFeature = ThisApplication.ActiveDocument.
    ComponentDefinition.Features.HoleFeatures.Item("Hole1")

Dim pattern As RectangularPatternFeature = ThisApplication.ActiveDocument.
    ComponentDefinition.Features.RectangularPatternFeatures.Add(
        holeFeature, 
        ThisApplication.TransientGeometry.CreateVector(1,0,0), 
        pitch, holeCount, 
        ThisApplication.TransientGeometry.CreateVector(0,1,0), 
        pitch, 1
    )
```

**C# Add-in** — Standard Visual Studio template. Implements `ApplicationAddInServer`.

```csharp
public class MyAddin : ApplicationAddInServer
{
    public void Activate(Inventor.ApplicationAddInSite AddInSite, bool FirstTime)
    {
        _app = AddInSite.Application;
        _uiManager = _app.UserInterfaceManager;
        // Add ribbon panel
    }
}
```

**Python via IronPython** — `clr.AddReference("Autodesk.Inventor.Interop")`. Works but not officially supported.

### Advantages

- **iLogic = zero deployment**: Rules travel with the file. No install on viewer seats.
- **Parameter-driven design**: Native integration with Parameters table, Excel link, Design Accelerator.
- **Lowest cost**: API included in every subscription. No extra licenses.
- **Vault integration**: Autodesk Vault API (separate but consistent) for PDM workflows.
- **Fusion 360 convergence**: Inventor API skills transfer to Fusion API (similar object model).

### Disadvantages

- **COM apartment threading**: STA model. Async operations require `BackgroundWorker` or `Task.Run` with marshaling.
- **iLogic debugging**: `MessageBox.Show()` is your debugger. No breakpoints, no watch window.
- **Large assembly performance**: Inventor's transaction model (every API call = transaction) slows bulk operations.
- **No kernel access**: Like SolidWorks, you automate features, not kernel.
- **Migration path unclear**: Autodesk pushing Fusion 360. Inventor API maintenance mode.

### When to Choose Inventor/iLogic

- Parameter-driven product configuration (frame generators, conveyors, etc.)
- Rules that must travel with the file to non-programmer users
- Autodesk Vault shops
- Budget-constrained: no API license fees

---

## Cross-Platform Comparison

| Criterion | NXOpen | Creo | SolidWorks | CATIA | Inventor |
|-----------|--------|------|------------|-------|----------|
| **Learning curve** | High | High (C) / Medium (C#) | Low | Very High (CAA) / Medium (3DX) | Low |
| **Kernel access** | Full (Parasolid) | Full (Granite) | None (UI automation) | Full (CGM) | None |
| **In-process performance** | Excellent | Excellent (C/C++) | Good (COM overhead) | Excellent (CAA) | Good |
| **UI framework** | Block Styler / WPF manual | Ribbon API / WPF host | PMP / WPF host | CAA UI / 3DX Web | Ribbon / WPF |
| **PLM integration** | Teamcenter native | Windchill native | PDM Pro separate | ENOVIA native | Vault separate |
| **Runtime license cost** | Yes (~$2k/seat) | No (C#) / Yes (TOOLKIT) | No | Yes (CAA dev) | No |
| **Cloud/3DX ready** | NX Cloud (early) | Creo+ (SaaS) | 3DEXPERIENCE Works | Native 3DX | Fusion 360 path |
| **Community/samples** | Medium | Small | Large | Small (partner-gated) | Medium |
| **Best for** | Complex parametric, PLM | Variant mastery, skeleton | Drawings, config, PDM | Class-A surfacing, enterprise | Config-driven, iLogic rules |

---

## Selection Decision Tree

```
START: What's your primary driver?
│
├─ Performance + kernel geometry → NXOpen (C++) or CAA V5
│
├─ Variant/configuration mastery → Creo (Pro/Program) or Inventor (iLogic)
│
├─ Low friction, .NET team, PDM → SolidWorks API
│
├─ 3DEXPERIENCE platform mandate → CATIA 3DX Automation
│
├─ Rules travel with file, no deploy → Inventor iLogic
│
├─ Teamcenter shop → NXOpen
│
├─ Windchill shop → Creo C# API
│
├─ Autodesk Vault shop → Inventor API
│
└─ Multi-CAD 3DX environment → CATIA 3DX Automation
```

---

## Practical Recommendations

### For New Customization Projects (2024+)

1. **Prototype in Python/iLogic/VBA first**. Validate workflow in 2-3 days before committing to compiled add-in.
2. **Isolate geometry logic from UI**. Core algorithms in pure functions (testable, portable). UI layer thin.
3. **Use platform's native event system** for reactivity. Polling `OnIdle` is a smell.
4. **Version your customization like product**. Semantic versioning, changelog, compatibility matrix per CAD release.
5. **Automate deployment**: MSI/ClickOnce for .NET, `nxopen_install` for NX, `creo_parametric_customization` for Creo.

### Common Pitfalls

| Pitfall | Platforms Affected | Fix |
|---------|-------------------|-----|
| Blocking UI thread on long ops | All | BackgroundWorker / async / `NXOpen.Session.UndoMark` |
| Leaking COM references | SolidWorks, Inventor, CATIA 3DX | `Marshal.ReleaseComObject`, `IDisposable` pattern |
| Assuming feature order stable | All | Use persistent IDs (`Feature.GetTag()`, `ProFeatureId`), not index |
| Hardcoding units | All | Always use `Part.Units` / `GetUnitSystem()` |
| Ignoring regeneration failures | Creo, NX, CATIA | Check `Feature.Status` / `ProFeatureStatus` after commit |

---

## Migration Reality Check

| From → To | Effort | Reality |
|-----------|--------|---------|
| SolidWorks VBA → C# | Low | Direct translation, same COM objects |
| Inventor iLogic → C# | Medium | iLogic is VB.NET subset; rewrite UI |
| NXOpen C++ → C# | Medium | Managed wrapper 1:1; memory model differs |
| Creo TOOLKIT → C# API | High | Different object model; some ops missing |
| CATIA CAA V5 → 3DX | Very High | Complete rewrite; different architecture |

---

## Final Takeaways

1. **Don't fight the platform's grain**. NXOpen wants compiled features. iLogic wants rules in files. SolidWorks wants macros→add-ins. Work *with* the idiom.
2. **License cost is real but not the whole story**. NXOpen runtime license pays for itself if it saves one engineer-week per seat per year.
3. **Community = velocity**. SolidWorks wins on StackOverflow answers, macro libraries, contractor availability.
4. **PLM integration dictates 50% of the decision**. If you're in Teamcenter, NXOpen isn't a choice—it's the path of least resistance.
5. **Start with the ugliest working prototype**. A recorded macro that crashes 20% of the time teaches you more than a clean architecture document.

---

## Next Steps

1. Pick **one** platform. Download its SDK. Build a "Hello Feature" (create a block/pad/extrude via code).
2. Measure: How many lines to create a parametric feature that updates when dimension changes?
3. That number predicts your ongoing velocity better than any comparison table.

---

## JSON Reference Data

```json
{
  "platforms": [
    {
      "name": "Siemens NX",
      "apiFamily": "NXOpen",
      "languages": ["C++", "C#", "Python", "Java"],
      "licensing": "Seat + runtime license (~$2k/seat/year)",
      "kernelAccess": "Full (Parasolid)",
      "inProcessPerformance": "Excellent",
      "uiFramework": "Block Styler, WPF (manual)",
      "plmIntegration": "Teamcenter native",
      "cloudReady": "NX Cloud (early)",
      "communitySize": "Medium",
      "learningCurve": "High",
      "bestFor": ["Complex parametric features", "Teamcenter PLM shops", "Large assemblies (100k+)", "Kernel-level geometry"],
      "disadvantages": ["Steep C++ learning curve", "Runtime license cost", "C++ crashes take down NX", "Block Styler aging", "Debugging across native/managed boundary"],
      "codeExample": {
        "language": "Python",
        "snippet": "import NXOpen\nsession = NXOpen.Session.GetSession()\nwork_part = session.Parts.Work\nblock_builder = work_part.Features.CreateBlockBuilder(NXOpen.Features.Block.Null)\nblock_builder.Type = NXOpen.Features.BlockBuilder.Types.OriginAndEdgeLengths\nblock_builder.Origin = NXOpen.Point3d(0, 0, 0)\nblock_builder.Length.Value = \"50\"\nblock_builder.Commit()\nblock_builder.Destroy()"
      }
    },
    {
      "name": "PTC Creo",
      "apiFamily": "TOOLKIT / OTK / Creo Parametric API",
      "languages": ["C", "C++", "C#"],
      "licensing": "Seat + advanced license (C# included, TOOLKIT extra)",
      "kernelAccess": "Full (Granite)",
      "inProcessPerformance": "Excellent (C/C++)",
      "uiFramework": "Ribbon API, WPF host",
      "plmIntegration": "Windchill native",
      "cloudReady": "Creo+ (SaaS)",
      "communitySize": "Small",
      "learningCurve": "High (C) / Medium (C#)",
      "bestFor": ["Variant mastery", "Skeleton-driven design", "Pro/Program automation", "Topology optimization"],
      "disadvantages": ["Three APIs with inconsistent coverage", "OTK docs outdated", "Manual memory management", "Regen failures block save", "C# API docs lag releases"],
      "codeExample": {
        "language": "C#",
        "snippet": "public class MyAddin : IProServer\n{\n    public void OnStartup() \n    {\n        RibbonAPI.AddTab(\"MyTools\", \"CustomTools\");\n    }\n}"
      }
    },
    {
      "name": "SolidWorks",
      "apiFamily": "SolidWorks API / SwAddin",
      "languages": ["VBA", "C#", "VB.NET", "C++"],
      "licensing": "Included with Pro/Premium",
      "kernelAccess": "None (UI automation)",
      "inProcessPerformance": "Good (COM overhead)",
      "uiFramework": "PropertyManager Pages (PMP), WPF host",
      "plmIntegration": "PDM Professional (separate API)",
      "cloudReady": "3DEXPERIENCE Works",
      "communitySize": "Large",
      "learningCurve": "Low",
      "bestFor": ["Shop-floor automation", "Drawings/BOMs/export", "Configuration/Design Tables", "PDM Professional shops"],
      "disadvantages": ["COM marshalling overhead", "No kernel access", "Simulate select→command for some ops", "PMP XML limitations", "PDM API separate object model"],
      "codeExample": {
        "language": "C#",
        "snippet": "public class MyAddin : ISwAddin\n{\n    public bool ConnectToSW(object ThisSW, int Cookie)\n    {\n        _swApp = (SldWorks)ThisSW;\n        _cmdMgr = _swApp.GetCommandManager();\n        _cmdMgr.AddCommandGroup(\"MyTools\", \"Custom Tools\", -1, \"\", \"\", ref _cmdGroupID);\n        return true;\n    }\n}"
      }
    },
    {
      "name": "Dassault CATIA",
      "apiFamily": "CAA V5 / 3DEXPERIENCE Automation",
      "languages": ["C++", "C#", "Python"],
      "licensing": "Seat + CAA dev license (~$15k/seat/year)",
      "kernelAccess": "Full (CGM)",
      "inProcessPerformance": "Excellent (CAA V5)",
      "uiFramework": "CAA UI (V5), 3DX Web (3DX)",
      "plmIntegration": "ENOVIA native",
      "cloudReady": "Native 3DX platform",
      "communitySize": "Small (partner-gated)",
      "learningCurve": "Very High (CAA) / Medium (3DX)",
      "bestFor": ["Class-A surfacing", "Aerospace/auto OEM supply chain", "3DX platform adoption", "Knowledgeware/EKL rules"],
      "disadvantages": ["CAA V5 = separate profession (6-12mo ramp)", "V5 and 3DX stacks incompatible", "CAA dev license expensive", "Docs behind partner portal", "3DX latency (50-200ms/call)"],
      "codeExample": {
        "language": "C#",
        "snippet": "using DassaultSystemes.CATIA.Automation;\nvar session = new CATIAApplication();\nvar partDoc = session.Documents.Add(\"Part\");\nvar part = (Part)partDoc.Part;\nvar pad = part.ShapeFactory.AddNewPad(sketch, 25.0);"
      }
    },
    {
      "name": "Autodesk Inventor",
      "apiFamily": "Inventor API / iLogic",
      "languages": ["VB.NET", "C#", "Python (IronPython)"],
      "licensing": "Included with subscription",
      "kernelAccess": "None (feature automation)",
      "inProcessPerformance": "Good (transaction overhead)",
      "uiFramework": "Ribbon, WPF",
      "plmIntegration": "Vault (separate API)",
      "cloudReady": "Fusion 360 convergence path",
      "communitySize": "Medium",
      "learningCurve": "Low",
      "bestFor": ["Parameter-driven config", "iLogic rules in files", "Autodesk Vault shops", "Frame generators/conveyors"],
      "disadvantages": ["STA threading model", "iLogic debugging = MessageBox only", "Transaction per API call slows bulk ops", "No kernel access", "Inventor maintenance mode vs Fusion"],
      "codeExample": {
        "language": "VB.NET (iLogic)",
        "snippet": "Dim holeCount As Integer = Parameter(\"HoleCount\")\nDim pitch As Double = Parameter(\"Pitch\")\nDim pattern = ThisApplication.ActiveDocument.\n    ComponentDefinition.Features.RectangularPatternFeatures.Add(\n        holeFeature, vectorX, pitch, holeCount, vectorY, pitch, 1)"
      }
    }
  ],
  "comparisonMatrix": {
    "criteria": [
      "Learning curve",
      "Kernel access",
      "In-process performance",
      "UI framework maturity",
      "PLM integration depth",
      "Runtime license cost",
      "Cloud/3DX readiness",
      "Community/samples",
      "Best for"
    ],
    "ratings": {
      "NXOpen": ["High", "Full", "Excellent", "Aging", "Teamcenter native", "Yes (~$2k)", "Early", "Medium", "Complex parametric, PLM"],
      "Creo": ["High/Med", "Full", "Excellent", "Legacy", "Windchill native", "No (C#)", "Creo+", "Small", "Variants, skeleton"],
      "SolidWorks": ["Low", "None", "Good", "PMP/WPF", "PDM Pro separate", "No", "3DX Works", "Large", "Drawings, config, PDM"],
      "CATIA": ["Very High/Med", "Full", "Excellent", "CAA/3DX Web", "ENOVIA native", "Yes (~$15k)", "Native 3DX", "Small", "Class-A, enterprise"],
      "Inventor": ["Low", "None", "Good", "Ribbon/WPF", "Vault separate", "No", "Fusion path", "Medium", "Config-driven, iLogic"]
    }
  },
  "decisionTree": [
    {"driver": "Performance + kernel geometry", "recommendation": "NXOpen (C++) or CAA V5"},
    {"driver": "Variant/configuration mastery", "recommendation": "Creo (Pro/Program) or Inventor (iLogic)"},
    {"driver": "Low friction, .NET team, PDM", "recommendation": "SolidWorks API"},
    {"driver": "3DEXPERIENCE platform mandate", "recommendation": "CATIA 3DX Automation"},
    {"driver": "Rules travel with file, no deploy", "recommendation": "Inventor iLogic"},
    {"driver": "Teamcenter shop", "recommendation": "NXOpen"},
    {"driver": "Windchill shop", "recommendation": "Creo C# API"},
    {"driver": "Autodesk Vault shop", "recommendation": "Inventor API"},
    {"driver": "Multi-CAD 3DX environment", "recommendation": "CATIA 3DX Automation"}
  ],
  "migrationEffort": {
    "SolidWorks VBA → C#": "Low - Direct translation, same COM objects",
    "Inventor iLogic → C#": "Medium - iLogic is VB.NET subset; rewrite UI",
    "NXOpen C++ → C#": "Medium - Managed wrapper 1:1; memory model differs",
    "Creo TOOLKIT → C# API": "High - Different object model; some ops missing",
    "CATIA CAA V5 → 3DX": "Very High - Complete rewrite; different architecture"
  },
  "commonPitfalls": [
    {"pitfall": "Blocking UI thread on long ops", "platforms": "All", "fix": "BackgroundWorker / async / NXOpen.Session.UndoMark"},
    {"pitfall": "Leaking COM references", "platforms": "SolidWorks, Inventor, CATIA 3DX", "fix": "Marshal.ReleaseComObject, IDisposable pattern"},
    {"pitfall": "Assuming feature order stable", "platforms": "All", "fix": "Use persistent IDs (Feature.GetTag(), ProFeatureId), not index"},
    {"pitfall": "Hardcoding units", "platforms": "All", "fix": "Always use Part.Units / GetUnitSystem()"},
    {"pitfall": "Ignoring regeneration failures", "platforms": "Creo, NX, CATIA", "fix": "Check Feature.Status / ProFeatureStatus after commit"}
  ]
}
```