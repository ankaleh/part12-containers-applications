import React from 'react';

const SingleTodo = (props) => {
    
    //console.log(props.todo)
    
    return (
        <div >
            <h1 style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: '40px' }}>
                {props.todo.text}
            </h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: '40px' }}>{props.todo.done 
                ?  <>
                    <span>This todo is done</span>
                    <span>
                        <button onClick={(e) => props.deleteTodo(e, props.todo)}> Delete </button>
                    </span>
                </>
                : <>
                <span>
                  This todo is not done
                </span>
                <span>
                  <button onClick={(e) => props.deleteTodo(e, props.todo)}> Delete </button>
                  <button onClick={(e) => props.completeTodo(e, props.todo)}> Set as done </button>
                </span>
              </>}
            </div>
        </div>
    );
};

export default SingleTodo;