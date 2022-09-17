function GetBook(database) {
    return (call, callback) => {
        try {
            const { bookId } = call.request;
            const book = assertBook(database, bookId);
            return callback(null, { books: book });
        } catch (error) {
            return callback(error, null);
        }
    };
}

function DeleteBook(database) {
    return (call, callback) => {
        const { bookId } = call.request;
        try {
            assertBook(database, bookId);
            database.deleteBook(bookId);
            database.save();
            return callback(null, {});
        } catch (error) {
            return callback(error, null);
        }
    };
}

function ListBook(database) {
    return (_, callback) => callback(null, { books: database.listBooks() });
}

function CreateBook(database) {
    return (call, callback) => {
        const { book } = call.request;
        try {
            const newBook = database.addBook(book);
            database.save();
            return callback(null, { books: newBook });
        } catch (error) {
            return callback(error, null);
        }
    };
}

function UpdateBook(database) {
    return (call, callback) => {
        const { bookId, data } = call.request;
        try {
            assertBook(database, bookId);
            const newBook = database.updateBook(bookId, data);
            return callback(null, { books: newBook });
        } catch (error) {
            return callback(error, null);
        }
    };
}

function assertBook(database, id) {
    const author = database.getBook(id);
    if (!author) throw new Error(`Book ${id} not found`);
    return author;
}

module.exports = (databaseInstance) => ({
    GetBook: GetBook(databaseInstance),
    UpdateBook: UpdateBook(databaseInstance),
    DeleteBook: DeleteBook(databaseInstance),
    ListBook: ListBook(databaseInstance),
    CreateBook: CreateBook(databaseInstance),
});
