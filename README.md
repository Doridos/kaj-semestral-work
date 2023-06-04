# My notebook - Semestrální práce pro předmět B0B39KAJ

English version follows

## Autor 👨‍💻
Vladyslav Babyč

Softwarové inženýrství a technologie, Fakulta elektrotechnická, ČVUT

2023

## Popis funkcionalit ⚙️

V rámci této semestální práce jsem se zaměřil na implementaci aplikace, která bude uživateli umožňovat zapisovat si poznámky 
do sešitů, nahrávat audio poznámky a vytvářet si plán činností (tzv. todos). Aplikace je napsána s použitím technologií 
HTML, CSS, JS a s použitím knihovny React.

### Zápis poznámek 🖋️
Po přihlášení do aplikace, se uživateli zobrazí hlavní stránka aplikace, kde si může vytvářet sešity, do kterých může následně zapisovat
své poznámky prostřednictví tažení myši se zmáčknutým levým tlačítkem, má také možnost vkládat do sešitu text a obrázky. V sešitě může uživatel přidávat stránky a 
přepínat mezi nimi. Také je implementována funkčnost undo, redo v případě, že by se uživatel chtěl vracet ve svých změnách
nebo naopak tyto změny obnovovat. 
Dále je implementována funkcionalita vyčištění stránky a export celého sešitu do PDF souboru. Uživatel může v pravé části obrazovky zvolit
jednu ze čtyř předvolených barev pro změnu barvy tahu, nebo případně pokud by mu tyto barvy nestačily, může druhým kliknutím na již 
zvolenou barvu otevřít okno pro změnu barvy a vybrat si jakoukoliv dostupnou barvu. Je důležité podoknout, že na desktopu se poznámky
nepíši (nekreslí) zrovna nejlépe, proto je implementována i verze, která funguje na tabletech a telefonech. Nejlepší výsledky v psaní poznámek
se dají dosáhnout na tabletech se stylusem. S možností vkládání textu a obrázků na desktopu však aplikace může fungovat jako jakási
tabule pro vysvětlování nebo grafické znázorňování informací.
Vytvořené sešity se dají také mazat po kliknutí na příslušné tlačítko na hlavní stránce. 
Veškeré změny se zapisují do indexedDB a z toho důvodu jsou persistentní, uživatel má tedy možnost se ke svým vytvořeným poznámkam
kdykoliv vracet. Je důležité upozornit, že uložení sešitu probíhá poté co uživatel buď přidá stránku v existujícím sešitu, přepne stránku v existujícím sešitu
nebo otevřený sešit zavře. V ostatních případech jsou změny uloženy "jen na papíře" a nejsou zapsány do indexedDB. Aplikace podporuje více uživatelů,
díky rozdělenému ukládání sešitů každého uživatele. Po odhlášení a zadání jiného jména než bylo zadáno při prvním přihlášení, má jiný uživatel možnost tvořit svůj obsah
zcela nezávisle na jiných uživatelích.

### Audio poznámky 🎙️
Po kliknutí na tlačítko menu(tři čáry) v levé horní části. Se uživateli zobrazí nabídka poskytovaných funkcionalit. Když uživatel vybere možnost Voice records dostane
se do části aplikace, která umožňuje nahrávat hlasové zprávy. Samozřejmě předtím, než uživatel bude moct nahrát hlasovou nahrávku,
musí potvrdit přístup k mikrofonu. Po kliknutí na tlačítko Start recording, se začne nahrávat nová nahrávka a uživatel může nahrávní buď pozastavit, nebo úplně stopnout. 
Po kliknutí na tlačítko Stop. Je nahrávka uložena a uživatel si ji může buď přehrát nebo smazat. Když uživatel klikne na vygenerované jméno, což je datum a čas 
pořízení nahrávky má možnost název nahrávky změnit, aby pro něj byla lehčeji identifikovatelná později. Stejně tak jako sešity i nahrávky jsou úzce spojeny s uživatelem
a každý uživatel vidí jen ty nahrávky, které si pořídil (všechny nahrávky jsou persistentní).

