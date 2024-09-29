#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .command('sys', 'Fetch and log system info', (yargs) => {
    return yargs
      .option('os-only', {
        alias: 'o',
        type: 'boolean',
        description: 'Display only the OS info',
      })
      .option('cpu-only', {
        alias: 'c',
        type: 'boolean',
        description: 'Display only the CPU info',
      })
      .option('mem-only', {
        alias: 'm',
        type: 'boolean',
        description: 'Display only the memory info',
      })
      .option('net-only', {
        alias: 'n',
        type: 'boolean',
        description: 'Display only the network info',
      })
      .option('disk', {
        alias: 'd',
        type: 'boolean',
        description: 'Display disk usage info',
      })
      .option('uptime', {
        alias: 'u',
        type: 'boolean',
        description: 'Display system uptime',
      })
      .option('processes', {
        alias: 'p',
        type: 'boolean',
        description: 'Display current processes',
      })
      .option('save', {
        alias: 's',
        type: 'string',
        description: 'Save system info to a file (provide a file path)',
      })
      .option('summary', {
        alias: 'S',
        type: 'boolean',
        description: 'Display a summary of system information',
      });
  })
  .help()
  .argv;

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function logSystemInfo() {
  let systemInfo = {};

  if (argv.osOnly) {
    systemInfo.os = `Operating System: ${os.type()} ${os.platform()} ${os.release()}`;
  }

  if (argv.cpuOnly) {
    systemInfo.cpu = os.cpus();
  }

  if (argv.memOnly) {
    systemInfo.memory = `Free: ${formatBytes(os.freemem())} / Total: ${formatBytes(os.totalmem())}`;
  }

  if (argv.netOnly) {
    systemInfo.network = os.networkInterfaces();
  }

  if (argv.disk) {
    const { execSync } = require('child_process');
    const diskInfo = execSync('wmic logicaldisk get size,freespace,caption', { encoding: 'utf-8' });
    systemInfo.disk = diskInfo;
  }

  if (argv.uptime) {
    systemInfo.uptime = `System Uptime: ${(os.uptime() / 3600).toFixed(2)} hours`;
  }

  if (argv.processes) {
    const { execSync } = require('child_process');
    const processes = execSync('tasklist', { encoding: 'utf-8' });
    systemInfo.processes = processes;
  }

  if (argv.summary) {
    systemInfo.summary = {
      os: `Operating System: ${os.type()} ${os.platform()} ${os.release()}`,
      cpu: os.cpus()[0].model,
      memory: `Free: ${formatBytes(os.freemem())} / Total: ${formatBytes(os.totalmem())}`,
      uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
    };
  }

  if (!argv.osOnly && !argv.cpuOnly && !argv.memOnly && !argv.netOnly && !argv.disk && !argv.uptime && !argv.processes && !argv.summary) {
    systemInfo.os = `Operating System: ${os.type()} ${os.platform()} ${os.release()}`;
    systemInfo.cpu = os.cpus();
    systemInfo.memory = `Free: ${formatBytes(os.freemem())} / Total: ${formatBytes(os.totalmem())}`;
    systemInfo.network = os.networkInterfaces();
    systemInfo.uptime = `System Uptime: ${(os.uptime() / 3600).toFixed(2)} hours`;
  }

  if (argv.save) {
    fs.writeFileSync(argv.save, JSON.stringify(systemInfo, null, 2));
    console.log(`System info saved to ${argv.save}`);
  } else {
    console.log(systemInfo);
  }
}

logSystemInfo();
