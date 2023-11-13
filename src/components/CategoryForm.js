// src/components/CategoryForm.js
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { MdDragIndicator } from "react-icons/md"


const CategoryForm = ({ question, setQuestions }) => {

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };


  const removeCategoryInput = (id) => {
    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {
          const updatedCategories = currentQuestion.categories.filter((category) => category.id !== id);
          return { ...currentQuestion, categories: updatedCategories }
        }
        return currentQuestion
      })
    });
  };

  const handleCategoryChange = (event, id) => {
    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {
          const updatedCategories = currentQuestion.categories.map((category) => {
            if (category.id === id) {
              return { ...category, title: event.target.value };
            }
            return category;
          });
          return { ...currentQuestion, categories: updatedCategories }
        }
        return currentQuestion
      })
    });
  };

  const createEmptyCategory = (event, clickedCategoryId) => {

    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.questionId) {
          console.log("current", currentQuestion, question.id)
          let categories = currentQuestion.categories
          const categoriesSize = categories.length
          const lastCategoryId = categories[categoriesSize - 1].id
          if (lastCategoryId === clickedCategoryId) categories = [...categories, { id: Date.now(), title: '' }]

          return { ...question, categories }

        }
        return currentQuestion
      })
    });


  }

  function onCategoryDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {

          const categories = reorder(
            question.categories,
            result.source.index,
            result.destination.index
          );


          return { ...question, categories }

        }
        return currentQuestion
      })
    });


  }

  function onItemDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {

          const newItems = reorder(
            question.items,
            result.source.index,
            result.destination.index
          );


          return { ...question, items: newItems }

        }
        return currentQuestion
      })
    });

  }


  const handleItemTitleChange = (event, itemId) => {


    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {

          const updatedItems = question.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, title: event.target.value };
            }
            return item;
          });

          return { ...question, items: updatedItems }

        }
        return currentQuestion
      })
    });

  };

  const handleItemCategoryChange = (event, itemId) => {


    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {

          const updatedItems = question.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, categoryId: event.target.value };
            }
            return item;
          });

          return { ...question, items: updatedItems }

        }
        return currentQuestion
      })
    });

  }

  const createEmptyItem = (event, clickedItemId) => {
    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {

          let items = question.items
          const itemsSize = items.length
          const lastItemId = items[itemsSize - 1].id
          if (lastItemId === clickedItemId) items = [...items, { id: Date.now(), title: '', categoryId: '' }]


          return { ...question, items }

        }
        return currentQuestion
      })
    });


  }

  const removeItemInput = (e, id) => {
    setQuestions((questions) => {
      return questions.map((currentQuestion) => {
        if (currentQuestion.id === question.id) {
          const updatedItems = question.items.filter((item) => item.id !== id);
          return { ...question, items: updatedItems }

        }
        return currentQuestion
      })
    });


  }

  useEffect(() => {
    console.log("categoryForm", question)
  }, [question]);

  return (
    <div className="my-4 p-6 border-2 border-gray-500 rounded-lg max-w-[600px]">
      <h2 className='text-xl font-semibold mb-4'>Question {question.questionNo}</h2>
      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      <DragDropContext onDragEnd={onCategoryDragEnd}>
        <Droppable droppableId="categories">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {question.categories.map((category, index) => (
                <Draggable key={category.id} draggableId={category.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className='mb-4'>
                      {index !== (question.categories.length - 1) && <button
                        {...provided.dragHandleProps}>
                        <MdDragIndicator
                        /></button>}
                      <input
                        type="text"
                        placeholder="Add Category"
                        value={category.title}
                        onChange={(e) => handleCategoryChange(e, category.id)}
                        onFocus={(e) => createEmptyCategory(e, category.id)}
                        className="mr-2 px-2 py-1 border rounded max-w-[250px]"
                      />

                      {
                        index !== (question.categories.length - 1) && (<button onClick={() => removeCategoryInput(category.id)} className="text-red-500">
                          &#x2715;
                        </button>)
                      }

                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>



      <div className="flex mb-4 mt-5">
        <div className='me-5'>
          <div className='headings flex'>
            <h4 className="text-md font-semibold mb-2">Item</h4>
            <h4 className="text-md font-semibold ms-72">Belong To</h4>

          </div>

          <DragDropContext onDragEnd={onItemDragEnd}>
            <Droppable droppableId="items">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {
                    question.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided, snapshot) => (

                          <div ref={provided.innerRef} {...provided.draggableProps} className='mb-4 flex'>
                            {index !== (question.items.length - 1) && <button
                              {...provided.dragHandleProps}>
                              <MdDragIndicator
                              /></button>}
                            <div>

                              <input
                                type="text"
                                placeholder='Add item'
                                value={item.title}
                                onChange={(e) => handleItemTitleChange(e, item.id)}
                                onFocus={(e) => createEmptyItem(e, item.id)}
                                className=" px-2 py-1 border rounded max-w-[250px]"
                              />
                            </div>
                            <div className='ms-16 '>
                              <select
                                className=" px-2 py-1 border rounded max-w-[250px]"
                                onChange={(e) => handleItemCategoryChange(e, item.id)}
                                value={item.categoryId}
                              >
                                <option value="" disabled>
                                  Select Category
                                </option>
                                {question.categories.map((category) => (
                                  <option key={category.id} value={category.id.toString()}>
                                    {category.title}
                                  </option>
                                ))}
                              </select>

                              {
                                index !== (question.items.length - 1) && (<button onClick={(e) => removeItemInput(e, item.id)} className="text-red-500 ms-2">
                                  &#x2715;
                                </button>)
                              }
                            </div>
                          </div>
                        )}

                      </Draggable>
                    ))
                  }

                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

      </div>




    </div>
  );
};

export default CategoryForm;
