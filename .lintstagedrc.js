const { ESLint } = require('eslint')

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint()
  const ignoredFiles = await Promise.all(files.map((file) => eslint.isPathIgnored(file)))
  const filteredFiles = files.filter((_, i) => !ignoredFiles[i])
  return filteredFiles.join(' ')
}

module.exports = {
  '*': async (files) => {
    const filesToLint = await removeIgnoredFiles(files)
    return [`eslint ${filesToLint} --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix`]
  },
}
