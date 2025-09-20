const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('请传入新版本号，例如：node update-version.js 0.2.7');
  process.exit(1);
}

// 更新 package.json
const pkgPath = path.resolve(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// 更新 tauri.conf.json
const tauriConfPath = path.resolve(__dirname, 'src-tauri/tauri.conf.json');
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
tauriConf.version = newVersion;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');

// 更新 Cargo.toml
const cargoPath = path.resolve(__dirname, 'src-tauri/Cargo.toml');
let cargo = fs.readFileSync(cargoPath, 'utf8');
cargo = cargo.replace(/version\s*=\s*".*?"/, `version = "${newVersion}"`);
fs.writeFileSync(cargoPath, cargo);

// 更新版本常量文件
const versionPath = path.resolve(__dirname, 'src/constants/version.ts');
let versionContent = fs.readFileSync(versionPath, 'utf8');
versionContent = versionContent.replace(/export const APP_VERSION = ".*?";/, `export const APP_VERSION = "${newVersion}";`);
fs.writeFileSync(versionPath, versionContent);

console.log('版本号已更新为', newVersion); 