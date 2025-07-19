import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Eye, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';
import { ROUTES, DEFAULT_QUESTION_STRUCTURE, QUESTION_TYPES } from '../utils/constants';
import QuestionBlock from '../components/QuestionBlock';

const CreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [
      { 
        type: QUESTION_TYPES.TEXT, 
        question: '',
        required: true,
        options: [],
        __tempId: Date.now().toString() + Math.random().toString(36).substring(2, 6)
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [createdFormLink, setCreatedFormLink] = useState('');

  useEffect(() => {
  if (!api.isAuthenticated()) {
    navigate(ROUTES.LOGIN);
    return;
  }

  setFormData(prev => {
    const hasEmailField = prev.questions.some(q => q.isEmailField);

    if (hasEmailField) return prev;

    const emailField = {
      question: 'Email',
      type: QUESTION_TYPES.TEXT,
      required: true,
      options: [],
      isEmailField: true, // ✅ Add custom identifier
      __tempId: 'email_field_' + Date.now()
    };

    return {
      ...prev,
      questions: [emailField, ...prev.questions]
    };
  });
}, [navigate]);


  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleQuestionUpdate = (tempId, updatedQuestion) => {
  setFormData(prev => ({
    ...prev,
    questions: prev.questions.map(q =>
      q.__tempId === tempId ? { ...updatedQuestion, __tempId: tempId } : q
    )
  }));
};

const handleQuestionDelete = (tempId) => {
  if (formData.questions.length <= 1) {
    alert('You must have at least one question in your form.');
    return;
  }

  setFormData(prev => ({
    ...prev,
    questions: prev.questions.filter(q => q.__tempId !== tempId)
  }));
};


  const addQuestion = () => {
  const newQuestion = {
    ...JSON.parse(JSON.stringify(DEFAULT_QUESTION_STRUCTURE)),
    type: QUESTION_TYPES.TEXT,
    __tempId: Date.now().toString() + Math.random().toString(36).substring(2, 6) // unique
  };

  setFormData(prev => ({
    ...prev,
    questions: [...prev.questions, newQuestion]
  }));
};

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Form title is required');
      return false;
    }

    if (formData.questions.length === 0) {
      setError('At least one question is required');
      return false;
    }

    for (const question of formData.questions) {
      if (!question.question.trim()) {
        setError('All questions must have text');
        return false;
      }
      
      if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
        if (!question.options || question.options.length < 2) {
          setError('Multiple choice questions must have at least 2 options');
          return false;
        }
        
        if (question.options.some(option => !option.trim())) {
          setError('All multiple choice options must have text');
          return false;
        }
      }
    }

    return true;
  };

  const handleSaveForm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const sanitizedQuestions = formData.questions.map(({ __tempId, ...rest }) => rest);

const payload = {
  ...formData,
  questions: sanitizedQuestions
};

const savedForm = await api.createForm(payload);

    console.log("✅ Saved form:", savedForm); // Add this temporarily

    if (!savedForm._id) {
      throw new Error("Form ID is missing in response");
    }

    const link = `${window.location.origin}${ROUTES.PUBLIC_FORM}/${savedForm._id}`;
    setCreatedFormLink(link);

      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Failed to create form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Edit</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              Preview Mode
            </span>
            <button
              onClick={handleSaveForm}
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Form</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form Preview */}
        <div className="max-w-2xl mx-auto">
          <div className="hero-gradient text-white rounded-xl p-8 mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{formData.title || 'Untitled Form'}</h1>
            {formData.description && (
              <p className="text-white/80 text-lg">{formData.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {formData.questions.map((question, index) => (
              <QuestionBlock
                key={question._id}
                question={question}
                isEditable={false}
              />
            ))}
            
            <div className="card-elevated text-center">
              <button className="btn-primary w-full sm:w-auto">
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Create New Form</h1>
          <p className="mt-2 text-muted-foreground">
            Build a custom feedback form for your customers
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3 animate-slide-up">
          <button
            onClick={() => setShowPreview(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSaveForm}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Form</span>
              </>
            )}
          </button>
        </div>
      </div>
      {createdFormLink && (
  <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
    ✅ Form created! Share this link:<br />
    <a
      href={createdFormLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline break-all"
    >
      {createdFormLink}
    </a>
  </div>
)}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 animate-bounce-in">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Details */}
          <div className="card-elevated animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-6">Form Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Form Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormDataChange('title', e.target.value)}
                  placeholder="e.g., Customer Satisfaction Survey"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormDataChange('description', e.target.value)}
                  placeholder="Brief description of what this form is for..."
                  rows={3}
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Questions</h2>
              <button
                onClick={addQuestion}
                className="btn-accent flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>

            {formData.questions.map((question, index) => (
  <QuestionBlock
    key={question.__tempId}
    question={question}
    onUpdate={(updatedQuestion) => handleQuestionUpdate(question.__tempId, updatedQuestion)}
    onDelete={() => handleQuestionDelete(question.__tempId)}
    canDelete={formData.questions.length > 1}
  />
))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Form Info */}
          <div className="card-elevated">
            <h3 className="font-semibold text-foreground mb-4">Form Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="text-foreground font-medium">{formData.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required fields:</span>
                <span className="text-foreground font-medium">
                  {formData.questions.filter(q => q.required).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Multiple choice:</span>
                <span className="text-foreground font-medium">
                  {formData.questions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_CHOICE).length}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card-elevated bg-accent/5 border-accent/20">
            <h3 className="font-semibold text-foreground mb-4">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Keep questions clear and concise</li>
              <li>• Use multiple choice for quick responses</li>
              <li>• Mark important questions as required</li>
              <li>• Preview your form before saving</li>
              <li>• Aim for 3-7 questions for best response rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;