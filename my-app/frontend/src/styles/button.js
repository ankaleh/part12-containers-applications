import styled from 'styled-components'

export const Button = styled.button.attrs(props => ({
  width: props.width,
  height: props.height,
  background: props.background
}))`
    @media (max-width: 700px) {
      max-width: 120px;
    }

    background: ${props => props.background};
    font: 1em Verdana, sans-serif;
    color: white;
    padding: 10px;
    border: 2px solid white;
    border-radius: 5px;
    margin-top: 5px;
    margin-right: 5px;
    width: ${props => props.width};
    height: ${props => props.height};

    
`
//background: #bc5a45;