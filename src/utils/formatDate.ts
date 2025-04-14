export default function formatDate(timestamp: number): string { 
    return new Date(timestamp).toLocaleString('en-US', {
      timeZone: 'UTC',
      hour12: true,
    });
  }
  
