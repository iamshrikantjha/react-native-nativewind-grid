
const parseArbitrary = (cls, prefix) => {
    const regex = new RegExp(`^${prefix}\\[(.+)\\]$`);
    const match = cls.match(regex);
    if (match) {
        const val = match[1] || '0';
        const num = parseInt(val, 10);
        return isNaN(num) ? undefined : num;
    }
    return undefined;
};

console.log('Testing grid-cols-[16]:', parseArbitrary('grid-cols-[16]', 'grid-cols-'));
console.log('Testing gap-[2px]:', parseArbitrary('gap-[2px]', 'gap-')); // Should return 2
