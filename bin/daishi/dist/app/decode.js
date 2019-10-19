module.exports = {
    decodeMinimal: (str, functions) => {
        str = functions.formatString(str);
        return str.replace(/(&quot;|&amp;)/g, (match) => {
            return {
                '&quot;': '"',
                '&amp;': '&'
            }[match];
        });
    },
    decodeHTML: (str, functions) => {
        str = functions.formatString(str);
        return str.replace(/(&gt;|&lt;|&quot;|&#x60;|&#x27;|&amp;)/g, (match) => {
            return {
                '&gt;': '>',
                '&lt;': '<',
                '&quot;': '"',
                '&#x60;': '`',
                '&#x27;': "'",
                '&amp;': '&'
            }[match];
        });
    }
};