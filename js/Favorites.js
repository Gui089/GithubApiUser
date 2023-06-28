export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }));
    }
}


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem
            ('@github-favorites:')) || [];
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username);

            console.log(userExists);

            if(userExists) return

            const user = await GithubUser.search(username);

            if(user.login === undefined) {
                throw new Error('Usuario nao encontrado');
            }

            this.entries = [user, ...this.entries]
            this.update();
            this.save();


        } catch(error) {
            alert(error.message);
        }
    
    }

    delete(user) {
        this.entries= this.entries.filter(entry => entry.login !== user.login);
         
        this.update();
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector('table tbody');

        this.update();
        this.onAdd();
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input');

            this.add(value);
        }
    }

    update() {
       this.removeAllTr();


        this.entries.forEach( user => {
        const row = this.creteRow();

        row.querySelector('.user img').scr = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href =  `https://github.com/${user.login}.png`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.respositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers
        
        row.querySelector('.remove').onclick = () => {
           const isOk = confirm('Tem certeza que deejsa deletar essa linha ?');
           if(isOk) {
            this.delete(user);
           }
        }

        this.tbody.append(row);
    });

    }

    creteRow() {
        const tr = document.createElement('tr');

        tr.innerHTML = ` 
        <td class="user">
            <img src="https://github.com/Gui089.png" alt="">
            <a href="https://github.com/Gui089" target="_blank">
                <p>Guilherme Coutinho</p>
                <span>Gui089</span>
            </a>
        </td>
        <td class="respositories">
            70
        </td>
        <td class="followers">
            3
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>
        `
        
        return tr;

    }

    removeAllTr() {
        
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });

    }
}