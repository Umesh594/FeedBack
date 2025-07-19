import { useState } from 'react';
import { Trash2, Plus, Minus, GripVertical } from 'lucide-react';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../utils/constants';

const QuestionBlock = ({ 
  question, 
  onUpdate, 
  onDelete, 
  canDelete = true, 
  isEditable = true,
  answer = '',
  onAnswerChange = null
}) => {
  const [localAnswer, setLocalAnswer] = useState(answer);

  const handleQuestionTextChange = (value) => {
    if (isEditable && onUpdate) {
      onUpdate({ ...question, question: value });
    }
  };

  const handleTypeChange = (type) => {
    if (isEditable && onUpdate) {
      const updatedQuestion = { 
        ...question, 
        type,
        options: type === QUESTION_TYPES.MULTIPLE_CHOICE ? (question.options?.length ? question.options : ['Option 1', 'Option 2']) : []
      };
      onUpdate(updatedQuestion);
    }
  };

  const handleRequiredChange = (required) => {
    if (isEditable && onUpdate) {
      onUpdate({ ...question, required });
    }
  };

  const handleOptionChange = (index, value) => {
    if (isEditable && onUpdate) {
      const newOptions = [...(question.options || [])];
      newOptions[index] = value;
      onUpdate({ ...question, options: newOptions });
    }
  };

  const addOption = () => {
    if (isEditable && onUpdate) {
      const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
      onUpdate({ ...question, options: newOptions });
    }
  };

  const removeOption = (index) => {
    if (isEditable && onUpdate && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== index);
      onUpdate({ ...question, options: newOptions });
    }
  };

  const handleAnswerChange = (value) => {
    setLocalAnswer(value);
    if (onAnswerChange) {
      onAnswerChange(question._id, value);
    }
  };

  if (!isEditable) {
    // Display mode for public form
    return (
      <div className="card-elevated animate-fade-in">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {question.question}
            {question.required && <span className="text-destructive ml-1">*</span>}
          </h3>
        </div>

        {question.type === QUESTION_TYPES.TEXT ? (
          <textarea
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="form-textarea"
            required={question.required}
          />
        ) : (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name={`question_${question._id}`}
                  value={option}
                  checked={localAnswer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4 text-primary border-2 border-border focus:ring-primary/20"
                  required={question.required}
                />
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Edit mode for form creation
  return (
    <div className="card-elevated group animate-slide-up">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <select
              value={question.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>{label}</option>
              ))}
            </select>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => handleRequiredChange(e.target.checked)}
                className="w-4 h-4 text-primary border border-border rounded focus:ring-primary/20"
              />
              <span className="text-muted-foreground">Required</span>
            </label>
          </div>
          
          <input
            type="text"
            value={question.question}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
            placeholder="Enter your question here..."
            className="form-input text-lg font-medium"
          />
        </div>

        {canDelete && (
          <button
            onClick={() => onDelete(question._id)}
            className="ml-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Question Options */}
      {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Answer Options:</label>
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-4 h-4 border-2 border-border rounded-full"></div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="form-input"
                />
              </div>
              {question.options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                  title="Remove Option"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addOption}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Add Option</span>
          </button>
        </div>
      )}

      {/* Preview */}
      {question.type === QUESTION_TYPES.TEXT && (
        <div className="mt-4 pt-4 border-t border-border">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Preview:</label>
          <textarea
            placeholder="Type your answer here..."
            rows={3}
            className="form-textarea opacity-60"
            disabled
          />
        </div>
      )}
    </div>
  );
};

export default QuestionBlock;