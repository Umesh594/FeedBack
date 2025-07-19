export const exportToCSV = (data, filename = 'feedback_responses.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  // Extract headers from the first response
  const firstResponse = data[0];
  const headers = ['Submission ID', 'Submitted At'];
  
  // Add question headers
  if (firstResponse.answers && Object.keys(firstResponse.answers).length > 0) {
  Object.keys(firstResponse.answers).forEach(questionId => {
    headers.push(`Question: ${questionId}`);
  });
}

  // Create CSV content
  let csvContent = headers.join(',') + '\n';

  // Add data rows
  data.forEach(response => {
    const row = [
      response._id,
      new Date(response.submittedAt).toLocaleString()
    ];

    // Add response values
    if (response.responses) {
      Object.keys(firstResponse.answers).forEach(questionId => {
  const answer = response.answers?.[questionId] || '';
        // Escape quotes and commas in CSV
        const escapedAnswer = `"${String(answer).replace(/"/g, '""')}"`;
        row.push(escapedAnswer);
      });
    }

    csvContent += row.join(',') + '\n';
  });

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};