import { Blog } from './types'; 
import { loadConfig } from './src/';

const config: Blog = loadConfig();
console.log(config);
