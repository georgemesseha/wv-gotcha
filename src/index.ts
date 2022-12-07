
import { Motherboard } from "./Circuits";
import { Mcq_Walkthroughs } from "./Mcq_Walkthroughs";
import { UApp } from "./UApp";
import { WTR_GrapSpotlightWallpapers } from "./Walkthroughs/WTR_GrapSpotlightWallpapers";
import './Walkthroughs';

Motherboard
.register(UApp, UApp)
.powerOn('');
