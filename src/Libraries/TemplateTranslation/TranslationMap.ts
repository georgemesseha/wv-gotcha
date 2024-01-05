

/**
 * Contains the relative path of an item, which is either a file or a folder along with the 
 * property 'type' to indicate whether it's a file or a folder.
 */
export class TranslationItem
{
    itemType!: "file"|"folder";
    relativePath!: string;
}

/**
 * Contains a title to be selected by the user mapped to specific TranslationItems.
.* Each item could be a single file or a folder. 
 */
export class TranslationMapping
{
    title!: string;
    templateDirName!: string;
    translationItems!: TranslationItem[];
    fileRelPathPatternsToIgnore?: [];
}

export class TranslationMap
{
    mappings!: TranslationMapping[]
}