import { Box, Button, Divider, Flex,  Heading, Text, Image} from '@chakra-ui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'state'
import { logoutUserAction } from 'state/User/action'
import defaultUser from 'img/defaultUser.png'


interface UserPanelProps {

}

export const UserPanel: React.FC<UserPanelProps> = ({}) => {

    const user = useSelector((state:RootState)=>state.user.userProfile)
    const dispatch = useDispatch()

    let photo = defaultUser;
    if(user?.images){
        if(user.images[0]) photo=user.images[0].url
    }
    

    return (
        <Box m='1rem'>
            <Flex direction='row'>
                <Image m='0.5rem' width='45px' height='45px' src={photo}  borderRadius='100%'/>
                <Heading textAlign='right' p='0.5rem' size='md'>{user?.display_name}</Heading>
            </Flex>
            <Divider width='85%'/>
            <Box  m='2' pl='50%'>
                <Button align='right'
                    onClick={()=>dispatch(logoutUserAction())}
                >Logout</Button>
            </Box>
        </Box>
    )
}