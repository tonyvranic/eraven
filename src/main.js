document.querySelectorAll('[er-method]').forEach(async el => {
    const tag = el.getAttribute('er-method');

    try {
        const mod = await import(`./webc/${tag}/${tag}.js`);
        mod.default(el);
    } catch {
        try {
            const mod = await import(`./webc/_utils/${tag}.js`);
            mod.default(el);
        } catch {
            console.error(`No JS found for "${tag}"`);
        }
    }
});