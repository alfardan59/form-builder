import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { MdDragIndicator } from 'react-icons/md';

const ClozeForm = ({ question, setQuestions }) => {
  const [newOption, setNewOption] = useState('');
  const [draggedOption, setDraggedOption] = useState(null);
  const [selectedText, setSelectedText] = useState(null);

  const sentenceInputRef = useRef(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // Update the order of options in the state
    const updatedOptions = [...question.options];
    const [removed] = updatedOptions.splice(result.source.index, 1);
    updatedOptions.splice(result.destination.index, 0, removed);

    setQuestions((questions) =>
      questions.map((q) =>
        q.questionId === question.questionId ? { ...q, options: updatedOptions } : q
      )
    );
  };


  const handleRemoveOption = (optionId) => {
    setQuestions((questions) => {
      return questions.map((q) => {
        if (q.questionId === question.questionId) {
          const removedOption = q.options.find((option) => option.optionId === optionId)
          return {
            ...q,
            options: q.options.filter((option) => option.optionId !== optionId),
            blankSentence: removeOptionBlankSentence(q.blankSentence, removedOption)
          }
        }
        return q
      }
      )
    }

    );
  };

  const removeOptionBlankSentence = (oldBlankSentence, removedOption) => {
    let newBlankSentence = []
    for (let i = 0; i < oldBlankSentence.length; i++) {
      const current = oldBlankSentence[i]
      console.log(current, newBlankSentence)
      if (current.blankId === removedOption.blankId) {
        const lastIndex = newBlankSentence.length - 1
        console.log(newBlankSentence[lastIndex], removedOption, oldBlankSentence[i + 1])
        newBlankSentence[lastIndex].text = newBlankSentence[lastIndex].text + removedOption.text + oldBlankSentence[i + 1].text;
        i++;

      } else newBlankSentence.push(current)
    }
    return newBlankSentence
  }

  const handleOptionTextChange = (event, optionId) => {
    setQuestions((questions) =>
      questions.map((q) =>
        q.questionId === question.questionId
          ? {
            ...q,
            options: q.options.map((option) =>
              option.optionId === optionId ? { ...option, text: event.target.value } : option
            ),
          }
          : q
      )
    );
  };

  const handleSentenceSelect = () => {
    if (typeof window.getSelection !== 'undefined') {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (selectedText !== '') {
        setSelectedText(selectedText);
      }
    }
  };

  const handleMakeOption = () => {
    if (selectedText) {
      setNewOption(selectedText);
      setSelectedText(null);

      const currentBlankId = `blank-${Date.now()}`
      // Insert the new option at the end of the options array
      setQuestions((questions) =>
        questions.map((q) =>
          q.questionId === question.questionId
            ? {
              ...q,
              options: [
                ...q.options,
                {
                  optionId: Date.now(),
                  text: selectedText,
                  blankId: currentBlankId,
                },
              ],
              // Update blankSentence based on the new option
              blankSentence: updateBlankSentence(q.blankSentence, selectedText, currentBlankId),
            }
            : q
        )
      );
    }
  };


  const updateBlankSentence = (oldBlankSentence, newOption, blankId) => {
    let newBlankSentence = [];
    oldBlankSentence.forEach((blankSentence) => {
      if (blankSentence.type === 'text' && blankSentence.text.includes(newOption)) {
        const startIndex = blankSentence.text.indexOf(newOption);
        const endIndex = startIndex + newOption.length;
        const beforeText = blankSentence.text.substring(0, startIndex);
        const afterText = blankSentence.text.substring(endIndex);

        newBlankSentence.push(
          { type: 'text', text: beforeText },
          { type: 'blank', blankId },
          { type: 'text', text: afterText },
        );
      } else newBlankSentence.push(blankSentence)
    })

    return newBlankSentence;
  };


  useEffect(() => {
    console.log(question)
  }, [question])

  const handleSentenceChange = (e) => {
    const newText = e.target.value;
    setQuestions((questions) => {
      return questions.map((q) => {
        if (q.questionId === question.questionId) {
          // filter out options that are still available 
          const options = q.options.filter((option) => newText.includes(option.text))
          // reconstruct blank sentence if an option is removed 
          let blankSentence = [{ type: 'text', text: newText }]
          options.forEach((option) => {
            blankSentence = updateBlankSentence(blankSentence, option.text, option.blankId)
          })

          return { ...q, rawSentence: newText, options, blankSentence }
        }
        return q
      })
    }

    )

  }

  return (
    <div className="my-4 p-6 border-2 border-gray-500 rounded-lg max-w-[600px]">
      <h2 className="text-xl font-semibold mb-4">Question {question.questionNo}</h2>
      <div className="mb-4">
        <label className="block mb-2">Raw Sentence:</label>
        <textarea
          ref={sentenceInputRef}
          value={question.rawSentence}
          onChange={handleSentenceChange}
          onMouseUp={handleSentenceSelect}
          className="w-full px-2 py-1 border rounded"
        ></textarea>
        <button onClick={handleMakeOption} disabled={!selectedText} className="bg-blue-500 text-white px-4 py-1 rounded mt-2 disabled:opacity-60">
          Make it Option
        </button>
      </div>


      <h3 className="text-lg font-semibold mb-2">Preview Sentence:</h3>
      <p className='inline-block px-2 py-1 border rounded bg-gray-100 mb-2 mr-2'>
        {
          question.blankSentence.map((sentence) => {
            if (sentence.type === 'blank') return <span>___</span>
            else return sentence.text
          })
        }
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="options">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mb-4"
            >
              {question.options.map((option, index) => (
                <Draggable key={option.optionId} draggableId={option.optionId.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="px-2 py-1 border rounded bg-gray-100 mb-2 mr-2 flex "
                    >

                      <button
                        {...provided.dragHandleProps}>
                        <MdDragIndicator
                        /></button>

                      <p>{option.text}</p>

                      <button
                        onClick={() => handleRemoveOption(option.optionId)}
                        className=" text-red-500 ms-auto"
                      >
                        &#x2715;
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>


    </div>
  );
};

export default ClozeForm;
