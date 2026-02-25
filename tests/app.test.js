// Simple tests for KeetTodo app
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

console.log('Running KeetTodo Tests...\n');

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

// Test 6: Priority badges feature exists (from previous PR)
test('Priority badges feature exists', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const js = fs.readFileSync('app.js', 'utf8');
  assert(
    html.includes('priority') || js.includes('priority'),
    'Priority feature not found - may need to be implemented'
  );
});

// Test 7: Footer exists
test('Footer exists', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert(html.includes('footer') || html.includes('Footer'), 'No footer element found');
});

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
