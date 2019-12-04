import { Blog } from '../types';
const fs = require('fs');
const path = require('path');

const CONFIG_PATH: string = './blog_config.json';

export function loadConfig(): Blog {
    const config = fs.readFileSync(CONFIG_PATH);
    const blogConfig: Blog = JSON.parse(config);
    return blogConfig;
}

export default loadConfig;
