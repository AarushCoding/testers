// notifications.js

export class ToastNotification {
    constructor() {
        // Ensure container exists
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        this.container = document.getElementById('toast-container');
    }

    show(title, message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Define colors/icons based on type
        const config = {
            success: { icon: 'fa-check-circle', color: '#4ade80' },
            error: { icon: 'fa-exclamation-circle', color: '#ff8080' },
            info: { icon: 'fa-info-circle', color: '#ffff80' }
        };

        const { icon, color } = config[type] || config.info;

        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${icon}" style="color: ${color}"></i>
                <div class="toast-text-group">
                    <span class="toast-title" style="color: ${color}">${title}</span>
                    <span class="toast-message">${message}</span>
                </div>
            </div>
            <button class="toast-close">&times;</button>
            <div class="toast-progress" style="background: ${color}"></div>
        `;

        this.container.appendChild(toast);

        // Progress bar animation
        const progress = toast.querySelector('.toast-progress');
        setTimeout(() => progress.style.width = '0%', 10);
        progress.style.transition = `width ${duration}ms linear`;

        const autoClose = setTimeout(() => this.close(toast), duration);

        toast.querySelector('.toast-close').onclick = () => {
            clearTimeout(autoClose);
            this.close(toast);
        };
    }

    close(toast) {
        toast.classList.add('closing');
        toast.onanimationend = () => toast.remove();
    }
}

// Create a single instance to be used everywhere
export const toast = new ToastNotification();
