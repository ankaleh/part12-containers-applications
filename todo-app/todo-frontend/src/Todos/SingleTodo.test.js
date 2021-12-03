import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import SingleTodo from "./SingleTodo";

const todo = {
    text: "Learn about Kubernetes",
    done: false
}
const todo2 = {
    text: "Learn about testing!",
    done: true
}
test("renders content", () => {
    const component = render(
        <SingleTodo todo={todo} />
    )
    const component2 = render(
        <SingleTodo todo={todo2} />
    )
    //component.debug()
    expect(component.container).toHaveTextContent(
        "Learn about Kubernetes"
    )
    expect(component.container).toHaveTextContent(
        "This todo is not done"
    )
    expect(component2.container).toHaveTextContent(
        "Learn about testing!"
    )
    expect(component2.container).toHaveTextContent(
        "This todo is done"
    )
})

test("clicking the complete todo button calls event handler once", () => {
    const mockHandler = jest.fn()
    const component = render(
        <SingleTodo todo={todo} completeTodo={mockHandler}/>
    )
    const button = component.getByText("Set as done")
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
})

test("clicking the delete button calls event handler once", () => {
    const mockHandler = jest.fn()
    const component = render(
        <SingleTodo todo={todo} deleteTodo={mockHandler}/>
    )
    const button = component.getByText("Delete")
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
})

