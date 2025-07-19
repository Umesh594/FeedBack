import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import QuestionBlock from '../components/QuestionBlock';

const PublicForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      setIsLoading(true);
      const formData = await api.getFormById(formId);
      setForm(formData);
    } catch (err) {
      setError('Form not found or no longer available.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
    if (error) setError('');
  };

  const validateResponses = () => {
    if (!form) return false;

    for (const question of form.questions) {
      if (question.required) {
        const answer = responses[question._id];
        if (!answer || answer.trim() === '') {
          setError(`Please answer the required question: "${question.question}"`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting form:", formId, responses);

  if (!validateResponses()) return;

  try {
    setIsSubmitting(true);
    const result = await api.submitResponse(formId, responses); // ✅ fixed line
console.log("✅ Submission result:", JSON.stringify(result, null, 2)); // 👈 Add this here
    setIsSubmitted(true);
  } catch (err) {
    console.error("Submission error:", err.response?.data || err.message);
    setError('Failed to submit response. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please check the link or contact the form creator.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-bounce-in">
          <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Thank You!</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Your feedback has been submitted successfully.
          </p>
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <p className="text-success text-sm">
              Your response helps us improve our services. We appreciate your time!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Form Header */}
        <div className="hero-gradient text-white rounded-xl p-8 mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-white/80 text-lg">{form.description}</p>
          )}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg animate-bounce-in">
              {error}
            </div>
          )}

          {/* Questions */}
          {form.questions.map((question, index) => (
            <div key={question._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <QuestionBlock
                question={question}
                isEditable={false}
                answer={responses[question._id] || ''}
                onAnswerChange={handleAnswerChange}
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="card-elevated text-center animate-slide-up">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
            
            <p className="text-xs text-muted-foreground mt-4">
              Your feedback is important to us and will be kept confidential.
            </p>
          </div>
        </form>

        {/* Form Footer */}
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FeedbackHub
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;