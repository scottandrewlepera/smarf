export function slugify(title: string): string {
    return title.replace(/\s/gi, '_')
                .replace(/[^a-z0-9_]/gi, '')
                .toLowerCase()
                .slice(0, 50);
}