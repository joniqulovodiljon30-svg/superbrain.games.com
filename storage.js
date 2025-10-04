// LocalStorage boshqaruvi
class StorageManager {
    constructor() {
        this.prefix = 'memory_master_';
        this.checkStorage();
    }

    // Storage mavjudligini tekshirish
    checkStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (error) {
            console.error('LocalStorage is not available:', error);
            this.useFallback();
            return false;
        }
    }

    // Fallback storage (agar LocalStorage ishlamasa)
    useFallback() {
        this.fallbackStorage = {};
        console.warn('Using fallback storage');
    }

    // Ma'lumot saqlash
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            
            if (this.fallbackStorage) {
                this.fallbackStorage[storageKey] = value;
                return true;
            }
            
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Saqlashda xatolik:', error);
            
            // Fallback ga o'tish
            if (!this.fallbackStorage) {
                this.useFallback();
                this.fallbackStorage[this.prefix + key] = value;
            }
            return false;
        }
    }

    // ... qolgan funksiyalar o'zgarmaydi
}
