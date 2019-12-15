export function die(message: string) {
    console.error(`ERROR: ${message}`);
    process.exit();
}
