import { Text, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'state'
import { clearErrors } from 'state/Error/action'

interface ErrorMessagesProps {

}

export const ErrorMessages: React.FC<ErrorMessagesProps> = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()

    const onClose = ()=>{
        setIsOpen(false)
        dispatch(clearErrors())
    }
    const cancelRef = useRef(null)
    
    const errors = useSelector((state: RootState)=>state.errors.errors)
    let msgs = errors[0]?.msg
    if(errors.length > 0 && !isOpen){
      console.log("opening")
      
      console.log('error message: ', msgs)
      setIsOpen(true)
    }
    
    
    return (
    
        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error 
            </AlertDialogHeader>

            <AlertDialogBody>
                <Text>{msgs}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    

    )
}