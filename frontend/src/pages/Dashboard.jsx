import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, Trash2, Share2, Copy, BarChart3, Users } from 'lucide-react';
import { api } from '../utils/api';
import { ROUTES } from '../utils/constants';
import ResponseTable from '../components/ResponseTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [sharedLink, setSharedLink] = useState('');

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }
    loadForms();
  }, [navigate]);

  const loadForms = async () => {
  try {
    setIsLoading(true);
    const userForms = await api.getForms();
    setForms(userForms);

    // Load responses for each form with error handling
    const responsesData = {};
    for (const form of userForms) {
      try {
        if (form._id) {
          // Add timestamp to prevent caching issues
          const formResponses = await api.getFormResponses(form._id, { t: Date.now() });
          responsesData[form._id] = formResponses;
          console.log(`Fetched ${formResponses.length} responses for form ${form._id}`);
        }
      } catch (err) {
        console.error(`Error loading responses for form ${form._id}:`, err);
        responsesData[form._id] = [];
      }
    }
    setResponses(responsesData);
  } catch (error) {
    console.error('Failed to load forms:', error);
  } finally {
    setIsLoading(false);
  }
};
  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteForm(formId);
      setForms(forms.filter(form => form._id !== formId));
      delete responses[formId];
      setResponses({ ...responses });
      
      if (selectedForm?._id === formId) {
        setSelectedForm(null);
      }
    } catch (error) {
      console.error('Failed to delete form:', error);
      alert('Failed to delete form. Please try again.');
    }
  };

  const handleCopyFormLink = (formId) => {
  const formUrl = `${window.location.origin}${ROUTES.PUBLIC_FORM}/${formId}`;
  setSharedLink(formUrl); // Show this in UI
  navigator.clipboard.writeText(formUrl).then(() => {
    alert('Form link copied to clipboard!');
  });
};


  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setShowResponseModal(true);
  };

  const getFormStats = (formId) => {
    const formResponses = responses[formId] || [];
    return {
      totalResponses: formResponses.length,
      lastResponse: formResponses.length > 0 
        ? formResponses.reduce((latest, current) => 
            new Date(current.submittedAt) > new Date(latest.submittedAt) ? current : latest
          ).submittedAt
        : null
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your feedback forms and view responses
          </p>
        </div>
        <div className="mt-4 sm:mt-0 animate-slide-up">
          <Link to={ROUTES.CREATE_FORM} className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create New Form</span>
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      {forms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <div className="card-elevated">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{forms.length}</p>
                <p className="text-sm text-muted-foreground">Active Forms</p>
              </div>
            </div>
          </div>
          
          <div className="card-elevated">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(responses).reduce((total, formResponses) => total + formResponses.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Responses</p>
              </div>
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {forms.filter(form => (responses[form._id] || []).length > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Forms with Responses</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms List */}
      {forms.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No forms yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first feedback form to start collecting responses from your customers.
          </p>
          <Link to={ROUTES.CREATE_FORM} className="btn-primary inline-flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Your First Form</span>
          </Link>
        </div>
      ) : selectedForm ? (
        <div className="space-y-6 animate-fade-in">
          {/* Form Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedForm(null)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-2"
            >
              <span>← Back to Forms</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopyFormLink(selectedForm._id)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Form</span>
              </button>
            </div>
            {sharedLink && (
  <div className="mt-2 text-blue-600 underline break-all">
    <a href={sharedLink} target="_blank" rel="noopener noreferrer">
      {sharedLink}
    </a>
  </div>
)}
          </div>

          <div className="card-elevated">
            <h2 className="text-2xl font-bold text-foreground mb-2">{selectedForm.title}</h2>
            {selectedForm.description && (
              <p className="text-muted-foreground mb-4">{selectedForm.description}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Created: {new Date(selectedForm.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{selectedForm.questions.length} Questions</span>
            </div>
          </div>

          {/* Responses Table */}
          <ResponseTable
            form={selectedForm}
            responses={responses[selectedForm._id] || []}
            onViewDetails={handleViewResponse}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          {forms.map((form) => {
            const stats = getFormStats(form._id);
            return (
              <div key={form._id} className="card-elevated group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{form.questions.length} questions</span>
                      <span>•</span>
                      <span>{stats.totalResponses} responses</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyFormLink(form._id)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Copy form link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form._id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete form"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    {stats.lastResponse ? (
                      <span>Last response: {new Date(stats.lastResponse).toLocaleDateString()}</span>
                    ) : (
                      <span>No responses yet</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedForm(form)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Response Detail Modal */}
      {showResponseModal && selectedResponse && selectedForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Response Details</h3>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Submitted on {new Date(selectedResponse.submittedAt).toLocaleString()}
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {selectedForm.questions.map((question) => (
                  <div key={question._id}>
                    <h4 className="font-medium text-foreground mb-2">{question.question}</h4>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-foreground">
                        {selectedResponse.answers[question._id] || <em className="text-muted-foreground">No answer provided</em>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;