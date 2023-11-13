import React, { useEffect, useState } from "react";
import CategoryForm from "../components/CategoryForm";
import NewQuestionCreateForm from "../components/NewQuestionCreateForm";
import ClozeForm from "../components/ClozeForm";

function FormEditor() {
  const [questions, setQuestions] = useState([
    {
      questionNo: 1,
      questionId: Date.now(),
      type: 'category',
      categories: [{ id: Date.now(), title: '' }],
      items: [{ id: Date.now(), title: '', categoryId: '' }],
    },
  ])

  useEffect(() => {
    console.log(questions);
  }, [questions])


  return <div className="p-6">
    {
      questions.map((question) => {
        if (question.type === 'category')
          return <CategoryForm question={question} setQuestions={setQuestions} key={question.id} />
        else if (question.type === 'cloze')
          return <ClozeForm question={question} setQuestions={setQuestions} key={question.id} />
      })
    }
    <NewQuestionCreateForm setQuestions={setQuestions} />
  </div>;
}

export default FormEditor;
