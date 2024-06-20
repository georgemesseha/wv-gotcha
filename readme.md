![](https://raw.githubusercontent.com/wV-software/icons/main/Wv/Product%20Icon/wv_128x128.png) wv-local-service-bus
# Purpose
To accumulate your walkthroughs to accomplish your common tasks with less effort.

# How to:
## Add A Walkthrough
- @`/src/Walkghroughs/` create a file named as `WTR_{YourJobName}`
- Copy the following code to the file created 
```typescript
    import { IWalkthrough } from "./_Foundation/IWalkthrough";
    import { RegisterWalkthrough } from "./_Foundation/_Walkghrough";
    @RegisterWalkthrough()
    export class WTR_{YOUR_JOB_NAME} implements IWalkthrough
    {
        text = 'Fun >> Wallpapers >> Grap Spotlight wallpapers';
        async execAsync()
        {
            console.warn('toooooooooooooooooot Wallpapers')
        }
    }
```
- import your module in <code>/src/Walkthroughs/index.ts</code>

## Publish
>Just run the script
<code>
    npm run push
</code>
