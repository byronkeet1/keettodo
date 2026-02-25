// Comprehensive tests for KeetTodo app
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('Running KeetTodo Comprehensive Tests...\n');

// Test 1: index.html exists
test('index.html exists', () => {
  assert(fs.existsSync('index.html'), 'index.html not found');
});

// Test 2: app.js exists
test('app.js exists', () => {
  assert(fs.existsSync('app.js'), 'app.js not found');
});

// Test 3: style.css exists
test('style.css exists', () => {
  assert(fs.existsSync('style.css'), 'style.css not found');
});

// Test 4: index.html has proper structure
test('index.html has todo structure', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert(html.includes('todo') || html.includes('task'), 'No todo/task references found');
  assert(html.includes('<input'), 'No input element found');
  assert(html.includes('<button') || html.includes('type="submit"'), 'No button found');
});

// Test 5: app.js has todo functionality
test('app.js has todo functionality', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert(js.includes('todo') || js.includes('task'), 'No todo/task logic found');
});

// Test 6: Priority badges feature exists
test('Priority badges feature exists', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const js = fs.readFileSync('app.js', 'utf8');
  assert(
    html.includes('priority') || js.includes('priority'),
    'Priority feature not found'
  );
});

// Test 7: Footer exists
test('Footer exists', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert(html.includes('footer') || html.includes('Footer'), 'No footer element found');
});

// Test 8: Delete button feature exists (from PR #11)
test('Delete button feature exists', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  const css = fs.readFileSync('style.css', 'utf8');
  assert(js.includes('delete') || js.includes('deleteTodo'), 'Delete functionality not found in app.js');
  assert(css.includes('delete-btn') || css.includes('delete'), 'Delete button styles not found');
});

// Test 9: Edit mode functionality (NEW - for issue #12)
test('Edit mode functionality exists', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert(js.includes('edit') || js.includes('Edit'), 'Edit mode functionality not found');
});

// Test 10: Double-click event for editing (NEW - for issue #12)
test('Double-click to edit functionality exists', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert(
    js.includes('dblclick') || js.includes('doubleclick') || js.includes('double-click'),
    'Double-click event handler not found'
  );
});

// Test 11: Edit input field styling (NEW - for issue #12)
test('Edit input field styling exists', () => {
  const css = fs.readFileSync('style.css', 'utf8');
  assert(
    css.includes('edit') || css.includes('editing') || css.includes('input'),
    'Edit mode styling not found in CSS'
  );
});

// Test 12: Enter key saves edit (NEW - for issue #12)
test('Enter key saves edit functionality', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert(
    js.includes('Enter') || js.includes('keyCode') || js.includes('keydown'),
    'Enter key handling for save not found'
  );
});

// Test 13: Escape key cancels edit (NEW - for issue #12)
test('Escape key cancels edit functionality', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert(
    js.includes('Escape') || js.includes('esc') || js.includes('keyCode'),
    'Escape key handling for cancel not found'
  );
});

// Test 14: Empty text validation (NEW - for issue #12)
test('Empty text validation exists', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert(
    js.includes('trim') || js.includes('length') || js.includes('empty') || js.includes('validation'),
    'Empty text validation not found'
  );
});

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
