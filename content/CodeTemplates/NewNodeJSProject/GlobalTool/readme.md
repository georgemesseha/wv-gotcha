![](https://raw.githubusercontent.com/wV-software/icons/main/Wv/Product%20Icon/wv_128x128.png) wv-local-service-bus
# Purpose
To accumulate your walkthroughs to accomplish your common tasks with less effort.

# How to:
## Add A Walkthrough
- @`/src/Walkghroughs/` create a file named as `WTR_{YourJobName}`
- Copy the following code to the file created <br/>
<code>
    import { IWalkthrough } from "./_Foundation/IWalkthrough";<br/>
    import { RegisterWalkthrough } from "./_Foundation/_Walkghrough";<br/>
    <br/>
    @RegisterWalkthrough()<br/>
    export class WTR\_<strong style="color: yellow">{YOUR_JOB_NAME}</strong> implements IWalkthrough<br/>
    {<br/>
    &emsp;text = <strong style="color: yellow">'Fun >> Wallpapers >> Grap Spotlight wallpapers'</strong>;<br/>
        <br/>
    &emsp;async execAsync()<br/>
    &emsp;{<br/>
    &emsp;&emsp;<strong style="color: yellow">console.warn('toooooooooooooooooot Wallpapers')</strong><br/>
    &emsp;}<br/>
    }<br/>
</code>
- import your module in <code>/src/Walkthroughs/index.ts</code>

## Publish
>Just run the script
<code>
    npm run push
</code>
