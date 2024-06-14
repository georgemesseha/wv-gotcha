* `wv-gotcha/content/GenericGenTemplates` folder is designed to be a content part of the `wv-gotcha`. So each addition or change in it requires releasing a new version of `wv-gotcha`.
* This special folder should contain only folders. Each of them typically resembles a `root template` of a specific big artifact like a solution in .net or a workspace in NodeJS for instance.
* Each `root template` defines its own `translationMap.json` as a direct child json file of its folder. 
```json
{
    "mappings": [
        {
            "title": ".net >> Web RESTful API >> Clean Architecture >> Generate Full Solution",
            "translationItems": [
                {
                    "itemType": "folder",
                    "relativePath": ""
                }
            ],
            "fileRelPathPatternsToIgnore": []
        },
        {
            "title": ".net >> Web RESTful API >> Clean Architecture >> Add Service",
            "translationItems": [
                {
                    "itemType": "file",
                    "relativePath": "___Service___/___Service___.cs"
                }
            ]
        }
    ]
}
```
* A special mapping that has a single `translationItem` whose `relativePath` property set as an empty string, resmebles an instruction that translates all the files in the `root template` to the destination folder with the same content recursively.
```
{
    "itemType": "folder",
    "relativePath": ""
}
```
* In case a sub item needs to be translated like a single file, or (a sub-folder with its entire content), then you need to add a translation item with its path set to this file/folder relative path.
```json
{
    "itemType": "file",
    "relativePath": "___Service___/___Service___.cs"
}
```
```json
{
    "itemType": "file",
    "relativePath": "___Service___"
}
```
* When a `tranlationItem` is translated, it's created in a destination location similar to its counterpart location in the source one with each occurence of a placeholder replaced with the interactively provided value when encountered for the first time in the translation process.
* Placeholders could be in the file/folder names and in file contents.
* a `Placeholder` is a word contained either in the relative path or in a file content that starts and ends with tripple underscore `___` and in between only a valid variable name is expected. i.e. it must match this regex `___[0-9A-z\$_]+___` (e.g.`___MyClassName___`).
* `wv-gotcha` detects and prompts the user to provide a value of a `placeholder` each when encountered dynamically.
* For each `mapping` you can ignore relative file paths that match the regex patterns you include in its property `fileRelPathPatternsToIgnore`
```json
{
    "title": ".net >> Web RESTful API >> Clean Architecture >> Generate Full Solution",
    "translationItems": [
        {
            "itemType": "folder",
            "relativePath": ""
        }
    ],
    "fileRelPathPatternsToIgnore": []
}
```
On purpose merge conflict line