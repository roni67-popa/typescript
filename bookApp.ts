class Book {
    public readonly id: string;
    public readonly createdAt: Date;

    constructor(
        public title: string, 
        public author: string
    ) {
        this.id = Math.random().toString(36).substring(2, 9).toUpperCase();
        this.createdAt = new Date();
    }

    public getFullInfo(): string {
        return `ID: ${this.id} | Название: ${this.title} | Автор: ${this.author}`;
    }
}

class BookStorage {
    private books: Book[] = [];

    public addBook(book: Book): void {
        this.books.push(book);
    }

    public getBooks(): Book[] {
        return this.books;
    }

    public getCount(): number {
        return this.books.length;
    }

    public isDuplicate(title: string, author: string): boolean {
        return this.books.some(b => 
            b.title.toLowerCase() === title.toLowerCase() && 
            b.author.toLowerCase() === author.toLowerCase()
        );
    }
}

class BookApp {
    private storage: BookStorage;
    
    private titleInput!: HTMLInputElement;
    private authorInput!: HTMLInputElement;
    private addBtn!: HTMLButtonElement;
    private errorBlock!: HTMLDivElement;
    private counter!: HTMLSpanElement;
    private container!: HTMLDivElement;

    constructor(storage: BookStorage) {
        this.storage = storage;
        this.createLayout(); 
        this.initElements(); 
        this.initEvents();   
    }

    private createLayout() {
        document.body.innerHTML = `
            <div style="font-family: sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
                <h2>📚 Список книг</h2>
                <input id="titleInp" type="text" placeholder="Название книги" style="width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box;">
                <input id="authorInp" type="text" placeholder="Автор книги" style="width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box;">
                <button id="addBtn" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; cursor: pointer;">Добавить</button>
                <div id="errorMsg" style="color: red; margin-top: 10px; font-size: 14px;"></div>
                <p>Всего книг: <span id="count">0</span></p>
                <div id="bookList" style="margin-top: 20px;"></div>
            </div>
        `;
        }

    private initElements() {
        this.titleInput = document.getElementById('titleInp') as HTMLInputElement;
        this.authorInput = document.getElementById('authorInp') as HTMLInputElement;
        this.addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        this.errorBlock = document.getElementById('errorMsg') as HTMLDivElement;
        this.counter = document.getElementById('count') as HTMLSpanElement;
        this.container = document.getElementById('bookList') as HTMLDivElement;
    }

    private initEvents() {
        this.addBtn.onclick = () => this.handleButtonClick();
    }

    private normalize(str: string): string {
        return str.trim().replace(/\s+/g, ' ');
    }

    private showError(msg: string) {
        this.errorBlock.innerText = msg;
    }

    private handleButtonClick() {
        this.showError(""); 

        const title = this.normalize(this.titleInput.value);
        const author = this.normalize(this.authorInput.value);

        if (!title || !author) {
            this.showError("Поля не могут быть пустыми!");
            return;
        }

        if (this.storage.isDuplicate(title, author)) {
            this.showError("Такая книга уже есть в списке");
            return;
        }

        const newBook = new Book(title, author);
        this.storage.addBook(newBook);
        
        this.titleInput.value = "";
        this.authorInput.value = "";
        this.render();
    }

    private render() {
        this.counter.innerText = this.storage.getCount().toString();
        this.container.innerHTML = "";
        this.storage.getBooks().forEach(book => {
            const card = document.createElement('div');
         
            card.style.cssText = "border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 6px; background: #fff; text-align: left; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
   
            card.innerHTML = `
                <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px;">${book.title}</div>
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Автор: ${book.author}</div>
                <div style="font-size: 11px; color: #999; border-top: 1px dashed #eee; padding-top: 5px;">ID: ${book.id}</div>
            `;
            
            this.container.appendChild(card);
        });
    }
}

interface User {
    id: number;
    login: string;
}

const mockUsers: User[] = [
    { id: 1, login: "admin" },
    { id: 2, login: "john_doe" },
    { id: 3, login: "alice" }
];

class UserAPI {
    public static getAllUsers() {
        return mockUsers.length > 0 ? mockUsers : "Пользователей еще нет";
    }

    public static getUserById(id: number) {
        const user = mockUsers.find(u => u.id === id);
        return user ? user : "Пользователь не найден";
    }

    public static getUserByLogin(login: string) {
        const user = mockUsers.find(u => u.login === login);
        return user ? user : "Пользователь не найден";
    }

    public static deleteUser(id: number) {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index !== -1) {
            const login = mockUsers[index].login;
            mockUsers.splice(index, 1);
            return `Пользователь @${login} успешно удален`;
        }
        return "Пользователь не найден";
    }
}

const myStorage = new BookStorage();
const myApp = new BookApp(myStorage);

console.log("--- Тест API Пользователей ---");
console.log("Все юзеры:", UserAPI.getAllUsers());
console.log("Юзер с ID 2:", UserAPI.getUserById(2));
console.log("Удаление юзера 1:", UserAPI.deleteUser(1));
console.log("Список после удаления:", UserAPI.getAllUsers());