const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        return '0';
    }

    if (isNaN(num)) {
        return '0';
    }

    const rounded = Math.round(num * 1000) / 1000;

    const fixed = rounded.toFixed(2);

    const trimmed = fixed.replace(/\.?0+$/, '');

    return trimmed;
};

export { formatNumber };