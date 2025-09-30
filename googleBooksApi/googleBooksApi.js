import { LightningElement, track } from 'lwc';

export default class GoogleBooksSearch extends LightningElement {
    @track searchTerm = '';
    @track books = [];
    @track error;

    handleInputChange(event) {
        this.searchTerm = event.target.value;
    }

    async searchBooks() {
        this.error = null;
        this.books = [];

        if (!this.searchTerm) {
            this.error = 'Please enter a search term.';
            return;
        }

        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.searchTerm)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.items) {
                this.books = data.items.map(item => ({
                    id: item.id,
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'
                }));
            } else {
                this.error = 'No books found.';
            }
        } catch (err) {
            console.error(err);
            this.error = 'Error retrieving books. Try again later.';
        }
    }
}
