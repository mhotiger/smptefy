import { animationFrameScheduler, defer, interval, Observable } from "rxjs"
import { map } from "rxjs/operators"


export const msElapsed = (scheduler = animationFrameScheduler)=>{
    return  defer(()=>{
        const start = scheduler.now()

        return interval(0,scheduler).pipe(
            map(()=> scheduler.now()-start)
        )
    })
}