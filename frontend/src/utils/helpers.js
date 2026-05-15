export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};
export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
export const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
export const getInitials = (name) => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
export const groupBy = (arr, key) => {
    return arr.reduce((acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
};
