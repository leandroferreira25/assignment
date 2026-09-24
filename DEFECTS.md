# Defect Reports - DemoQA Application Under Test

This document reports two genuine, reproducible defects identified through source inspection and exploratory automation on [demoqa.com](https://demoqa.com/).

---

## Defect 1: Data Corruption and Cascading Record Deletion in Web Tables

### Metadata
- **Defect ID**: DEF-001
- **Component**: Web Tables (`/webtables`)
- **Severity**: High (Data integrity loss & cascading unintended data destruction)
- **Priority**: High (Breaks core CRUD table capability)
- **Environment**: Chrome 128+ / macOS Sonoma / Production DemoQA Vite Build (`index-D_rDx8ml.js`)

### Executive Summary
When an intermediate record is deleted from the Web Tables component and a subsequent record is added, the new record is assigned an `id` calculated from the current array length (`table.length + 1`). This causes an ID collision with pre-existing records, generating duplicate HTML `id` attributes in the DOM and resulting in cascading data deletion when any colliding record is removed.

### Steps to Reproduce
1. Navigate to `https://demoqa.com/webtables`.
2. Observe the three pre-populated records:
   - Row 1: Cierra Vega (`id: 1`)
   - Row 2: Alden Cantrell (`id: 2`)
   - Row 3: Kierra Gentry (`id: 3`)
3. Delete Row 2 ("Alden Cantrell") by clicking its delete icon.
4. Verify the table now contains 2 rows (`Cierra` and `Kierra`).
5. Click the **Add** button (`#addNewRecordButton`).
6. Fill in valid data for a new employee:
   - First Name: `Samantha`
   - Last Name: `Reed`
   - Email: `samantha.reed@example.com`
   - Age: `30`
   - Salary: `75000`
   - Department: `Engineering`
7. Click **Submit** (`#submit`).
8. Notice that Samantha Reed is assigned `id: 3` (`2 + 1 = 3`), creating an ID collision with Kierra Gentry (`id: 3`).
9. Inspect the DOM for the action buttons: two elements now exist with `id="delete-record-3"` and two with `id="edit-record-3"`.
10. Click the delete icon on Samantha Reed's row.

### Expected Result
- The new record receives a distinct, unique identifier (e.g., `id: 4` or a monotonic counter/UUID).
- DOM element IDs remain strictly unique per W3C HTML specifications.
- Deleting Samantha Reed removes only Samantha Reed; Kierra Gentry remains displayed.

### Actual Result
- Samantha Reed collides with Kierra Gentry on `id: 3`.
- Duplicate IDs exist in the DOM (`#delete-record-3`, `#edit-record-3`).
- When deleting Samantha Reed, the state handler executes `t.filter(E => E.id !== 3)`. Because both records share `id: 3`, **both Samantha Reed and Kierra Gentry are deleted**, causing unintended data loss.
- In-place editing on Samantha Reed targets `C.findIndex(w => w.id === 3)`, modifying Kierra Gentry's row instead of Samantha's.

### Technical Root Cause
Source code from `https://demoqa.com/assets/index-D_rDx8ml.js` in component `u5`:
```javascript
// Add/update record handler in u5
p = b => {
  const C = [...t];
  if (b.id) {
    const E = C.findIndex(w => w.id === b.id);
    C[E] = b;
  } else {
    // Flaw: uses array length instead of an auto-incrementing ID or UUID
    const E = { ...b, id: t.length + 1 };
    C.push(E);
  }
  r(C);
  d({});
};

// Delete record handler in u5
h = b => {
  // Deletes all items sharing the colliding ID at once
  const C = t.filter(E => E.id !== b.id);
  r(C);
};
```

### Remediation
Replace `id: t.length + 1` with a monotonic sequence or UUID:
```javascript
const nextId = t.length > 0 ? Math.max(...t.map(r => r.id)) + 1 : 1;
```

---

## Defect 2: Uncaught TypeError on Practice Form Modal Close Button

### Metadata
- **Defect ID**: DEF-002
- **Component**: Practice Form (`/automation-practice-form`)
- **Severity**: Medium (Functional block on button interaction, workaround exists via Escape key)
- **Priority**: Medium
- **Environment**: Chrome 128+ / macOS Sonoma / Production DemoQA Vite Build (`index-D_rDx8ml.js`)

### Executive Summary
Submitting the student registration form displays a Bootstrap confirmation modal. When the user clicks the footer "Close" button (`#closeLargeModal`), an uncaught JavaScript exception (`TypeError: Lr.findDOMNode is not a function`) is thrown inside the click handler. This terminates event processing before the state update (`setModal(false)`) can execute, leaving the modal stuck open on screen.

### Steps to Reproduce
1. Navigate to `https://demoqa.com/automation-practice-form`.
2. Fill in all required fields (First Name, Last Name, Gender, 10-digit Mobile).
3. Click the **Submit** button (`#submit`).
4. The submission modal appears ("Thanks for submitting the form").
5. Click the **Close** button (`#closeLargeModal`) at the bottom of the modal.

### Expected Result
- The modal dismisses cleanly and the registration form resets.

### Actual Result
- The modal remains visible.
- The browser console registers:
  `TypeError: Lr.findDOMNode is not a function` at `HTMLButtonElement.onClick`.
- Form state is not reset and the user cannot close the dialog via the primary button (they must press `Esc` or click the backdrop).

### Technical Root Cause
In `https://demoqa.com/assets/index-D_rDx8ml.js` component `w$`:
```javascript
g.jsx(Ft.Footer, {
  children: g.jsx(Ne, {
    id: "closeLargeModal",
    onClick: () => {
      // findDOMNode was removed in React 18, so this throws and never reaches O(!1)
      Lr.findDOMNode(ce).reset(),
      O(!1),
      r(!1),
      y(null),
      u([]),
      C(null),
      d([]),
      a(new Date),
      w(),
      _(),
      A(),
      j(),
      V()
    },
    children: "Close"
  })
})
```

### Automation Workaround & Remediation
- **Automation Workaround**: In `PracticeFormPage.js`, verify `#closeLargeModal` is visible, then trigger modal dismissal via keyboard Escape (`cy.get('body').type('{esc}')`), which invokes the modal's `onHide` callback directly without triggering the broken click handler.
- **Application Remediation**: Replace `findDOMNode(ce).reset()` with a standard React ref: `formRef.current?.reset()`.
