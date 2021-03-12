import { Flex, Input, Text, Spacer } from '@chakra-ui/react'
import { kMaxLength } from 'buffer'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'state'
import { updateTrackOffsetAction } from 'state/Offsets/actions'
import { TCtime } from 'utils/Midi/types'

interface TCOffsetFieldProps {
    
    id: string
   
}

export const TCOffsetField: React.FC<TCOffsetFieldProps> = ({ id}) => {
    
    const offsetTime = useSelector((state:RootState)=>{
        if(state.offsets[`${id}`]) return state.offsets[`${id}`]
        else return {h:0,m:0,s:0,f:0}
    })
    const dispatch = useDispatch();

    let {h,m,s,f} = offsetTime;

    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { maxLength, name, value, max } = e.currentTarget;
       
        const maxNum = parseInt(max)
        
        const valNum = parseInt(name)

        const [fieldName, fieldIndex] = name.split('-')
        const index= parseInt(fieldIndex);
        
        if(parseInt(value).toString().length >=  2 && value.length !== 0){
            if(index < 4){
                const nextSibling: HTMLInputElement | null = document.querySelector(
                    `input[id=offset${id}-${index + 1}]`
                )
               
                nextSibling?.focus()
                
            }
        }
        switch(index){
            case 0:
                
                h =(value.length === 0)? 0: parseInt(value)
                if(h<0) h=0;
                if(h>maxNum) h=maxNum;
                
               break; 
            case 1:
                m =(value.length === 0)? 0 : parseInt(value)
                if(m<0) m=0;
                if(m>maxNum) m=maxNum;

                break;
            case 2:
                s =(value.length === 0)? 0 : parseInt(value)
                if(s<0) s=0;
                if(s>maxNum) s=maxNum
                break;
            case 3:
                f =(value.length === 0)? 0 : parseInt(value);
                if(f<0) f=0;
                if(f>maxNum) f=maxNum;
                break;
      
        }
        dispatch(updateTrackOffsetAction(id,{h,m,s,f}))
        

    }

    
    
    return (
        <Flex direction='row' alignContent='center' align='center'>
            <Spacer/>
            <Input
                textAlign='center'
                size='sm'
                width='1.75rem'
                max={23}
                min={0}
                variant='unstyled'
                id={'offset' + id + '-0'}
                name='offset-0'
                // maxLength={2}
                type='number'
                onChange={handleChange}
                
                defaultValue={offsetTime.h.toString()}
                value={offsetTime.h.toString()}
            />

            :

            <Input
            size-='sm'
            textAlign='center'
            width='1.75rem'
            variant='unstyled'
                name='offset-1'
                // maxLength={2}
                max={59}
                id={'offset' + id + '-1'}
                type='number'
                onChange={handleChange}
                defaultValue={offsetTime.m.toString()}
                value={offsetTime.m.toString()}
                />

            :

            <Input
            align='center'
            textAlign='center'
            size-='sm'
            width='1.75rem'
            variant='unstyled'
                name='offset-2'
                id={'offset' + id + '-2'}
                max={59}
                // maxLength={2}
                type='number'
                onChange={handleChange}
                defaultValue={offsetTime.s.toString()}
                value={offsetTime.s.toString()}
                />

            :

            <Input 
            align='center'
            textAlign='center'
            size-='sm'
            width='1.75rem'
            variant='unstyled'
                name='offset-3'
                // maxLength={2}
                id={'offset' + id + '-3'}
                type='number'
                max={24}
                onChange={handleChange}
                defaultValue={offsetTime.f.toString()}
                value={offsetTime.f.toString()}
                />
            
        </Flex>
    )
}