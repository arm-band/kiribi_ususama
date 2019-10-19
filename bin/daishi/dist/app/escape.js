module.exports = {
    escapeMinimal: (str, functions) => {
        str = functions.formatString(str);
        return str.replace(/[&"]/g, (match) => {
            return {
                '&': '&amp;',
                '"': '&quot;'
            }[match];
        });
    },
    escapeHTML: (str, functions) => {
        str = functions.formatString(str);
        return str.replace(/[&'`"<>]/g, (match) => {
            return {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;'
            }[match];
        });
    }
};