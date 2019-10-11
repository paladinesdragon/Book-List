// Book Class: represents a single book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: handle anything related to the UI
class UI {
    static displayBooks() {
        const books = Store.getBooks(); //gets books from local storage

        books.forEach((book) => UI.addBookToList(book)); // loops through each book object in the storedBooks array and runs the addBooksToList function on each book object.
    }

    static addBookToList(book){
        const list = document.getElementById('book-list'); //grabs the location of where the books are going to be inserted into the table body.

        const row = document.createElement('tr'); // createds a tr element in the table body to display each book object.

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `; // creates table data for each columns in the table

        list.appendChild(row); //place the row in the list location
    }

    static deleteBook(path) {
        //console.log(path[2]);
        path[2].remove(); // removed the book from the list using the triggered mouse event path array. Index 2 is the table row.
    }

    static showAlert(msg, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        //div.textContent = 'msg';
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        container.insertBefore(div, form);

        // alert vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }

    static clearFields() {
        document.getElementById('title').value = "";
        document.getElementById('author').value = "";
        document.getElementById('isbn').value = "";
    }
}

//Store Class: handles storage. In this case it is local storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}




// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.getElementById('book-form').addEventListener('submit', (e) =>
{
    //prevent post (default) when submit button is clicked
    e.preventDefault();
    
    //get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    // validate field aren't empty or null
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields','danger');
    } else {


    //Instatiate Book
    const book = new Book(title, author, isbn);

    //console.log(book);

    // Add book to UI
    UI.addBookToList(book);

    //Show successfull adding book
    UI.showAlert('Book Added', 'success');

    //Add book to Store
    Store.addBook(book);

    // Clear fields
    UI.clearFields();
    }
});

// Event: Remove a book
// if you try and grab the actual delete button it won't work as it is created for each book object added in each row and the event listener won't know which delete your referring to. So the event is added to the element above that, in this case the tdbody. Then using the event target to delete that book.
document.getElementById('book-list').addEventListener('click', (e) =>
{
    UI.deleteBook(e.path); // delete book from ui
    UI.showAlert('Book Removed','info');

    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});

