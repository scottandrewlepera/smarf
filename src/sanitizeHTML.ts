const DISALLOWED = /[&<>"'\/]/gi;

export function sanitizeHTML(content: string): string {
    const buffer = [];
    for (let i = 0; i < content.length; i++) {
        if (content[i].search(DISALLOWED) === 0) {
            buffer.push(`&#${content[i].charCodeAt(0)};`);
        } else {
            buffer.push(content[i]);
        }
    }
    return buffer.join('');
}