### Plán činností 📃
Pokud se uživatel rozhodne opět otevřít menu a vybrat možnost To do. Dostane se do části applikace, kde si může zapsat činnosti, které chce splnit. 
V podstatě se jedná o seznam aktivit. Když uživatel napíše do políčka aktivitu a klikne na tlačítko Enter. Přidá se tato činnost do seznamu naplánovaných
aktivit. Uživatel má pak možnost tuto aktivitu dokončit kliknutím na ní. Kdyby si uživatel chtěl zobrazit všechny dokončené aktivity tu možnost má po přepnutí
přepínače (Planned/Compeleted) do stavu Completed. To je možné učinit kliknutím na již uvedený text přepínače. Když se zobrazuje seznam dokončených věcí,
má uživatel možnost splněné věci přesunout zpátky do seznamu ještě nedokončených kliknutím na dokončenou položku, nebo tuto položku smazat. Uživatel má také možnost
smazat všechny dokončené položky. Stejně tak jako nahrávky a sešity i naplánovaný seznam věcí je persistentní a každý uživatel má svůj vlastní seznam těchto 
naplánovaných položek.

# My notebook - Semester work for the course B0B39KAJ

English version follows

## Author 👨‍💻
Vladyslav Babyč

Software Engineering and Technology, Faculty of Electrical Engineering, CTU

2023

## Description of functionalities ⚙️

In this work I focused on the implementation of an application that will allow the user to write down notes
in a notebooks, record audio notes and create a plan of activities (called todos). The application is written using technologies
HTML, CSS, JS and using the React library.

### Note-taking 🖋️
After logging into the application, the user is presented with the main page of the application, where he/she can create notebooks in which he/she can then write
notes by dragging the mouse with the left button clicked, and can also insert text and images into the notebook. In the notebook, the user can add pages and
switch between them. Also, undo, redo functionality is implemented in case the user would like to go back in his changes
or, conversely, to restore those changes.
Furthermore, the functionality to clean up a page and export the entire workbook to a PDF file is implemented. The user can select in the right part of the screen
one of the four preset colors to change the stroke color, or alternatively, if these colors are not enough, he can second click on the already
selected color to open the color change window and select any available color. It is important to note that is not the best way to write notes on the desktop
so a version that works on tablets and phones is implemented. Best results in note-taking
can be achieved on tablets with a stylus. However, with the ability to insert text and images on the desktop, the app can act as a sort of
whiteboard for explaining things or for graphical representation of information.
Created notebooks can also be deleted by clicking on the corresponding button on the main page.
All changes are written to the indexedDB and are therefore persistent, so the user has the possibility to access his created notes at any time. It is important to note that saving a workbook takes place
after the user either adds a page in an existing workbook, switches a page in an existing workbook
or closes the open workbook. In other cases, changes are saved "on paper only" and are not written to indexedDB. The application supports multiple users at the same time,
thanks to the distributed storage of each user's notebooks. By logging out and entering a different name than during th first login, another user is able to create their own content
completely independent of other users.

### Audio notes 🎙️
If user clicks on the menu button(three lines) in the upper left part of the screen. The user will see a menu of provided functionalities. When the user selects the Voice records option, he/she gets
to the part of the application that allows users to record voice messages. Of course, before the user can record a voice recording.
He/she must confirm access to his/her microphone. When the Start recording button is clicked, a new recording will start and the user can either pause or stop the recording.
After clicking the Stop button. The recording is saved and the user can either play it or delete it. When the user clicks on the generated name, which is the date and time
when the recording was made, the user has the option of changing the name of the recording to make it more easily identifiable to them later. Like notebooks, recordings are closely linked to the user
and each user sees only those recordings that they have made (all recordings are persistent).

### Activity plan 📃
If the user chooses to open the menu again and select the To do option. It takes user to the app section where he/she can write down the activities he/she wants to complete.
This is basically a list of activities. When the user types an activity in the box and clicks enter. It adds that activity to the list of scheduled
activities. The user then has the option to complete that activity by clicking on it. If the user would like to view all completed activities, they can do so by toggling the
switch (Planned/Compeleted) to the Completed state. This can be done by clicking on the switch. When the list of completed items is displayed,
the user has the option to move completed items back to the not yet completed list by clicking on the completed item, or to delete that item. The user also has the option
to delete all completed items. Like the recordings and workbooks, the scheduled to-do list is persistent and each user has their own list of these
scheduled items.