import styled from 'styled-components'

export const Margin = styled.div`
    background: #8d9db6;
    height: 80px;
    border-bottom: 2px solid white;

    display: flex;
    justify-content: center;
`//#bc5a45
//#F0F8FF
//alkup. #8d9db6

export const NotificationMessage = styled.div`
    font: 15px Verdana, sans-serif;
    background: #F7F7F7;

    height: 70px;
    padding: 5px;

    border-bottom: 2px solid white;
    
    display: flex;
    justify-content: center;
    align-items: center;
`
//#8d9db6
export const Navigation = styled.div`
    background: #b7d7e8;
    padding: 10px;
    border-bottom: 2px solid white;
    
    height: 50px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
`
export const AccountInfo = styled.div`
    @media (max-width: 700px) {
        flex-direction: column;
    }
    background: #8d9db6;
    padding: 10px;
    border-bottom: 2px solid white;
    
    height: 50px;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
`
export const Page = styled.div.attrs(props => ({
  flexDirection: props.flexDirection,
  justifyContent: props.justifyContent,
  alignItems: props.alignItmes
}))`
    @media (max-width: 700px) {
        flex-direction: column;
    }

    background: #F7F7F7;
    
    padding: 50px;
    border-bottom: 2px solid white;

    display: flex;
    flex-direction:  ${props => props.flexDirection};
    justify-content: ${props => props.justifyContent};
    align-items: ${props => props.alignItems};
`

export const BackgroundImage = styled.div.attrs(props => ({
  height: props.height,
  backgroundImage: props.backgroundImage,
}))`

    background-image: url(${props => props.backgroundImage});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    position: relative;

    height: ${props => props.height};
    width: 100%;
    border-bottom: 2px solid white;
`

export const StyledPost = styled.div`
    @media (max-width: 700px) {
        max-width: 200px;
    }  
    border: 2px solid lightgrey;
    background: white;
    
    max-width: 300px;
    height: 100px;
    border-radius: 5px;
    padding: 30px;

    margin: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    white-space: nowrap;    
    text-overflow: ellipsis;
    overflow: hidden;

`
//#618685 vihreä
export const StyledTask = styled.div`
    @media (max-width: 700px) {
        max-width: 200px;
    }  
    border: 2px solid  lightgrey;
    background: white;
    width: 300px;
    height: 300px;
    border-radius: 5px;
    margin: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    white-space: nowrap;    
    text-overflow: ellipsis;
    overflow: hidden;

`
export const StyledTextContainer = styled.div`
    padding: 40px;
    margin: 10px;
    border: 2px solid  #618685;
    background: white;
    border-radius: 15px;
`


export const Info = styled.div`
    padding: 20px;
    border: 2px solid #618685;
    background: white;
    width: 300px;
    height: 100px;
    border-radius: 5px;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    
`

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    
`
export const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`

export const Borderline = styled.div`
    background: #bc5a45;
    min-width: 30px;
    margin: 20px;
`
export const GuestsContainer = styled.div`
    @media (max-width: 768px) {
        width: 200px;
    }
    
    border: 2px solid lightgrey;
    background: white;
    width: 500px;
    border-radius: 5px;
    padding: 30px;

    margin: 10px;

    display: flex;
    
    flex-direction: column;
    

`

