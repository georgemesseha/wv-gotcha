export * from 'temp-circuits'
import { Motherboard } from ".";
import { Mcq_Walkthroughs } from "./Mcq_Walkthroughs";
import { UApp } from "./UApp";
import { WTR_Test } from "./Walkthroughs/WTR_Test";
import './Walkthroughs';
import { UTextTranslator } from "./Libraries/TemplateTranslation/UTextTranslator";
import { UPathMan } from "./UPathMan";
import { UTemplateTranslator } from "./Libraries/TemplateTranslation/UTemplateTranslator";

Motherboard
.register(UApp, UApp)
.register(UTextTranslator, UTextTranslator)
.register(UPathMan, UPathMan)
.register(UTemplateTranslator, UTemplateTranslator)
.powerOn('');
