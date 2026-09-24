# DemoQA E2E Automation Framework (Cypress)

A pragmatic, senior-level Cypress end-to-end automation framework built for [demoqa.com](https://demoqa.com/) within a realistic take-home timebox.

The framework emphasizes **test design, prioritization, flakiness mitigation, and maintainability** over sheer test count.

---

## Test Strategy

### What Was Tested & Why
The suite covers 13 deterministic tests across 5 representative functional domains:

1. **Student Registration Form (`cypress/e2e/practice-form.cy.js`)**:
   - *Minimal required fields*: Verifies form submission when optional fields are omitted.
   - *Comprehensive student profile*: Validates complex multi-field submission including cascading state/city selects, subjects auto-complete, hobbies, and modal confirmation display.
   - *Negative validation*: Verifies that missing required fields trigger HTML5 constraint states and block modal appearance.
2. **Web Tables (`cypress/e2e/web-tables.cy.js`)**:
   - *Add record & filter*: Ensures new records are properly appended to state and searchable.
   - *Search empty boundary*: Verifies table handles non-matching queries gracefully and restores baseline on clear.
   - *Inline record edit*: Validates update operations without mutating neighboring table records.
   - *Record deletion*: Confirms targeted record removal and table row count decrement.
3. **Select Menu & Dropdowns (`cypress/e2e/select-menu.cy.js`)**:
   - *Standard single & multi-select*: Native HTML `<select>` interactions (`#oldSelectMenu`, `#cars`).
   - *Custom React-Select multi-dropdown*: Dynamic badge generation and multi-item selection inside modern React component trees.
4. **Modal Dialogs & Alerts (`cypress/e2e/dialogs-alerts.cy.js`)**:
   - *Small modal lifecycle*: Opens overlay, validates content, and closes cleanly without leaking backdrop state.
   - *Native browser confirm handling*: Stubs and intercepts `window:confirm` events for both accept (`true`) and cancel (`false`) branches.
5. **Dynamic Buttons (`cypress/e2e/buttons.cy.js`)**:
   - *Event dispatching & resilient selectors*: Interacts with double-click, context-menu (right-click), and dynamically generated button IDs using stable text-matching selectors.

### What Was Intentionally Excluded
- **Nested Iframes (`/nestedframes`)**: Excluded from the initial core suite to avoid high maintenance overhead in basic smoke runs.
- **External Third-Party Links**: Social icons and external sponsor links that navigate away from `demoqa.com` were excluded to prevent external network coupling.
- **Exhaustive Input Fuzzing**: Boundary edge cases are focused on real business rules (e.g. required constraints, email formats) rather than repetitive permutations.

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── e2e.yml               # GitHub Actions CI workflow
├── cypress/
│   ├── e2e/                      # Functional test specifications
│   │   ├── buttons.cy.js
│   │   ├── dialogs-alerts.cy.js
│   │   ├── practice-form.cy.js
│   │   ├── select-menu.cy.js
│   │   └── web-tables.cy.js
│   ├── fixtures/
│   │   └── studentData.json      # Structured test data
│   ├── pages/                    # Behavioral Page Object classes
│   │   ├── ButtonsPage.js
│   │   ├── DialogsAlertsPage.js
│   │   ├── PracticeFormPage.js
│   │   ├── SelectMenuPage.js
│   │   └── WebTablesPage.js
│   └── support/
│       ├── commands.js           # Custom command extension point
│       └── e2e.js                # Global exception handling & hooks
├── cypress.config.js             # Base configuration, timeouts, network blocking
├── package.json                  # Scripts & dependencies
├── README.md                     # Framework documentation & run instructions
├── SUMMARY.md                    # Executive 1-page summary
└── DEFECTS.md                    # Verified real application defects report
```

---

## Prerequisites

- **Node.js**: `v18.x` or `v20.x` (Tested on `v20.18.0`)
- **npm**: `v9.x` or `v10.x`
- **Google Chrome** (recommended) or Electron

---

## Installation

```bash
# Clone the repository and navigate into the folder
cd <project-directory>

# Install dependencies
npm install
```

---

## Running Tests

### 1. Main Suite Command (Headless Chrome)
```bash
npm test
```

### 2. Headed Mode (Visual Inspection)
```bash
npm run test:headed
```

### 3. Interactive Cypress App (Test Runner UI)
```bash
npm run cy:open
```

### 4. Running a Specific Spec
```bash
npx cypress run --spec "cypress/e2e/web-tables.cy.js"
```

---

## Test Execution Results

The suite was executed in Chrome headless mode:
- **Total Specs**: 5
- **Total Tests**: 13
- **Passed**: 13
- **Failed**: 0
- **Execution Time**: ~31 seconds

---

## Flakiness & Stability Engineering

During exploratory testing of `demoqa.com`, several real-world instability vectors were identified and handled:

1. **Third-Party Tracker & Ad Interference**:
   - *Problem*: DemoQA dynamically injects Google Publisher Tag (`googletag`), DoubleClick, and GTM scripts that slow down load times, trigger uncaught JavaScript exceptions, and occasionally spawn banners overlapping buttons.
   - *Mitigation*: Configured `blockHosts` in `cypress.config.js` to block ad network domains, and added an uncaught exception filter in `cypress/support/e2e.js`.
2. **Dynamically Generated Element IDs**:
   - *Problem*: Buttons and action elements dynamically change IDs between renders (e.g. `id="s0(5)"`).
   - *Mitigation*: Used semantic text-matching (`cy.contains('button', /^Click Me$/)`) and table row scoping instead of unstable CSS ID selectors.
3. **Application Defect Workaround (Modal Close Button)**:
   - *Problem*: The confirmation modal close button throws `TypeError: Lr.findDOMNode is not a function` under React 18, preventing button-driven state updates.
   - *Mitigation*: The test validates that the close button is visible, then triggers modal dismissal via the Escape key, which invokes the modal's `onHide` callback directly. (Documented in `DEFECTS.md`).
4. **Zero Arbitrary Sleeps**:
   - All assertions rely on Cypress's built-in retry-ability rather than hard-coded `cy.wait(ms)` timers.

---

## Defect Reports

Two actual defects discovered during testing are fully documented in [DEFECTS.md](file:///Users/leandro/Documents/antigravity/task/DEFECTS.md):
- **DEF-001 (High)**: Data corruption and cascading record deletion in Web Tables caused by `t.length + 1` ID generation algorithm.
- **DEF-002 (Medium)**: Practice Form modal close button crashes with uncaught `TypeError: Lr.findDOMNode is not a function`.

---

## CI/CD & Evolution Recommendations

### 1. CI/CD Integration Strategy
- **Pull Request Gate (Smoke Suite)**:
  Run critical path tests (Forms, Web Tables, Dialogs) on every PR using GitHub Actions. Block merge if smoke tests fail.
- **Nightly Regression**:
  Run the full suite across multiple browsers (Chrome, Firefox, Edge) on a scheduled cron.
- **Artifact Preservation**:
  Preserve screenshots and video recordings only on failure (`if: failure()`) to conserve CI storage bandwidth.

### 2. Suite Organization & Tagging
As the suite expands beyond 50+ tests, adopt `cypress-grep` or directory-based categorization:
- `@smoke`: Critical happy paths running in < 60 seconds.
- `@regression`: Full end-to-end edge cases and validation rules.
- `@flaky-quarantine`: Isolated runs for flaky tests under investigation without blocking mainline builds.

### 3. Test Data Management
- Keep small, deterministic payloads in fixtures (`cypress/fixtures/studentData.json`).
- Avoid random data generators (Faker.js) for critical assertion checks because deterministic data simplifies failure triage.
- In production applications with backend APIs, use `cy.request()` to seed preconditions and clean up state, reserving UI interactions for the actual feature under test.

### 4. Meaningful Engineering Metrics
Track a focused set of actionable metrics rather than vanity numbers:
- **Flaky Test Rate**: Percentage of tests that pass on retry after initial failure.
- **P95 Execution Duration**: Track suite execution time drift over releases.
- **Escaped Defects**: Number of production bugs that were missed by the test suite.
