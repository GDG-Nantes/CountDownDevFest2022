export function toDataURL(src, callback) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.setAttribute('referrerpolicy', 'no-referrer');
        image.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            context.drawImage(this, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg');
            resolve(dataURL);
        };
        image.src = src;
    });
}

export function calculateDistanceBetweenToPoints(pointA, pointB) {
    const R = 6371e3; // metres
    const φ1 = (pointA.latitude * Math.PI) / 180; // φ, λ in radians
    const φ2 = (pointB.latitude * Math.PI) / 180;
    const Δφ = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
    const Δλ = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round((R * c) / 1000); // in metres
}
