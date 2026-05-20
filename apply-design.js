import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Backgrounds
    content = content.replace(/bg-zinc-950/g, 'bg-[#080808]');
    content = content.replace(/bg-zinc-900\/50/g, 'bg-[#0c0c0c]');
    content = content.replace(/bg-zinc-900\/30/g, 'bg-[#0c0c0c]');
    content = content.replace(/bg-zinc-900/g, 'bg-[#0c0c0c]');
    
    // Borders
    content = content.replace(/border-zinc-800\/50/g, 'border-[#262626]');
    content = content.replace(/border-zinc-800/g, 'border-[#262626]');
    content = content.replace(/border-zinc-700/g, 'border-[#2D5BFF]');
    
    // Text colors
    content = content.replace(/text-zinc-500/g, 'text-[#8e90a2]');
    content = content.replace(/text-zinc-400/g, 'text-[#c6c6c6]');
    content = content.replace(/text-zinc-300/g, 'text-[#e2e2e2]');
    content = content.replace(/text-white/g, 'text-[#e2e2e2]');
    
    // Buttons and Accents
    content = content.replace(/bg-white text-zinc-950/g, 'bg-[#2D5BFF] text-white border-transparent hover:bg-opacity-90');
    content = content.replace(/from-zinc-100 to-zinc-500/g, 'from-[#e2e2e2] to-[#8e90a2]');
    
    // Border Radius
    content = content.replace(/rounded-full/g, 'rounded');
    content = content.replace(/rounded-2xl/g, 'rounded-lg');
    content = content.replace(/rounded-3xl/g, 'rounded-lg');
    content = content.replace(/rounded-xl/g, 'rounded-lg');
    
    // Font changes
    content = content.replace(/font-display/g, 'font-sans tracking-tight');
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
});
