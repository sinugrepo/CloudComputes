module.exports = function parseName(basename, delimiter = '.') {
    if (delimiter === '-') {
        return basename
            .split(delimiter)
            .map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1)
            })
            .join('')
    } else {
        return basename
            .split(delimiter)
            .map(word => {
                if (word.indexOf('-') !== -1) {
                    return parseName(word, '-')
                }
                return word.charAt(0).toUpperCase() + word.slice(1)
            })
            .join('')
    }
}
  