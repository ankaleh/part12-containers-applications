import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const HeadingSecondary = styled.h1`
    @media (max-width: 700px) {
        font: bold 15px Helvetica, Sans-Serif;
    }   
    font: 30px Helvetica, Sans-Serif;
`
export const HeadingPrimary = styled.span`
    @media (max-width: 700px) {
        font: bold 15px Helvetica, Sans-Serif;
    }   
    color: #FFFFFF; 
    font:  50px Helvetica, Sans-Serif; 
    padding: 20px;
`
export const TextPrimary = styled.span`
    font: 20px Helvetica, Sans-Serif;
    line-height: 1.6;
`
export const TextSecondary = styled.span`
    font: 15px Helvetica, Sans-Serif;
    color: black;
    padding: 10px;
`
export const WhiteText = styled.span`
    @media (max-width: 700px) {
        font: bold 15px Helvetica, Sans-Serif;
    }  
    font: 20px Helvetica, Sans-Serif;
    color: #FFFFFF;
    font-weight: bold;
    padding-right: 25px;
    padding-left: 25px;
`
export const BlackText = styled.span`
    font: 15px Helvetica, Sans-Serif;
    color: black;
    font-weight: bold;
    padding-right: 10px;
    line-height: 1.6;
`
export const LinkText = styled(Link)`
    @media (max-width: 700px) {
        font: bold 15px Helvetica, Sans-Serif;
    }        
    font: 20px Helvetica, Sans-Serif;
    color: #FFFFFF;
    font-weight: bold;
    padding-right: 25px;
    padding-left: 25px;
`
export const LinkTextColored = styled(Link)`
    font: 15px Helvetica, Sans-Serif;
    color: black;
    font-weight: bold;
    
`
export const InfoText = styled.span`
    font: 20px Helvetica, Sans-Serif;
    color: #618685;
    font-weight: bold;
`
export const ErrorText = styled.span`
    font: 15px Helvetica, Sans-Serif;
    color: #bc5a45;
    font-weight: bold;
`

export const HeaderInImage = styled.span.attrs(props => ({
  bottom: props.bottom,
}))`
    @media (max-width: 700px) {
        font: bold 30px Helvetica, Sans-Serif;
    }
    color: #FFFFFF; 
    font: bold 60px Helvetica, Sans-Serif; 
    letter-spacing: 2px;  
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    margin: 0px;

    position: absolute;
    bottom: ${props => props.bottom};
`
export const LiInImage = styled.li.attrs(props => ({
  bottom: props.bottom,
}))`
    @media (max-width: 700px) {
        font: bold 15px Helvetica, Sans-Serif;
    }    

    color: #FFFFFF; 
    font: bold 30px Helvetica, Sans-Serif; 
    letter-spacing: 2px;  
    background: rgba(0, 0, 0, 0.5);

    padding-right: 200px;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin: 0px;

    position: absolute;
    bottom: ${props => props.bottom};
    left: 60%;
    right: 0%;
`







