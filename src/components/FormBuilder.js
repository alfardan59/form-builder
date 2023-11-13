// src/components/FormBuilder.js
import React, { useState } from 'react';
import Question from './Question';

const FormBuilder = () => {
  const [form, setForm] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [clozeSentence, setClozeSentence] = useState('');
  const [comprehensionParagraph, setComprehensionParagraph] = useState('');
  const [newMCQQuestion, setNewMCQQuestion] = useState('');
  const [mcqOptions, setMCQOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const addTextQuestion = () => {
    if (newQuestionText.trim() !== '') {
      setForm([...form, { type: 'text', text: newQuestionText }]);
      setNewQuestionText('');
    }
  };

  const addCategorizeQuestion = () => {
    if (newCategoryTitle.trim() !== '') {
      setForm([...form, { type: 'categorize', categoryTitle: newCategoryTitle, items: [] }]);
      setNewCategoryTitle('');
    }
  };

  const addClozeQuestion = () => {
    if (clozeSentence.trim() !== '') {
      setForm([...form, { type: 'cloze', sentence: clozeSentence }]);
      setClozeSentence('');
    }
  };

  const addComprehensionQuestion = () => {
    if (comprehensionParagraph.trim() !== '') {
      setForm([...form, { type: 'comprehension', paragraph: comprehensionParagraph, questions: [] }]);
      setComprehensionParagraph('');
    }
  };

  const addMCQOption = () => {
    if (newMCQQuestion.trim() !== '') {
      setMCQOptions([...mcqOptions, newMCQQuestion]);
      setNewMCQQuestion('');
    }
  };

  const addMCQQuestion = () => {
    if (mcqOptions.length > 0) {
      const newMCQ = {
        type: 'mcq',
        question: newMCQQuestion,
        options: mcqOptions,
        correctOption: '',
      };
      setForm([...form, newMCQ]);
      setNewMCQQuestion('');
      setMCQOptions([]);
    }
  };

  const handleDragEnd = (result) => {
    // Implement drag-and-drop logic
  };

  return (
    <div>
      <h2>Add Questions</h2>
      {/* Text Question */}
      <div>
        <label>Add Text Question:</label>
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
        />
        <button onClick={addTextQuestion}>Add</button>
      </div>

      {/* Categorize Question */}
      <div>
        <label>Add Categorize Question:</label>
        <input
          type="text"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
        />
        <button onClick={addCategorizeQuestion}>Add</button>
      </div>

      {/* Cloze Question */}
      <div>
        <label>Add Cloze Question:</label>
        <textarea
          value={clozeSentence}
          onChange={(e) => setClozeSentence(e.target.value)}
        />
        <button onClick={addClozeQuestion}>Add</button>
      </div>

      {/* Comprehension Question */}
      <div>
        <label>Add Comprehension Question:</label>
        <textarea
          value={comprehensionParagraph}
          onChange={(e) => setComprehensionParagraph(e.target.value)}
        />
        <button onClick={addComprehensionQuestion}>Add</button>
      </div>
      {/* MCQ Question */}
      <div>
        <label>Add MCQ Question:</label>
        <input
          type="text"
          value={newMCQQuestion}
          onChange={(e) => setNewMCQQuestion(e.target.value)}
        />
        <button onClick={addMCQOption}>Add Option</button>
        <ul>
          {mcqOptions.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
        <button onClick={addMCQQuestion}>Add MCQ</button>
      </div>

      <h2>Form Preview</h2>
      <div>
        {/* Render the form questions */}
        {form.map((question, index) => (
          <Question key={index} question={question} />
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
