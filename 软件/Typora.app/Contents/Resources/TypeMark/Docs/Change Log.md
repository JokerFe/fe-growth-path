## 0.9.9.36.2 (beta)

13, Dec

1. Fix bugs about inline math and other regression bugs.

## 0.9.9.36 (beta)

11, Dec

1. Native support on macOS Big Sur and Apple Silicon (M1).
2. Add vlang and forth code syntax highlight.
3. Add “Get Info” in main menu and context menu for file.
4. Improve markdown parse logic.
5. Improve UI and built-in themes.
6. Improve compatibility with IMEs.
7. Fix open link with escaped urls.
8. Fix XSS security issues.
9. Fix some mermaid dialog bugs.
10. Other bug fix.

## 0.9.9.35.2 (beta)

12, Sep

1. Support code syntax Q.
2. Fix issues with PDF export on 3rd themes.
3. Support CSS media query for color scheme.
4. Other small fix.

## 0.9.9.35 (beta)

27, Aug

1. Support separate theme for light mode and dark mode.
2. Support newer version of Pandoc.
3. Support copy image content in editor.
4. Add Arabic language interface by [ahmedelq](https://github.com/ahmedelq).
5. Add options for preferred smart dash in preferences panel.
6. Improve find and replace behavior.
7. Only seamless window style are now supported in macOS Big Sur.
8. Fix issues in Open Quickly.
9. Fix triple click in typewriter mode.
10. Improve print.
11. Other bug fix.

## 0.9.9.34.2 (beta)

18, Jul

1. Fix some issues with IME.
2. Fix user language not applied in preferences panel.

## 0.9.9.34.1 (beta)

12, Jul

1. Fix unnecessary when editing large math blocks.

## 0.9.9.34 (beta)

11, Jul

1. Add `ABAP` code syntax highlight.
2. Support `id` attribute as link anchors.
3. Upgrade mermaidjs version, support link styles, entity relationship diagrams, etc.
4. Add Turkish language support.
5. Small improvement on built-in themes.
6. Add custom shortcut entry in preferences panel.
7. Fix issues about copy / paste image.
8. Other fix bugs and improvements.

## 0.9.9.33.1 (beta)

23, May

1. Improve table parsing rules.
2. Show error message for invalid mermaid diagrams.
3. Improve PDF export quality.
4. Improve typewriter mode.
5. Support file encode: UTF-8 with BOM.
6. No indent for image block when "Indent first line of paragraphs" is enabled.
7. Add `${filename}` and `${filepath}` variable support in custom image upload command.
8. Improve sort in sidebar.
9. Fix math rendering bug that scripts after comments in new lines are not rendered.
10. Fix cursor position not restored when switch between source code mode and hybrid editing mode.
11. Fix ctrl + tab on macOS.
12. Fix command + click on filename on titlebar to quickly open parent folders.
13. Fix Delete key and shift + arrow key issues on large files.
14. Other improvements and bug fix.

## 0.9.9.32.1 (beta)

27, Feb

1. Fix some regression bugs.

## 0.9.9.32 (beta)

26, Feb

[Detail](https://support.typora.io/What's-New-0.9.84/)

1. Support upload images via uPic, PicGo and custom commands.
2. Update i18n translations for some language.
3. Fix a bug that Typora will hang sometimes when click image or article margins.
4. Improve find and replace function.
5. Other small fix.

## 0.9.9.31.7 (beta)

13, Feb

1. Fix crash when open folder.
2. Other small fix.

## 0.9.9.31.6 (beta)

30, Jan

1. Fix bug that some file contains special char cannot be opened.
2. Fix link in PDF export.
3. Fix save hangs on source code mode.
4. Remove spell check for html entity, link or footnote definitions.
5. Fix bug that `<br>` cannot be hidden based on status of menu bar and preferences panel.
6. Fix a few bug about cursors.
7. Other small fix.

## 0.9.9.31.4 (beta)

11, Jan

1. Improve mermaid pie style.
2. Fix bug that sometimes Typora cannot be opened.
3. Fix bug that sometimes image cannot be displayed after switch files.
4. Fix bug that sometimes input are get blurred. 
5. Fix a sucurity bug report by @0xBADCA7
6. Other small fixes.

## 0.9.9.31.3 (beta)

02, Jan

1. Fix results for global search cannot be opened.
2. Improve stability for file import.

## 0.9.9.31 (beta)

25, Dec

1. Support Korean and Japanese in global search.
2. Enhance context menu on sidebar.
3. Hot fix loops and rendering error of mermaid diagram.
4. Add APL and GLSL code syntax highlight, add SystemVerilog as alias of verilog language.
5. Fix user defined internal links on exported PDF. 
6. Able to parse Azure style `[[_TOC_]]` as Table of Content.
7. Able to detect potential data lost in earlier stage. 
8. Improve paste web contents.
9. Fix sometime reopen will not open previous opened files.
10. Fix some issue with French smart quote.
11. Add Swiss German language (by Indeximal).
12. Other bug fix and improvements.

## 0.9.9.30.1 (beta)

1, Dec

1. Fix regression bugs on 0.9.9.30.

## 0.9.9.30 (beta)

[Detail](https://support.typora.io/What's-New-0.9.80/)

30, Nov

1. Add Danish (by archfrog) and Ukrainian (by oleksavyshnivsky) translations.
2. Improve copy paste from website.
3. Improve find and replace function.
4. Upgrade mermaid to 8.4.0, fix XSS issue, supporting state diagram, pie chart diagrams and other improvements.
5. Improve natural sort algorithm on file sidebar.
6. Fix bugs about navigation keys.
7. Fix anchor and internal links for exported HTML and PDF.
8. Bug fix on lists.
9. Fix theme css not loaded sometimes.
10. Fix crash when export PDF when using system IME.
11. Other bug fix and small improvements.

## 0.9.9.29.2 (beta)

12, Oct

1. Fix compatibility issue on macOS 10.15.
2. Fix word count button under 10.15.
3. Fix drop link / images into Typora.
4. Re-group menu items under `Edit` menu.
5. Other small fix.

## 0.9.9.29.1 (beta)

11, Oct

1. Fix compatibility issue on macOS 10.15.
2. Support context menu on search result on files panel.
3. Add perl6 syntax highlight.
4. Fix bug about internal link and TOC on export.
5. Fix parse of horizontal line.
6. Improve spellcheck behavior.
7. Improve copy and paste feature.
8. Support copy as plain text explicitly. 
9. Add config for math for copy / export.
10. Fix code indent not saved.
11. Fix load image / video / link from URL.
12. Improve stability and fix other bugs.

## 0.9.9.28.5 (beta)

5, Sep

1. Fix a critical bug that editing in code fences may cause save failure.

## 0.9.9.28.4 (beta)

2, Sep

1. Support set image zoom factor from menu or context menu.
2. Fix bugs about undo / redo.
3. Fix bugs about math auto numbering.
4. Fix XSS when export.
5. Small UX and Stability improvement.

## 0.9.9.28 (beta)

18, Aug

1. Add Slovak language thanks to Petr Mátl.
2. Add syntax highlight for turtle.
3. Add move table row / column related operations in main menu.
4. Improve compatibility with GFM for auto generated anchor names.
5. Fix bugs about export and print.
6. Fix bugs around command + arrow key.
7. Fix file movement inside Typora.
8. Fix crash when open non-exists recent folders.
9. Fix cannot download image from http protocol.

## 0.9.9.27.4 (beta)

11, Aug

1. Fix cut not working.

## 0.9.9.27.3 (beta)

08, Aug

1. Fix Typora cannot display images from external disk.

## 0.9.9.27.2 (beta)

05, Aug

1. Fix crash when using file list sidebar.
2. Fix cannot save empty file.
3. Fix copy and paste inside Typora.

## 0.9.9.27.1 (beta)

04, Aug

1. Fix find & replace will cause app crash.
2. Fix Emoji auto auto-complete.
3. remove unnecessary `<span>` for export HTML without style.

## 0.9.9.27 (beta)

03, Aug

[Detail](https://support.typora.io/What's-New-0.9.73/)

This version requires macOS ≥ 10.13, use 0.9.9.26 for older macOS. [Detail](https://support.typora.io/Older-macOS-Support/)

1.  Redesign of preference panels.
2.  Add table operations in menu bar, move "image" related operation to "Format" menu.
3.  Support zoom, and magnification on macOS.
4.  Add smalltalk language syntax.
5.  Fix scrollbar color / background under dark mode.
6.  Improve mermaid gantt rendering.
7.  Support auto escape image path when export.
8.  Fix bug about image export.
9.  Fix bug that sidebar folder will not be kept after move to trash.
10.  Fix bugs about export HTML without styles.
11.  Fix bug that global search cannot contain special keys like "#".

## 0.9.9.26 (beta)

03, Aug

Almost same as 0.9.9.27, but running on macOS 10.11 and 10.12

## 0.9.9.25.3 (beta)

26, Jun

1. Fix a critical bug that app may quit before proper logics are proceeded.

## 0.9.9.25.2 (beta)

21, Jun

1. Fix bugs about typewriter mode and internal links

## 0.9.9.25 (beta)

20, Jun

1. Improve URL parse logic.
2. Add Gherkin language syntax highlight.
3. Support Catalan language.
4. Support “Descending” order when sorting in file panel.
5. UI Improvement on Night theme.
6. Improve search and quick open on unicode characters.
7. Improve logics about file save and multi-window management.
8. Unify default rules for line break options.
9. Fix some bugs on file side panel.
10. Fix some bugs on PDF export. Zoom oversize mermaid diagrams, math blocks and tables on exported PDF.
11. Fix bug that inline math not get updated sometimes.
12. Fix quote and brackets when using Chinese IME.
13. Fix bug that `$` get omitted on headings.
14. Fix some bugs about cursor jump on click or on Shift + Enter.
15. Fix bugs about `&` cannot be escaped in some cases.
16. Other bug fix.

## 0.9.9.24.6 (beta)

27, Apr

1. Fix remote image cannot be loaded from certain hosts.

## 0.9.9.24.2 (beta)

20, Apr

1. Fix wrong cursor position calculation logic on lines contain emoji.
2. Fix unable to input quote in some conditions.

## 0.9.9.24 (beta)

19, Apr

1. Fix security bug on export and editing.
2. Add ASN.1 syntax highlight support.
3. Improve compatibility with Chinese IME and TextExpander.
4. Improve copy & paste logic.
5. Improve search function, now search will not ignore whitespace.
6. Add error message for flowchart when rendering failed.
7. Fix image operations, support `align` attribute for `img` tag.
8. Fix emoji auto complete.
9. Fix bug that math not rendered on open sometimes, fix cursor issues relates to inline math.
10. Other bug fix.

## 0.9.9.23.4 (beta)

20, Mar

1. Fix security issues.
2. Fix regression bug on side bar, edit, images, links related functions.
3. Add syntax highlight for SPARQL and Crystal.

## 0.9.9.23.2 (beta)

16, Mar

1. Fix regression bugs.

## 0.9.9.23 (beta)

15, Mar

[Detail](https://support.typora.io/What's-New-0.9.66/)

1. Fix security issues.
2. Fix unnecessary escape in outline.
3. Fix click outline will cause content jumping.
4. Fix auto pair issue.
5. Add language Vietnamese by [1234hdpa](https://github.com/1234hdpa).
6. Remove options for emoji autocomplete, it is now enabled by default.
7. Update flowchart library and fix issues related to flowchart.
8. Add options to configure reading speed.
9. Add `oz` ad supported language for syntax highlight.
10. Other bug fix.

## 0.9.9.22 (beta)

18, Feb, 2019

1. Improve compatibility with IMEs and text shortcut.
2. Add Indonesia language support by [snatalius](https://github.com/snatalius).
3. Allow drag & drop to insert file links quickly.
4. Fix XSS for inline math, add security check for area tag.
5. Fix math block rendering issue.
6. Fix footnotes numbering on export.
7. Improve search performance.
8. Improve compatibility for exported PDF.
9. Other bug fix.

## 0.9.9.21.1 (beta)

26, Jan, 2019

1. Fix style issue on order version of macOS.
2. Fix an XSS issue.

## 0.9.9.21 (beta)

25, Jan, 2019

[Detail](https://support.typora.io/What's-New-0.9.63/)

1. Fix crash under macOS 10.10
2. Improve open quickly.
3. Support "Copy without Theme Styling".
4. Show full path on file tree when hover on items.
5. Improved Japanese and Hrvatski translation.
6. Fix bugs on parsing Markdown content.
7. Update to mhchem 3.3 for Chemistry support.
8. Fix bugs cursor jump when input block quotes or task lists.
9. Other bug fix.

## 0.9.9.20.3 (beta)

13, Jan, 2019

1. Fix blocking issue on PDF export.

## 0.9.9.20.2 (beta)

12, Jan, 2019

1. Fix bugs on input math block.

## 0.9.9.20.1 (beta)

10, Jan, 2019

1. Fix bugs on math input and rendering.
2. Other regression bug fix.

## 0.9.9.20 (beta)

08, Jan, 2019

[Detail](https://support.typora.io/What's-New-0.9.61/)

1. Support global search in opened folder.
2. Support filter in outline panel.
3. Support select default unit for word count (character count, line counts, etc).
4. Support move file by drag & drop in file tree panel, support duplicate file in file panel.
5. Add Portuguese (Portugal) support by [camilo93](https://github.com/jcamilo93), add Galician support by [nunhes](https://github.com/nunhes).
6. Add COLOL as supported code highlight language.
7. Update MathJax Rendering engine to 2.7.5
8. Fix word count bug when document contains list. 
9. Show word count in fullscreen mode if “Always show word count” it enabled.
10. Add warnings for file move/delete, add options to reset all warning dialogs.
11. Fix an SSX issue when rendering `<img>`.
12. Fix bugs about math block in exported PDF/docx
13. Other bug fix.

## 0.9.9.19.4 (beta)

11, Nov, 2018

1. Fix mirror bug on live converting lists.

## 0.9.9.19.3 (beta)

10, Nov, 2018

1. Fix UI issues on Dark Mode under 10.14
2. Fix bug that paste image from clipboard won't trigger auto move or upload.
3. Fix issues with Japanese Romaji IME.
4. Fix export to docx or other format would crash when Pandoc is not installed.
5. Fix bug that Typora will incorrectly register bundles as supported document format.

## 0.9.9.19.1 (beta)

27, Oct, 2018

1. Fix bug relates to inline math.
2. Fix bug that some file cannot be parsed.
3. Fix issues with countly sdk.

## 0.9.9.19 (beta)

23, Oct, 2018

[Detail](https://support.typora.io/What's-New-0.9.59/)

1. Support macOS Mojave. Support dark mode.
2. Allow unlearn words for spell check.
3. Fix bug that exported PDF cannot be opened by Adobe Acrobat/Reader, fix “preserve line break” get ignored when export/print.
4. Save sidebar width after user resize it.
5. Improve auto pair behavior for smart quote and Markdown charecters.
6. Improve behaviors for “indent first line”.
7. Fix bug that image storage folder not updated after open new file.
8. Fix bug about cursor and update issues relates to math.
9. Improve typing response and improve scroll performance.
10. Fix Typora get frozen when paste images from remote website.
11. Add warning when user enter type writer mode or focus mode in their first time.
12. Add sort function for file tree in sidebar.
13. Other bug fix.

## 0.9.9.18.1 (beta)

15, Sep, 2018

1. Fix usability issue on OS X 10.11.
2. Fix crash when using TouchBar.
3. Some bug fix.

## 0.9.9.18 (beta)

12, Sep, 2018

[Detail](https://support.typora.io/What's-New-0.9.58/) *(This version requires macOS ≥ 10.10)*

1. Add options for custom image storage folder.
2. Fix a critical bug triggered when pasting contents into tables.
3. Fix bugs relates to loading remote images.
4. Fix bugs that `<source>` tag inside `<video>` does not work.
5. Fix a security issue when loading local iframes. (Special Thanks to Zhiyang Zeng(@Wester) from Tencent Blade Team).
6. Fix bugs about pasting into lists.
7. Fix inline math sometimes not get updated on live rendering.
8. Other bug fix.

## 0.9.9.17.5 (beta)

29, Aug, 2018

1. Fix parse error for lists and links.
2. Fix somethings window titlebar color are not correctly picked based on theme background.
3. Fix outline not updated after switch documents.
4. Fix "Open Links" in context menu not work.
5. Improve paste behavior.
6. Other bug fix.

## 0.9.9.17.4 (beta)

22, Aug, 2018

1. Fix regression bugs on 0.9.9.17.

## 0.9.9.17 (beta)

19, Aug, 2018

[Detail](https://support.typora.io/What's-New-0.9.54/)

1. Support preview for inline HTML, support HTML blocks.
2. Support all common HTML tags including `video`, `iframe`, `kbd`, `details`, `ruby`, etc.
3. Change a few default shortcut keys.
4. Add action items in dock menu.
5. Follow CommonMark's standard for parsing line break. Now line break is aligned in inline styles.
6. Improve UI for table, math, search panel, etc. And fix some CSS issues.
7. Add Swedish UI. (Thanks to [@FelixZY](https://github.com/FelixZY))
8. Improve paste logic, and support parsing/converting more HTML contents, include gist snip, iframe embed, etc.
9. Fix `Return` key and related undo/redo on tables.
10. Fix rendering bugs when `Indent first line of paragraph` is enabled.
11. Math block with Pandoc style attributes can be still parsed as Math block.
12. Search text will begin from current caret position, instead of start from document beginning. 
13. Fix Input bug using Korean IME or Spanish keyboard.
14. Fix menu/title not updated when user switch between articles/file tree sidebars.
15. Fix typo for language `sqlite`, add `tsx`, `stylus`, `julia` syntax highlight.
16. Language and other attribute of code fences will be included when export using Pandoc.
17. Improve drag & drop plain text support from other apps.
18. Support HTML Entity Number.
19. Improve logic about picking correct smart quotes. Fix smart pants not exported when using Pandoc.
20. Fix select all not work when first/last element is image or styled text on macOS.
21. Fix window will scroll to incorrect position when user input code or math block.
22. Other bug fix.

## 0.9.9.16.2 (beta) 

1, Jun, 2018

1. Fix bugs relates to SmartyPants. 
2. Fix return key on tables.
3. Fix mirror styles and typos.

## 0.9.9.16.1 (beta)

30, May, 2018

1. Fix Markdown line break not work.
2. Fix style error on macOS <= 10.11

## 0.9.9.16 (beta)

27, May, 2018

1. Add Smart Punctuation (SmartyPants) Support.
2. Support remap unicode punctuations on parse. [detail](https://support.typora.io/SmartyPants)
3. Fix bugs and improve UI of table functions.
4. Fix bug that styles inside underline (`<u>`) are not rendered.
5. Fix undo/redo logic when changing styles or in source code mode.
6. Add syntax highlight for pseudocode.
7. Add Hungarian interface. Improve labels and translations.
8. Improve URL detect logic.
9. Other bug fix.

## 0.9.9.15.3 (beta)

6, May, 2018

1. Fix issues on sub list and IME input.

## 0.9.9.15.2 (beta)

4, May, 2018

1. Fix a bug that some code fences cannot be edited.

## 0.9.9.15 (beta)

2, May, 2018

1. Add option to reopen last files/folders or open custom folders on start up.
2. Add Croatian language.
3. Add 'Save All' command in menubar.
4. Better 'drop' support of text and image from external apps.
5. Make non-latin character in exported PDF searchable and copyable. 
6. Reduce app size.
7. Bug fix on mermaid.
8. Better select word, delete word and triple click support.
9. Bug fix on typing in inline math.
10. Bug fix on IME support.
11. Other bug fix.

## 0.9.9.14 (beta)

3, Apr, 2018

1. Add options for preserve or ignore whitespace/single line break when editing or export.
2. Update mermaid support and re-enable html labels in mermaid diagram.
3. Fix bugs on ordered lists.
4. Improve logic for auto pair.
5. Remember typewriter/focus mode on window close.
6. Improve syntax highlight logic in source code mode.
7. Re-open unsaved content when restart Typora after crash.
8. Add Dutch language support.
9. Other bug fix.

## 0.9.9.13.5 (beta)

14, Mar, 2018

1. Fix table insert not work in v0.9.9.13.4.

## 0.9.9.13.4 (beta)

13, Mar, 2018

1. Fix error about copy images in v0.9.9.13.3.

## 0.9.9.13.3 (beta)

12, Mar, 2018

1. Task lists follows GFM's spec ([#643](https://github.com/typora/typora-issues/issues/643)). You may need to update your theme if your theme are downloaded.
2. Support disable auto-warp for code fences.
3. Support paste image directly. Add default actions and quick actions when insert images.
4. New language supports: German by [rcvd](https://github.com/rcvd) and Gert, Czech by [byDave251](https://github.com/byDave251), Greek by [kiriakosv](https://github.com/typora/kiriakosv).
4. Add `mediawiki-texvc` support for math.
5. Improve UI for mermaid and sequence.
6. Fix bug for copy and resize table.
8. Improve export quotation for math equations for PDF, ePub and image output.
8. Fix parsing errors for blockquote and emphasis.
9. Fix bugs relates to IME.
10. Fix custom font size not applied on launch.
12. Fix scrolling issue when navigate using outline.
12. Other bug fix and improvements.

## 0.9.9.12.5 (beta)

7, Feb, 2018

1. Fix bug relates to IME.

## 0.9.9.12.4 (beta)

6, Feb, 2018

1. New language support: Spanish by  [thepiratejester](https://github.com/thepiratejester), French by [MOrdinateur](https://github.comMOrdinateur), Russian by [dragomano](https://github.com/dragomano), Japanese by [tomochan001](https://github.com/tomochan001), Portuguese by [akz92](https://github.com/akz92).
2. Improve parse logic for block quotes, lists, and tables.
3. Support custom tab size for code blocks. Add options for default ordered list styles.
4. Fix `<br>` not exported.
5. Fix scrollbar on sidebar cannot be dragged.
6. Better UI for preference panel in other languages.
7. Add syntax highlight for `SAS`.
8. Other bug fix.

## 0.9.9.12 (beta)

25, Jan, 2018

1. Improve Simplified Chinese translation by [NoDotCat](https://github.com/NoDotCat), [HowardTangHw](https://github.com/HowardTangHw),  [Emphasia](https://github.com/Emphasia)
2. More language support: Traditional Chinese translation (by [cyberrob](https://github.com/cyberrob)), Polish translation (by  [iriusturar](https://github.com/iriusturar)), Korean translation (by  [ryush00](https://github.com/ryush00),  [marigold9124](https://github.com/marigold9124)), Italian translation (by  [starise](https://github.com/starise), [jethro17](https://github.com/jethro17)).
3. Support resize on sidebar (require newer version of macOS).
4. Add Privacy Policy.
5. Fix a bug that Typora does not support split screen on macOS 11.13 and cannot minimize window by double clicking titlebar following user's System Preference.
6. Fix some bugs for table editing.
7. Fix a bug that highlight, superscript, subscript, image and inline math is not rendered in outline.
8. Fix a bug that Gothic theme leads to high CPU usage.
9. Some performance improvement on opening file.
10. Fix a bug that flowchart is not correctly rendered when Windows style line ending is used.
11. Equation numbering is support after export as docx format for some math formula.
12. Fix a word count bug for Korean language.
13. Fix bugs on list editing.
14. Other bug fix.

## 0.9.9.11.2 (beta)

13, Dec, 2017

1. Add Chinese user interface.
2. Tables with long content supports scroll horizontally.
3. Support choose line endings on macOS.
4. Improve PDF export, fix bugs relates to PDF export.
5. Add [strict mode](https://support.typora.io/Strict-Mode/) option for parsing markdown.
6. Fix bug that cannot open correct link address for hyperlink syntax.
7. Some fix bug about markdown parse logic.
8. Fix bugs about `[TOC]` .
9. Other bug fix.

## 0.9.9.10.9 (beta)

29, Oct, 2017

1. Support `<br/>` tag in live rendering.
2. Update emoji library to cover emojis introduced during Unicode 7.0~10.0
3. Add syntax highlight for twig.
4. Improve auto indent in code fences
5. Fix files/folders are not sorted in file tree view, support open in new window for folders.
6. Other bug fix.

## 0.9.9.10.8 (beta)

25, Sep, 2017

1. Support rename in file tree view.
2. Support show word count in selection.
3. Add syntax highlight for scheme.
4. Support natural sort in files panel.
5. Fix task list cannot be copy/pasted correctly.
6. Fix code fences padding on PDF export.
7. Fix window cannot be zoomed by double click on titlebar
8. Other bug fix.

##  0.9.9.10.6 (beta)

26, Aug, 2017

1. Fix a bug that user cannot jump using [TOC].
2. Fix on exported HTML, `@include-when-export` failed to convert as `<link>`.
3. Fix caret is invisible in High Sierra Beta.

##  0.9.9.10.4 (beta)

24, Aug, 2017

1. Add menu items for changing task list status.
2. Add syntax highlight for makefile, tcl.
3. Bug fix that user cannot double click on titlebar to maximize window.
4. Fix mermaid gantt cannot be rendered.
5. Fix backspace after emoji.
6. Fix window will scroll to top when switch from inactive window to active one.
7. Fix a bug that sometimes `Return` does not work.
8. Other mirror fix.

## 0.9.9.10.3 (beta)

15, Aug, 2017

1. Fix a critical bug that some code fences may crash the app. 

## 0.9.9.10.2 (beta)

13, Aug, 2017

1. Fix some regression bug on v0.9.9.10
   1. Drag titlebar in seamless mode is not easy.
   2. Auto pair for normal markdown characters does not work.
   3. Fix for `<img height="200" />` , the height attribute won't be correctly added when rendering.
   4. Sometimes, document will scroll to top unexpectedly.
2. `@import` and `@include-when-export` will be converted to linked stylesheet when export to HTML.
3. Fix a bug that ⌘+click on hyperlink cannot open other protocol like `magic:` or others.
4. Fix a bug that selection should extend by word in some cases.
5. `⌘` + ` Up`/`Down` key can exit code fences when the cursor is at start/end position of the code fences.f
6. Better image select logic when editing: double click and auto select all raw text of an image.
7. Can copy tables to Words from context menu.
8. Select word/select line also supports code fences and source code mode.

## 0.9.9.10 (beta)

9, Aug, 2017

1. Support file tree/list in left side panel.
2. Start using CSS variable in themes. Change theme styles may be easier.
3. Support relative link to files without adding `.md` or `.markdown`  explicitly. 
4. Diagrams can auto fit the max-width.
5. Improve auto detect logic for urls.
6. Fix exported HTML/PDF does not follow original markdown's logic of line break.
7. Fix syntax highlight in night theme and syntax for protobuf, diff and php+html does not work. 
8. Fix bug that sometimes code fences may contain unnecessary scrollbar when editing or after export.
9. Change some inappropriate descriptions in menu, dialog and tooltip.
10. Fix bug that some `<a>` tags are not parsed correctly.
11. No auto-pair for markdown symbols in inline math.
12. Support Chinese character in header anchors.
13. Fix a bug that list and line break are not pasted correctly in some condition.
14. Fix a bug that ctrl+k won't delete empty line/block. And command+backspace may remove wrong paragraph.
15. Fix bug of delete and return key on selected text or table.
16. Find/Replace input supports undo/redo and hit selection in code fences won't be removed.
17. Fix excepted HTML tags are not escaped in exported HTML.
18. Fix bug that extra blank page will be appended when exporting to PDF.
19. Other bug fix.

## 0.9.9.9.4 (beta)

30, Mar, 2017

1. Fix some crash on macOS 10.9.5 and 10.12.4

## 0.9.9.9.3 (beta)

1, Mar, 2017.

1. Fix crash on macOS 10.9

## 0.9.9.9.2 (beta)

27, Feb, 2017

1. Seamless window supports dark theme.
2. "Share" action is now supported in context menu.
3. Reduce memory usage and improve scroll performance.
4. Support refresh content automatically when file is changed even when Typora is not focused.
5. Behavior change: Focus mode won't be exited temporary when typewriter mode it not enabled.
6. Behavior change: Use less strict rules for recognizing sublist by indents.
7. Exported HTML (without class) for code fences could follow w3c recommendations and be more friendly with Prism.
8. Improve compatibility of HTML in clipboard when copy in Typora.
9. Can convert more styles when paste HTML from Safari.
10. Add syntax highligh for `fortran`. Fix bugs of syntax highlight function for `Scala` and `C#`.
11. Fix some bugs relates to crash and data lose.
12. Support open multiple files from open file dialog.
13. Fix font rendering issue when outline panel is visible.
14. Fix bugs that some behavior for links are not correct.
15. Fix table parsing logic for special characters.
16. Fix a bug that some math block is invalid in exported EPub.
17. Fix a bug that `\{` is not correctly handled in inline math.
18. Other bug fix.

## 0.9.9.9.0 (beta)

20, Jan, 2017

1. Fix a bug the dialog modal is not clickable.
2. Fix a bug that wrong text is selected after toggle hyperlink.

## 0.9.9.8.9 (beta)

19, Jan, 2017

1. Fix a bug that "import" menu item is hidden.
2. Fix a bug that sometimes, some shortcut key is not responding.

## 0.9.9.8.8 (beta)

3, Jan, 2017

1. **Support touch bar**.
2. Support move table row/col when drag on left/top side of table row/col or using shortcut keys ⌘ + ⌃ + arrow key.
3. Add syntax highlighting for `cmake`, `cypher`, `dart`, `django`, `dtd`, `dylan`, `handlebars`, `idl`, `web idl`, `yacas`, `mbox`, `vhdl`, `julia`, `haxe`, and `hxml`.
4. Remove `//` after `mailto:` for auto generated mail link.
5. Fix image position for flowchart.
6. Fix a bug that some link url or image url are escaped twice.
7. Fix a  bug that `:+1:` is not recognized as emoji.
8. Fix refresh mathjax will convert inline math when inline math is not enabled.
9. Other bug fix and improvements.

## 0.9.9.8.5 (beta)

5, Dev, 2016

1. Fix a bug which may cause high CPU usage

## 0.9.9.8.4 (beta)

20, Nov, 2016

1. Fix the logic for relative path for `typora-root-url`.
2. Support uploading images via iPic.
3. Support paste images into Typora(after set-up).
4. Support copy images to selected folder when insert images.
5. Fix bugs related to collapsible outline panel.
6. Fix bugs that exported PDF may contain  HTML in bookmark.
7. Fix bugs about undo/redo for nest task list.
8. Fix mermaid no responding when Chinese character exists.
9. Change `Copy as Markdown` option from opt-in to opt-out.
10. Support elixir for code fences.
11. Allow open local files from context menu on hyperlinks.
12. Fix some typo on interface.
13. Other bug fix.

## 0.9.9.8.2 (beta)

18, Oct, 2016

1. Support open local file/folder from hyperlink.
2. Support insert image from local file. Support drag & drop multiple images.
3. Fix Typora will close without save or ask for save under certain system preference.
4. Improve footnote export and behavior.
5. Add option for auto-numbering math blocks. Support command for refreshing math expression.
6. Add option set left outline panel collapsible.
7. Support `<img>` tag without a close tag.
8. Remove unnecessary math delimiter for exported LaTeX. 
9. Add new export option — image.
10. Add syntax highlight for `ocaml`, `F#`, `elm`, `spreadsheet` and `pgp(Ascii Armor)`.
11. Other bug fix.

## 0.9.9.8 (beta)

6, Oct, 2016

1. Add support for simple HTML fragments, only includes: `<!--comments-->`, `<a href="http://typora.io">link</a>`, `<img src="http://www.w3.org/html/logo/img/mark-word-icon.png" width="200px" />`.
2. Fix syntax highlight for `Octave` is not working, and add `matlab` as its alias. 
3. Math expressions now support export to epub. Diagrams will be converted to images when export to epub/docx.
4. Fix a bug that arrow of diagrams is missing when export to HTML/PDF.
5. Fix a critical bug on tables.
6. Fix crashement on macOS 10.9.5.
7. Other bug fix.

## 0.9.9.7.8 (beta)

26, Sep, 2016

1. Ready for Sierra, with bug fix and support for multi-tab feature on macOS Sierra. (Notice: Seamless window with dark theme is still unsupported).
2. Support paste rich text from Safari, or Mail.app, etc.
3. Launched our [Theme Gallery](http://theme.typora.io) to share and download Typora themes.
4. Fix unnecessary scroll.
5. Fix backspace after UTF-32 character.
6. Fix bugs related to inline code inside table.
7. Recover outline panel status when switch from source code mode.
8. Other bug fix.
9. A Linux build (Debian/Ubuntu) is [available](https://typora.io/#linux).

## 0.9.9.7.6 (beta)

4, Sep, 2016

1. Add options to auto pair common markdown symbols, like `*_ etc.
2. Add options to show markdown source for simple blocks when focus, including headings.
3. Fix a bug that sometimes special characters will cause inline math not rendered.
4. Fix a bug that footnote definition cannot be correctly input.

## 0.9.9.7.1 (beta)

20, Aug, 2016

1. Fix special characters cannot be input inside inline math.

## 0.9.9.7 (beta)

19, Aug, 2016

1. Support diagrams, includes sequence, flowchart and mermaid ([doc](https://support.typora.io/Draw-Diagrams-With-Markdown/)).
2. Fix basic compatibility with aText and Typinator.
3. Fix backspace inside code fences.
4. Fix escape character will gone in inline math, inline code, and other inline styles.
5. Fix some options not visible in print panel.
6. Other bug fix and improvements.

## 0.9.9.6.4 (beta)

7, Aug, 2016

1. Fix a bug image drag & drop doe not work.
2. Fix a bug related to parsing `*` and escaped character.
3. Fix special character, such as `#` cannot be inserted in ceylon code block.
4. Other bug fix.

## 0.9.9.6.2 (beta)

29, Jul, 2016

1. Fix a bug that `**` is not correctly parsed.
2. Fix a bug typora will frozen after recover from hidden.
3. Fix list indentation not correctly saved.
4. Fix footnotes contains "_" cannot be exported correctly.
5. Fix a bug some file format cannot be exported via pandoc.
6. Add "Textile" as one export option.
7. Improve URL auto detection.
8. Other bug fix.

## 0.9.9.6 (beta)

24, Jul, 2016

1. Add focus mode and typewriter mode support.
2. Remember last status of outline bar.
3. Support restore previous sessions on macOS.
4. Add syntax support for assembly and TOML.
5. Support kramdown style `[toc]` syntax.
6. Improve list indent/outdent logic.
7. Fix HTML entities not escaped in meta block.
8. Remove width styled when put HTML into clipboard.
9. Fix drag&drop image not work for relative path.
10. Fix a bug that triple click cannot select current line correctly.
11. Fix auto indent for brackets in code fences.
12. Add options to export reStructuredText, and OPML format.
13. Fix user.css not included in exported HTML/PDF.
14. Fix a bug typora not responde after unminimize its window.
15. Fix no preview in print dialog.
16. Other bug fix.

## 0.9.9.5.1 (beta)

22, Jun, 2016

1. Fix a critical bug that the indent in multi-level lists may keep increasing after save.

## 0.9.9.5 (beta)

21, Jun, 2016

1. Fix a critical bug that the indents of multi-level lists are wrong when parsing and generating markdown source.
2. Better ECMAScript6 syntax highlight support for javascript code fences. Add syntax highlight support for NSIS, JSX ([React](http://facebook.github.io/react)'s JavaScript syntax extension), vue, LiveScript, mathematica, properties (and .ini), tiki wiki, dockerfile in code fences.
3. Hide auto-complete lists when scrolling.
4. Fix internal link to heading (like [this](#0.9.4.5-(beta))) not work.
5. Fix a bug sometimes, pasting would append duplicate texts.
6. Rule change: capitalized characters are not allowed in filenames for theme css file
7. Support single column table in insert table dialog.
8. Add enabled optional inline style support, like highlight or inline math, in menubar.

## 0.9.9.4.4 (beta)

15, Jun, 2016

1. Fix style that sometimes user can see script content.
2. Fix auto pair match inside image and avoid glitch when complete brackets.
3. Fix paste table, and paste inside footnotes.
4. Fix `]` cannot be escaped in footnotes.
5. Fix `cmd+6` not working on OS X, and `h6` indent inside `[TOC]`.
6. Fix multiple level lists inside blockquote cannot be parsed correctly.
7. Enable ESC key to close insert table dialog.
8. Fix outline sidebar jumpping around when scrolling.
9. Fix cmd+up/down not trigger scrolling.

## 0.9.9.4 (beta)

1, Jun, 2016

1. Make quick look up (three finger tap) work on Typora.
2. Fix a critical bug about saving in source code mode.
3. Improve logic for auto match paired quotes and brackets.
4. Fix inline math cannot be exported to some file types via pandoc.
5. Fix a bug that improper file name is auto generated when the article contains YAML forn matters.

## 0.9.9.3.5 (beta)

27, May, 2016

1. Add mobile "responsive" support for exported HTML.
2. Pandoc requires 1.16 and above. Fix exporting fail using Pandoc.
3. Avoid unnecessary dialogs when update file content changed by external apps.
4. Fix shortcut keys for `h6` not working.
5. Add syntax highlight for Powershell. 
6. Remember windows size when creating new window.
7. Fix file cannot be saved in txt or other file extensions.
8. Fix a critical bug in paste/undo which may case data lose.
9. Make `\label` work in math block.
10. Fix unnecessary empty char in inserted footnote.
11. Fix auto pair match and find/replace in math block.
12. Fix up/down key behavior on code fences.
13. Fix some HTML code (like `&phone;`) not escaped in inline code.
14. Other bug fix.

## 0.9.9.3 (beta)

5, May, 2016

1. Add pandoc integration, import function and export function for docx, rtf, LaTeX, etc.
2. Able to open `.md` file or import supported files by drag and drop into typora's doc icon or window.
3. Fix `H4` style in `pixyll` theme.
4. Fix sql mode error for code blocks.
5. Fix a bug for parsing headers with underline style.
6. Fix a bug for undo/redo for editing lists.
7. Fix a bug when pasting lists.
8. Other bug fix.

## 0.9.9.2.5 (beta)

23, Apr, 2016

1. Fix LaTeX is not correctly exported after opening existing files.
2. Fix a bug which may cause content inside list items get lost.
3. Fix wrong indent for content inside list after parsing raw markdown.
4. Support "Open File Location" action.
5. Fix a bug menu items under "File" menu cannot be enabled/disabled correctly.
6. Fix a bug that if image path contains special chars like quotes, the image cannot be displayed correctly.
7. Fix another crash problem and improve stability.
8. Fix a bug on pasting list.

## 0.9.9.2.1 (beta)

18, Apr, 2016

1. Fix some crashes after 0.9.9.x 

## 0.9.9.2 (beta)

17, Apr, 2016

1. Fix a bug sometimes a line will be duplciated after open.
2. Fix a bug that the file is still occupied even after window close.
3. Fix a bug typora will crash when opening exisiting file.
4. Fix a bug that the position of quick open dialog is wrong.

## 0.9.9.1 (beta)

6, Apr, 2016

1. Fix a critical bug for saving.
2. Fix a critical bug for task list.

## 0.9.9.0 (beta)

4, Apr, 2016

1. Rewrite typora's Markdown parse engine and largely improve the performance on opening mid-sized files.
2. Add simple "Quick Open" feature to allow users to open files quickly from recent files, current folder or context folder.
3. Support word count in selection. (Select a range of text and open word-count panel).
4. Support pin window on top. Fix shortcut key for "fullscreen".
5. Fix bugs for pair auto-complete.
6. Fix bugs for Korean IME.
7. Fix a bug that typora will eat and replace non-breaking space.
8. Fix a bug that outline is not clickable in exported HTML.
9. Fix relative image path on exported HTML.
10. Able to generate filenames automatically when exporting PDF.
11. Other bugs.

## 0.9.8.8 (beta)

13, Mar, 2016

1. Fix minor parse issue for URL, subscript and superscript.
2. Fix compatibility issue between Chinese IME and auto-pair feature
3. Include and autoload MathJax extension, including chemistry package and others (e.g. $\ce{C6H5-CHO}$).
4. Other bug fix.

## 0.9.8.7 (beta)

3, Mar, 2016

1. Support ==highlight== syntax (should enable it from preference panel).
2. Support auto complete pairs of brackets, quotes and parentheses.
3. Fix bugs on lists.
4. Fix bugs for drag and drop images in same folder. 
5. Fix bugs related to auto correction. Fix tab key.
6. Fix selection styles in code fences, python code in code fences will use 4-space indent.
7. Fix customize font size not work for exported HTML/PDF.
8. Fix bugs for LaTeX editing/rendering.
9. Auto insert path/urls from clipboard when insert images/hyperlinks from menubar or shortcut keys.
10. Fix bugs related to up/down key and text selection.
11. Other bug fix.

## 0.9.8.6 (beta)

21, Feb, 2016

1. Fix critical bug for inputing whitespace in headers.
2. Change default text alignment back to left-align. Pixyll and Gothic theme will use full justification.
3. Fix a small bug on exported HTML.
4. Update Sparkle framework to prevent HTTP MITM vulnerability.

## 0.9.8.5 (beta)

21, Feb, 2016

1. Add basic support for editing in source code mode directly.
2. Support signle line break (shift+return).
3. Improve LaTeX rendering quality.
4. Fix bugs on basic theme and improve design of theme gothic.
   (Old css files are backed-up under "old-theme" folder under user's theme folder).
5. Fix bug that tab+subbullet will be parsed as code fences.
6. Fix syntax highlight support for PHP, SQL, Objective-c, and add support for CQL, mariadb, etc.
7. Fix ctricial bug for Finish IME.
8. Fix jump to top/bottom not work in some cases.
9. Fix bugs in find/replace.
10. Correct typo in prefernece panel and fix other small bugs.

## 0.9.8.1 (beta)

3, Jun, 2016

1. Fix a critical bug.

## 0.9.8 (beta)

26, DEC, 2015

1. Fix the bug image drag & drop not work.
2. Support grammar checking, and user can perform spell&gramma check on whole document by shortcut key `⌘+;`.
3. Fix syntax parse for task list.

## 0.9.7.9 (beta)

16, DEC, 2015

1. Fix the bug sometimes shortcut keys does not work.
2. Fix the bug TextExpander popup and fill does not work with Typora.
3. Fix the bug copy/paste cannot work in context menu.

## 0.9.7.8 (beta)

14, DEC, 2015

1. Fix a crucial bug when using IME on Typora.
2. Improve styles when paste to rich editor.
3. Fix bugs related to email and link syntax.
4. Fix option+arrow key in inline math.
5. Fix copy, paste & select in save dialog.
6. Typora will use `https` to check and download updates.
7. We will release beta on Windows in near future :)

## 0.9.7.5 (beta)

30, NOV, 2015

1. Fix bug that outline panel cannot be scrolled.
2. Fix bug that some shortcut keys does not work after new window is opened.
3. Fix bugs related to email auto-detection.
4. Fix bug that spell check cannot be turned off.

## 0.9.7.4 (beta)

28, NOV, 2015

1. Support Find & Replace.
2. Support background color and TOC in exported PDF.
3. Able to toggle outline view from menu.
4. Relative path support for image drag & drop. 
5. Add function to reveal image in finder from context menu.
6. Bug fix about list bullet and task list.
7. Fix several bugs related to CKJ IME.
8. Shortcut keys to insert rows for table.
9. Fix bug for crashes when click menu item.
10. Fix knowns compatibility issues on OS X 10.11.1. 
11. Other bug fix.

## 0.9.7 (beta)

20, OCT, 2015

1. Support <u>underline</u> (`<u>underline</u>`).
2. Allow user to set `copy markdown source code` as default copy behavior.
3. Add function to copy in HTML code format.
4. Recognize code block by `\t` when pasting or open file.
5. Fix bug that img with relative path not shown on exported PDF/HTML.
6. Fix the bug that sometimes list mark disappears.

## 0.9.6.8 (beta)

12, OCT, 2015

1. Fix compatibility issues on El Capitan, including word count, outline button can not shown, images cannot display, etc.
2. Support reference images.
3. Auto refresh local images if they are modified.
4. Fix bug that some code highlight become unavailable after last update.
5. Fix bugs for editing on a range of text.
6. Improve speed and performance.
7. Fix bugs for exported HTML and PDF.
8. Other bug fix.

## 0.9.6 (beta)

30, AUG, 2015

1. Add academic feature: inline math support.
2. Add academic feature: subscript and superscript.
3. Won't escape HTML tags when export to HTML/PDF.
4. Add code highlight for R, D, diff, Erlang, http, jade, reStructuredtext, rust, jinja2, asp, jsp, erb, ejs.
5. Other bug fix and performance improvement.

## 0.9.5.7 (beta)

9, AUG, 2015

1. Fix a crucial bug for saving lists.
2. Fix a crucial bug for saving table contents.

## 0.9.5.6 (beta)

2, AUG, 2015

1. Add emoji support :smile:.
2. Fix bugs for paste function.
3. Support export HTML without CSS styles.
4. Choose `<title>` from filename or content automatically for exported HTML.
5. Fix bugs that local images not shown in exported PDF.
6. Improve code fences. Add auto-close-tag and auto-close-bracts for code fences
7. Improve word count for other languages. Add line count function.
8. Fix delete operation on first selectable blocks, fix behavior for `ctrl+k`.
9. Add configuration for indent size when saving.
10. Fix bug that typora will crash when apply inline styles for multiple line.
11. Other style fix and bug fix.

## 0.9.5 (beta)

28, JUN, 2015

1. Add **word count** feature. (For Chinese characters, it will count one character as one word automatically).
2. Watch file modifications by external applications when editing.
3. Add `TOC`, `Math Block` to main menu.
4. Support 4 whitespace indent for code blocks when reading/pasting markdown sources.
5. Detach <code>HTML tags</code>
6. Able to open/edit all text files, whatever the extension name is.
7. Fix Image not shown when editing.
8. Fix bugs that user cannot convert paragraphs into list or blockquote from menu commands.
9. Fix CSS style.
10. Remove unnecessary empties lins in lists when exporting or pasting.
11. Fix bug: cursor will lose when clicking top/bottom area.
12. Improve performance.
13. Other bug fix.

## 0.9.4.5 (beta)

30, MAY, 2015

1. Fix bugs parsing list and task list.
2. Fix bugs that shift + arrow key does not work correctly.
3. Fix an undo/redo bug.
4. Fix export function for task list.
5. Fix broken style when export to HTML/PDF.
6. Export to HTML/PDF will keep file name.
7. Reduce exported HTML file’s size.
8. Other bug fix.

## 0.9.4 (beta)

6, MAY, 2015

1. Support customized font size.
2. Support image with relative path.
3. Allow typora to open all plain text files, including .txt file
4. Allow user to change from code blocks to paragraph from menu.
5. Detect Php Markdown Extra’s attribute list syntax on headings
6. Add new shortcut key ⌘+-/+
7. Turn off smart quote on YAML Front Matter automatically
8. Add syntax highlight for typescript
9. Allow clicking empty bottom area to append new paragraph after code fences and other selectable blocks
10. Fix key navigations on tables
11. Fix a bug that export/print does not work
12. Fix a copy/paste bug
13. Fix a bug that cut/undo/save function in code fences does not work
14. Fix a bug that when undo stack reach its maximum, undo function is broken
15. Fix a bug that Option + Delete does not work, Shift + up/down arrow key does not work
16. Other bug fix.

## 0.9.3 (beta)

19, APR, 2015

1. Support opening files in local disk, when clicking hyperlinks targeting at local files
2. Better key navigation for tables (use `tab`, `shift+tab`, and `enter` key to jump to another cell quickly).
3. New code fences syntax: `Swift` and `Scala`.
4. Fix bugs of lists
5. Fix bugs: open another file will crash on fullscreen mode.
6. Other bug fix.

## 0.9.2 (beta)

8, APR, 2015

1. Add Yosemite window style — seamless window style 
2. Add `[TOC]` syntax support
3. Add outline support.
4. Improve copy function, Copy to other HTML editor will restore the style.
5. Add preference window
6. New shortcut key:
   1. Jump to selection `cmd+j`
   2. Jump to top `cmd+[`
   3. Jump to bottom `cmd+]`
7. Bug fix and css style fix.

## 0.9.1 (beta)

17, Mar, 2015

1. Fix bug of characters not shown when using Japanese IME.
2. Improve theme styles and add a new theme.
3. Other bug fix.
4. Improve copy & paste. Support Copy as Markdown.
5. Suggest file name when saving.

## 0.9.0 (beta)

9, Mar, 2015

1. fix a bug sometimes delete operation fail.
2. fix a bug typora will eat character when using IME.
3. add basic support for Markdown Extra’s attribute syntax for images.
4. init anonymous usage message collection
5. other bug fix.

## 0.8.9 (beta)

4, Mar. 2015

1. fix a bug of delete operation
2. fix a bug that typora cannot open `.md` files with YAML Front Matters
3. typora will remember position of last closed window when restart.

## 0.8.8 (beta)

27, Feb. 2015

#### Usability Improment

1. Live preview for lists and quote-blocks will be applied immediately instead of changing styles after pressing `return` key.
2. Change the way to display, edit image
3. Support drag & drop to insert image. Support custom url prefix for images.
4. Block/Inline styles will be marked in menu `Paragraph` and `Format` from menu bar.
5. Add hint for h3~h6 headers.
6. Change click behavior for hyperlinks. Click to edit and command+click to open link.
7. Add new shortcut key `Command+E` to select a sequence of styled text (or cell in table).

#### Bug Fix

1. Fix the error layout of exported PDF.
2. Fix the bug that menu item not work when multiple window is opened.
3. Fix bugs that lead to slow performance.
4. Other bug fix.

## 0.8.7 (alpha)

28, Jun. 2015

1. add support for LaTex/Tex math blocks
2. fix bugs of initialization.
3. some other bug fix.

## 0.8.6 (alpha)

1, Jun, 2015

1. Fix bugs about cusor position and inline style.
2. Fix Image style and tooltip location. 
3. Fix unproper behavior when locked.

## 0.8.5 (alpha)

1. fix bugs
2. add support for YAML front matter

## 0.8.2 (alpha)

1. fix knwon bugs

## 0.8.1 (alpha)

First working version for alpha test.