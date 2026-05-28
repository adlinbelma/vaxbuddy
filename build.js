// build.js - Generates config.js from .env.local
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const config = `// Generated config from .env.local - do not commit this file
window.CONFIG = {
  SUPABASE_URL: '${process.env.SUPABASE_URL || 'https://iosptbalafogtbxvnqno.supabase.co'}',
  SUPABASE_KEY: '${process.env.SUPABASE_KEY || ''}',
  GROK_API_KEY: '${process.env.GROK_API_KEY || ''}'
};
`;

fs.writeFileSync('config.js', config);
console.log('✅ config.js generated from .env.local');
