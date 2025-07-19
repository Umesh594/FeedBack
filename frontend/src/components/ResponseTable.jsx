import { useState, useMemo } from 'react';
import { Download, Calendar, Search, Filter, MoreVertical, Eye } from 'lucide-react';
import { api } from '../utils/api'; // ✅ adjust path if needed
const ResponseTable = ({ form, responses, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedResponses = useMemo(() => {
    let filtered = responses;

    // Filter by search term
    if (searchTerm) {
      filtered = responses.filter(response => {
        const searchLower = searchTerm.toLowerCase();
        return (
          response._id.toLowerCase().includes(searchLower) ||
          Object.values(response.answers || {}).some(answer =>
  String(answer).toLowerCase().includes(searchLower)
)
        );
      });
    }

    // Sort responses
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === 'submittedAt') {
        aValue = new Date(a.submittedAt);
        bValue = new Date(b.submittedAt);
      } else {
        aValue = String(a[sortBy] || '');
        bValue = String(b[sortBy] || '');
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [responses, searchTerm, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = async () => {
  try {
    const response = await api.exportCSV(form._id);
    const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Export failed", err);
  }
};


  const getSummaryStats = () => {
    if (!responses.length) return null;

    const totalResponses = responses.length;
    const lastResponse = responses.reduce((latest, current) => 
      new Date(current.submittedAt) > new Date(latest.submittedAt) ? current : latest
    );

    return {
      total: totalResponses,
      lastSubmission: new Date(lastResponse.submittedAt).toLocaleDateString()
    };
  };

  const stats = getSummaryStats();

  if (!form) {
    return (
      <div className="card-elevated">
        <div className="text-center py-8">
          <div className="animate-pulse">Loading form data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Responses</p>
              </div>
            </div>
          </div>
          
          <div className="card-elevated">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{stats.lastSubmission}</p>
                <p className="text-sm text-muted-foreground">Last Response</p>
              </div>
            </div>
          </div>

          <div className="card-elevated">
            <button
              onClick={handleExport}
              className="btn-accent w-full flex items-center justify-center space-x-2"
              disabled={responses.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Controls */}
      <div className="card-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input max-w-xs"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="submittedAt">Sort by Date</option>
              <option value="id">Sort by ID</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="card-elevated overflow-hidden">
        {filteredAndSortedResponses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {responses.length === 0 ? 'No responses yet' : 'No matching responses'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {responses.length === 0 
                ? 'When people submit your form, their responses will appear here.'
                : 'Try adjusting your search criteria to find responses.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('submittedAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Submitted</span>
                      {sortBy === 'submittedAt' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Response ID</span>
                      {sortBy === 'id' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                  {form.questions.slice(0, 2).map((question) => (
                    <th key={question._id} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {question.question.length > 30 
                        ? `${question.question.substring(0, 30)}...` 
                        : question.question
                      }
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedResponses.map((response, index) => (
                  <tr key={response._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(response.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground">
                      {response._id.substring(0, 8)}...
                    </td>
                    {form.questions.slice(0, 2).map((question) => (
                      <td key={question._id} className="px-6 py-4 text-sm text-foreground max-w-xs">
                        <div className="truncate">
                          {response.answers?.[question._id] || '-'}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => onViewDetails && onViewDetails(response)}
                        className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseTable;