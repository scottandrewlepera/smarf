import { checkType } from './src/checkType';

const CONFIG_PATH = '../blog_config.json';
const config = require(CONFIG_PATH);

checkType(config, 'Blog');

console.log('Blog config loaded and validated.');
