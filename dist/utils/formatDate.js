export default function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('en-US', {
        timeZone: 'UTC',
        hour12: true,
    });
}
