import { CircularProgress } from '@chakra-ui/progress'
import React from 'react'

interface LoadingProps {

}

export const Loading: React.FC<LoadingProps> = () => {
    return (<CircularProgress isIndeterminate/>)
}