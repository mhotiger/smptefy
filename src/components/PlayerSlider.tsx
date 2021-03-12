import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, useControllableProp, useControllableState } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, exhaustMap, filter, finalize, map, mergeMap, retry, startWith, switchMap, takeUntil, takeWhile, tap, } from 'rxjs/operators'
import { RootState } from 'state'
import { spotifySeekAction } from 'state/SpotifyWebPlayback/actions'
import { msElapsed } from 'utils/animation'

interface PlayerSliderProps {

}

export const PlayerSlider: React.FC<PlayerSliderProps> = ({}) => {
    
    const playbackPos$ = useSelector((state:RootState)=>state.spotify.playbackPos$)
    const playbackState = useSelector((state: RootState)=>state.spotify.playbackState)
    const paused$ = useSelector((state: RootState)=>state.spotify.paused$)
    const dispatch = useDispatch()

   
    const [value, setValue] = useState<number>()
    
    const isUserControlled$ = useMemo(()=>new BehaviorSubject<boolean>(false),[])
    const changed$ = useMemo(()=>new Subject<number>(),[])

    
    useEffect(()=>{

        
        
        const seekSub = isUserControlled$.pipe(
            filter((val)=>val===true),
            switchMap(()=>{
                return changed$.pipe(
                    debounceTime(150)
                )
            })
        ).subscribe((val)=>{
            playbackPos$.next(val)
            dispatch(spotifySeekAction(val))
        })
        
        
        const sliderSub  = combineLatest([isUserControlled$, paused$]).pipe(
            // tap((val)=>{console.log('controlled pipe: ', val)}),
            switchMap((val)=>{
                //if the user starts controlling, pass the values from slider change events
                const[userControlled, paused] = val;
                if(userControlled===true) return changed$

                //console.log('paused: ',playbackState!.paused)
                //if not, start an animation frame ticker that starts at the last emitted
                //value from playback pos
                //TODO: regulate the emissions from playback pos
                //TODO: only emit if playing
                if(paused)return playbackPos$
                return playbackPos$.pipe(
                    
                    switchMap((pos)=>{
                        //return(of(pos))
                        return msElapsed().pipe(
                            map((val)=>val+pos),
                            takeWhile((val)=>(val>=25))
                        )
                    }),
                    
                )
            })
        ).subscribe((val)=>{
            //console.log('tot sub: ', val)
            setValue(val)
        },
            (err)=>{console.error(err)},
          
        )

       return(()=>{
           seekSub.unsubscribe()
           sliderSub.unsubscribe()
       })

    },[playbackPos$, isUserControlled$, changed$, paused$])
    

    

    return (
        <Slider 
            m='2rem'
            defaultValue={ value}
            focusThumbOnChange={false}
            value={value}
            min={0}
            max={playbackState?.duration}
            onChange={(val)=>{
                //console.log('change', val)
                changed$.next(val)
            }}
            onChangeStart={(val)=>{
                isUserControlled$.next(true)
            }}
            onChangeEnd={(val)=>{
                // console.log('changeEnd: ', val )
            }}
            onMouseDown={()=>{
                // isUserControlled$.next(true);
            }} 
            onMouseUp={()=>{
               
                isUserControlled$.next(false);
            }}
            
            
            
            >
            <SliderTrack>
                <SliderFilledTrack/>
            </SliderTrack>
            <SliderThumb/>

        </Slider>
    )
}