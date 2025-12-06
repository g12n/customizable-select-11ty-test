import posthtml from 'posthtml';

// Test HTML matching the structure from your bug report
const html = `
<select>
  <button>
    <selectedcontent></selectedcontent>
  </button>
  <option value="pokeball">
    <img src="https://assets.codepen.io/159218/pokeball.svg" alt="" />
    Pokeball
  </option>
  <option value="greatball">
    <img src="https://assets.codepen.io/159218/great-ball.svg" alt="" />
    Great ball
  </option>
  <option value="ultraball">
    <img src="https://assets.codepen.io/159218/ultra-ball.svg" alt="" />
    Ultra ball
  </option>
</select>
`;

console.log('Input HTML:');
console.log(html);
console.log('\n---\n');

const result = posthtml()
  .process(html, { sync: true })
  .html;

console.log('PostHTML Output:');
console.log(result);
console.log('\n---\n');

// Check if select tag was prematurely closed
if (result.includes('</select><button>')) {
  console.log('❌ BUG DETECTED: PostHTML prematurely closed the <select> tag!');
} else if (result.includes('<select>\n  <button>') || result.includes('<select><button>')) {
  console.log('✓ PASS: PostHTML preserved the structure correctly');
} else {
  console.log('⚠️  UNCLEAR: Check the output manually');
}