const chalk = require('chalk')
const execa = require('execa')
const semver = require('semver')

export const GitValidators = [
  {
    title: 'Checking Git version',
    task: async (ctx: any, task: any) => {
      const version = await checkGitVersion()
      task.title += chalk.dim(` [${version}]`)
    }
  },
  {
    title: 'Checking Git LFS version',
    task: async (ctx: any, task: any) => {
      const version = await checkLFSVersion()
      task.title += chalk.dim(` [${version}]`)
    }
  }
]

export async function checkGitVersion() : Promise<string> {
  try {
    const result = await execa('git', ['--version'])
    return Promise.resolve(result.stdout.split(' ').pop())
  } catch (error) {
    throw new Error('Check that Git is installed in your system')
  }
}

export async function checkLFSVersion() : Promise<string> {
  try {
    const result = await execa('git-lfs', ['--version'])
    return matchVersion(result.stdout, /git-lfs\/([\.\d]+).*/, '2.5.1', 'Invalid Git LFS version. Please update to version 2.5.1 or above')
  } catch (error) {
    throw new Error('Check that Git LFS is installed in your system')
  }
}

export async function checkLFSFilters() : Promise<boolean> {
  try {
    const result = await execa('git', ['config', '--get-regexp', 'filter.lfs'])
    return Promise.resolve(result.stdout.length > 0)
  } catch (error) {
    return Promise.resolve(false)
  }
}

export async function checkHelperVersion() : Promise<string> {
  try {
    const result = await execa('git-credential-netlify', ['--version'])
    return matchVersion(result.stdout, /git-credential-netlify\/([\.\d]+).*/, '0.1.1', `Invalid Netlify's Git Credential version. Please update to version 2.5.1 or above`)
  } catch (error) {
    throw new Error(`Check that Netlify's Git Credential helper is installed and updated to the latest version`)
  }
}

function matchVersion(out: string, regex: RegExp, version: string, message: string) : Promise<string> {
  const match = out.match(regex)
  if (!match || match.length != 2 || semver.lt(match[1], version)) {
    throw new Error(message)
  }
  return Promise.resolve(match[1])
}
