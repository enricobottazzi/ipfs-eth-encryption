class Adverts {
    constructor() {
        this.adverts = [];
    }
    add(advert) {
        this.adverts.push(advert);
    }
    remove(advert) {
        this.adverts = this.adverts.filter(ad => ad !== advert);
    }
    clear() {
        this.adverts = [];
    }
    forEach(fn) {
        this.adverts.forEach(ad => fn(ad.service));
    }
    async stopAll() {
        await Promise.all(this.adverts.map(async (ad) => await ad.stop()));
    }
}
export const adverts = new Adverts();
//# sourceMappingURL=adverts.js.map