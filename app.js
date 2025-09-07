const createNoteBtn = document.getElementById('addBtn');
const noteInputBox = document.querySelector('.noteInputBox');
const noteHeading = document.getElementById('noteHeading');
const noteText = document.getElementById('noteText');
const addNoteBtn = document.querySelector('.addNote');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const ul = document.querySelector('ul');
const content = document.querySelector('.content');

let notesArray = JSON.parse(localStorage.getItem('notes')) || [];

function createDraftLi(text) {
    let li = document.createElement("li");
    li.textContent = text;

    let addLiBtn = document.createElement('button');
    addLiBtn.textContent = '✖';
    li.appendChild(addLiBtn);
    
    return li;
}

function createNotecard(heading, lines) {
    let card = document.createElement('div');
    card.classList.add("noteCard");

    let divNoteBtns = document.createElement('div');
    divNoteBtns.classList.add('noteBtns');

    let editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.innerHTML = '&#128221';

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    divNoteBtns.append(editBtn, deleteBtn);

    let divHead = document.createElement('div');
    divHead.classList.add("divHead");
    divHead.textContent = heading || 'Untitled';

    let divText = document.createElement('div');
    divText.classList.add("divText");
    
    if (lines.length > 0) {
        lines.forEach(line => {
            let para = document.createElement('p');
            para.textContent = line;
            divText.appendChild(para);
        });
    } else {
        divText.textContent =  "no content";
    }

    card.append(divNoteBtns, divHead, divText);
    return card;
}

// Function to display a note on the page and also store its unique ID in a data attribute
function displayNote(note) {
    let notecard = createNotecard(note.heading, note.lines);
    notecard.dataset.id = note.id;   // Store unique ID for future reference
    content.appendChild(notecard);
}

// Display saved notes on page load
notesArray.forEach(note => {
    displayNote(note);
})

createNoteBtn.addEventListener('click', ()=> {
    noteInputBox.hidden = false;
    noteHeading.focus();
});

addNoteBtn.addEventListener('click', ()=> {
    let text = noteText.value.trim();
    if(!text) return;

    let liAppend = createDraftLi(text);
    ul.appendChild(liAppend);
    noteText.value = '';
})

ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.parentElement.tagName === 'LI') {
        e.target.parentElement.remove();
    }
})

saveNoteBtn.addEventListener('click', ()=> {
    let heading = noteHeading.value.trim();
    let capitalizingHeading = heading ? heading[0].toUpperCase() + heading.slice(1) : 'Untitled';

    let lines = Array.from(ul.querySelectorAll('li')).map(li => li.firstChild.textContent);

    let noteCard = createNotecard(capitalizingHeading, lines);

    if (!heading && lines.length === 0) {
        // Don't save empty notes
        alert("Cannot save an empty note");
        return;
    }

    let newNote = {
        id : Date.now(),
        heading : capitalizingHeading,
        lines : lines
    }

    noteCard.dataset.id = newNote.id;     // Store unique ID for future reference

    notesArray.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notesArray));

    displayNote(newNote);

    // content.appendChild(noteCard);     // not appending here because displayNote function already does that and if we do it again, then notecard will be appended twice

    // Clear draft and inputs
    ul.innerHTML = '';
    noteHeading.value = '';
    noteInputBox.hidden = true;
});

content.addEventListener('click', (e) => {
    let noteCard = e.target.closest('.noteCard');
    if(!noteCard) return;

    let noteCardId = noteCard.dataset.id;

    if (e.target.classList.contains('editBtn')) {
        let heading =  noteCard.querySelector('.divHead').textContent;

        let lines = Array.from(noteCard.querySelectorAll('.divText p')).map(line => line.textContent);

        noteInputBox.hidden = false;
        noteHeading.textContent = heading;
        noteHeading.focus();

        ul.innerHTML = '';
        lines.forEach(line => ul.appendChild(createDraftLi(line)));

        // Remove the old note from notesArray and localStorage
        notesArray = notesArray.filter(note => String(note.id) !== noteCardId);       // Remove old note from array
        localStorage.setItem('notes', JSON.stringify(notesArray));

        noteCard.remove();     //remove old notecard
    }

    let deleteCardBtn = e.target.closest('.deleteBtn');

    if (deleteCardBtn) {      
        if (noteCard) {
            // Remove from notesArray and update localStorage
            notesArray = notesArray.filter(note => String(note.id) !== noteCardId);   // This removes the note with the matching id from your in-memory array
            
            localStorage.setItem('notes', JSON.stringify(notesArray));
            noteCard.remove()
        }
    }
});