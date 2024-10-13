/**
 * @name YouTubeStreamPlayer
 * @author pixl.rs
 * @version 1.0.0
 * @description Resizable Youtube Embed LoFi Stream made by Pixl
 */

module.exports = class YouTubeStreamPlayer {
    constructor() {
        this.playerWindow = null; // Для накладання
        this.minimizeButton = null; // Для кнопки згортання
        this.isMinimized = false; // Мінімізувати статус
        this.player = null; // Плеєр YouTube
    }

    // Функція, яка викликається під час запуску плагіна
    start() {
        this.createButton();
        this.loadYouTubeAPI(); // YouTube API навантажений
    }

    // Деактивувати плагін
    stop() {
        this.removeButton();
        this.closePlayerWindow();
    }

    // Кнопка «Створити
    createButton() {
        const button = document.createElement('div');
        button.id = 'youtube-stream-player-button';
        button.innerHTML = 'Play YouTube Stream';
        button.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            z-index: 1000;
            background-color: #7289DA;
            color: white;
            padding: 10px;
            border-radius: 5px;
        `;
        
        button.onclick = () => this.openPlayerWindow();
        document.body.appendChild(button);
    }

    // Кнопка «Видалити
    removeButton() {
        const button = document.getElementById('youtube-stream-player-button');
        if (button) {
            button.remove();
        }
    }

    // Відкрити вікно програвача
    openPlayerWindow() {
        if (this.playerWindow) {
            this.closePlayerWindow();
        }

        // Створіть накладення з iframe для потоку YouTube
        this.playerWindow = document.createElement('div');
        this.playerWindow.id = 'youtube-stream-overlay';
        this.playerWindow.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            height: 225px;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: move; /* Möglichkeit zum Verschieben hinzufügen */
        `;

        // Дозволяє переміщати вікно
        this.playerWindow.onmousedown = (e) => this.startDrag(e);

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&enablejsapi=1'; // URL-адреса потоку YouTube за допомогою JS API
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay';

        // Створити кнопку згортання
        this.minimizeButton = document.createElement('button');
        this.minimizeButton.innerText = 'Minimize';
        this.minimizeButton.style = `
            margin: 10px;
            padding: 5px 10px;
            background-color: #7289DA;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        this.minimizeButton.onclick = () => this.minimizePlayerWindow();

        this.playerWindow.appendChild(iframe);
        this.playerWindow.appendChild(this.minimizeButton);
        document.body.appendChild(this.playerWindow);
        
        // Чекає, поки завантажиться iframe, щоб встановити гучність
        this.player = new YT.Player(iframe, {
            events: {
                'onReady': (event) => this.setVolume(event.target),
            }
        });
    }

    // YouTube API навантажений
    loadYouTubeAPI() {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
    }

    // Встановіть гучність
    setVolume(player) {
        player.setVolume(25); // Встановіть гучність на 25
    }

    // Згорнути вікно програвача
    minimizePlayerWindow() {
        this.isMinimized = true;
        this.playerWindow.style.display = 'none'; // Приховати накладання
        this.createRestoreButton(); // Створити кнопку для відновлення
    }

    // Створити кнопку для відновлення
    createRestoreButton() {
        const restoreButton = document.createElement('div');
        restoreButton.id = 'youtube-stream-restore-button';
        restoreButton.innerHTML = 'Restore YouTube Stream';
        restoreButton.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            z-index: 1000;
            background-color: #7289DA;
            color: white;
            padding: 10px;
            border-radius: 5px;
        `;
        
        restoreButton.onclick = () => this.restorePlayerWindow();
        document.body.appendChild(restoreButton);
    }

    // Відновити вікно програвача
    restorePlayerWindow() {
        this.isMinimized = false;
        this.playerWindow.style.display = 'flex'; // Показати накладання
        const restoreButton = document.getElementById('youtube-stream-restore-button');
        if (restoreButton) {
            restoreButton.remove(); // Видалити кнопку відновлення
        }
    }

    // Закрити вікно програвача
    closePlayerWindow() {
        if (this.playerWindow) {
            this.playerWindow.remove();
            this.playerWindow = null;
        }
        const restoreButton = document.getElementById('youtube-stream-restore-button');
        if (restoreButton) {
            restoreButton.remove();
        }
    }

    // Функція для переміщення вікна
    startDrag(e) {
        const shiftX = e.clientX - this.playerWindow.getBoundingClientRect().left;
        const shiftY = e.clientY - this.playerWindow.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            this.playerWindow.style.left = pageX - shiftX + 'px';
            this.playerWindow.style.top = pageY - shiftY + 'px';
        };

        const onMouseMove = (e) => {
            moveAt(e.pageX, e.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    }
};
