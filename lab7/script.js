function counter(n) {
    let current = n;
    const display = document.getElementById('log-output');
    display.textContent = current;
    
    const interval = setInterval(() => {
        current--;
        display.textContent = current;
        if (current === 0) {
            clearInterval(interval);
        }
    }, 1000);
}

document.getElementById('start-counter').addEventListener('click', () => {
    const n = parseInt(document.getElementById('counter-input').value) || 5;
    document.getElementById('log-output').textContent = '...';
    counter(n);
});

function createCounter(n) {
    let current = n;
    let intervalId = null;
    const display = document.getElementById('counter-display');

    return {
        start() {
            if (intervalId) return;
            display.textContent = current;
            intervalId = setInterval(() => {
                current--;
                display.textContent = current;
                if (current <= 0) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }, 1000);
        },
        pause() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            current = n;
            display.textContent = '--';
        }
    };
}

let counterObj = null;
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');

document.getElementById('create-btn').addEventListener('click', () => {
    const n = parseInt(document.getElementById('create-input').value) || 10;
    counterObj = createCounter(n);
    document.getElementById('counter-display').textContent = n;
    startBtn.disabled = false;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
});

startBtn.addEventListener('click', () => counterObj && counterObj.start());
pauseBtn.addEventListener('click', () => counterObj && counterObj.pause());
stopBtn.addEventListener('click', () => {
    if (counterObj) {
        counterObj.stop();
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    }
});

function delay(N) {
    return new Promise(resolve => {
        setTimeout(resolve, N * 1000);
    });
}

document.getElementById('delay-test').addEventListener('click', async () => {
    alert('Ждите 3 секунды...');
    await delay(3);
    alert('3 секунды прошло!');
});

document.getElementById('delay-counter-btn').addEventListener('click', async () => {
    const n = parseInt(document.getElementById('delay-counter-input').value) || 5;
    const display = document.getElementById('delay-counter-display');
    display.textContent = n;
    let current = n;
    while (current >= 0) {
        display.textContent = current;
        if (current > 0) await delay(1);
        current--;
    }
});

document.getElementById('github-repo-btn').addEventListener('click', async () => {
    const username = document.getElementById('github-user').value.trim();
    if (!username) return alert('Введите имя пользователя');
    
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error(`Пользователь ${username} не найден`);
        const user = await userResponse.json();
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=asc`);
        if (!reposResponse.ok) throw new Error('Не удалось получить репозитории');
        const repos = await reposResponse.json();
        
        if (repos.length === 0) {
            alert(`У пользователя ${username} нет публичных репозиториев`);
        } else {
            alert(`Первый репозиторий ${username}: ${repos[0].name}`);
        }
    } catch (err) {
        alert(`Ошибка: ${err.message}`);
    }
});

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

async function loadJson(url) {
    const response = await fetch(url);
    if (response.status == 200) {
        return response.json();
    } else {
        throw new HttpError(response);
    }
}

async function getGithubUser() {
    while (true) {
        let name = prompt("Введите логин?", "iliakan");
        if (name === null) return null;
        
        try {
            const user = await loadJson(`https://api.github.com/users/${name}`);
            alert(`Полное имя: ${user.name || 'не указано'}.`);
            return user;
        } catch (err) {
            if (err instanceof HttpError && err.response.status == 404) {
                alert("Такого пользователя не существует, пожалуйста, повторите ввод.");
            } else {
                throw err;
            }
        }
    }
}

document.getElementById('get-user-btn').addEventListener('click', () => {
    getGithubUser().catch(err => alert(`Глобальная ошибка: ${err.message}`));
});