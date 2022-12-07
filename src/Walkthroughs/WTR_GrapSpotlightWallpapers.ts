import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_Walkghrough";

@RegisterWalkthrough()
export class WTR_GrapSpotlightWallpapers implements IWalkthrough
{
    text = `Fun >> Wallpapers >> Grap Spotlight wallpapers`;
    
    async execAsync()
    {
        console.warn('toooooooooooooooooot Wallpapers')
    }
}