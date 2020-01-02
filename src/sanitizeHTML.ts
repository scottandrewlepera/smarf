const ALPHANUM = /[a-z0-9]/i;

export function sanitize(content: string): string {
    const buffer = [];
    for (let i = 0; i < content.length; i++) {
        if (content[i].search(ALPHANUM) < 0 &&
            content[i].charCodeAt(0) < 256) {
            buffer.push(`&#${content[i].charCodeAt(0)};`);
        } else {
            buffer.push(content[i]);
        }
    }
    return buffer.join('');
}
