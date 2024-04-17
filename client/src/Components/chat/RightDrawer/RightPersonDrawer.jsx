import React from 'react'
import { useContext } from 'react'
import { AccountContext } from '../../../ContextApi/AccountProvide'
import './RightPersonDrawer.css'

import { Box, styled, Typography, Divider } from "@mui/material";

const ImageContainer = styled(Box)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  // borderBottom: 5px solid white;
`;

const Image = styled("img")({
    width: 200,
    height: 200,
    borderRadius: "50%",
    padding: "25px 0",
});

const BoxWrapper = styled(Box)`
  background: #eee0e0;
  padding: 12px 30px 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  & :first-child {
    font-size: 15px;
    color: #009688;
    font-weight: 200;
  }
  & :last-child {
    margin: 14px 0;
    color: #4a4a4a;
  }
`;

const DescriptionContainer = styled(Box)`
  padding: 15px 20px 28px 30px;
  & > p {
    // color: #8696a0;
    color: ##D3D3D3;
    font-size: 13px;
  }
`;

function RightPersonDrawer() {

    const {person} = useContext(AccountContext)

    const profilePicture = person?.picture || person?.profilePhoto;
    
  return (
    <div className='right-person-drawer-div'>
            {/* <h2>Person Information:</h2>
            <ul>
                {Object.entries(person).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul> */}
            <ImageContainer>
                <Image src={profilePicture} alt="displaypicture" />
                <h2>{person.name}</h2>
            </ImageContainer>

            <h3 className='heading-email'>Email: </h3>
            <p>{person.email}</p>
            <DescriptionContainer>
                <Typography>
                    This is not username or pin. This name will be visible to
                    WhatsApp contacts.
                </Typography>
            </DescriptionContainer>
            <BoxWrapper>
                <Typography>About</Typography>
                <Typography>Noting</Typography>
            </BoxWrapper>
    </div>
  )
}

export default RightPersonDrawer