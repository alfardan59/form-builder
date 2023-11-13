import React, { useState } from "react";

function NewQuestionCreateForm({ setQuestions }) {
  const [questionType, setQuestionType] = useState('category')

  const createNewQuestion = () => {
    let otherData = {}
    if (questionType === 'category') otherData = {
      categories: [],
      items: []
    }
    else if (questionType === 'cloze') otherData = {
      rawSentence: '',
      blankSentence: [],
      options: []
    }
    setQuestions((questions) => {
      return [...questions, {
        questionNo: questions.length + 1,
        questionId: Date.now(),
        type: questionType,
        ...otherData
      }]
    })
  }

  return <div className="p-6 bg-slate-400 max-w-[500px] rounded-md">
    <p>Select Question Type to Add</p>
    <select
      className=" px-2 py-1 border rounded max-w-[250px]"
      onChange={(e) => setQuestionType(e.target.value)}
      value={questionType}
    >

      <option value='category'>
        Category
      </option>
      <option value='cloze'>
        Cloze
      </option>
      <option value="comprehension">
        Comprehension
      </option>
    </select>
    <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={createNewQuestion}>Add Question</button>
  </div>
}

export default NewQuestionCreateForm;
