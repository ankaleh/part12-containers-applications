import styled from 'styled-components'

export const Input = styled.input.attrs(props => ({
  width: props.width,
  height: props.height,
  border: props.border
}))`
    @media (max-width: 700px) {
      width: 200px;
    }
    background: white;
    font: 1em Helvetica, sans-serif;
    padding: 10px;
    border: ${props => props.border};
    width: ${props => props.width};
    height: ${props => props.height};
    border-radius: 5px;
    margin-top: 10px;
`
//border: 2px solid #bc5a45;

export const Text = styled.textarea.attrs(props => ({
  border: props.border,
  width: props.width,
  height: props.height
}))`
    @media (max-width: 700px) {
      width: 200px;
    }
    background: white;
    font: 1em Helvetica, sans-serif;
    padding: 30px;
    border: ${props => props.border};
    border-radius: 5px;
    width: ${props => props.width};
    height: ${props => props.height};
    margin-top: 10px;
`