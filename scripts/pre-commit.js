const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { error } = require('console');

dayjs.extend(timezone);
dayjs.extend(utc);

const executeCommand = async (command) => {
    try {
        const stdout = await new Promise((res, rej) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    rej(error);
                } else {
                    res(stdout.trim());
                }
            });
        });
        return stdout;
    } catch (error) {
        throw error;
    }
};

const loadTemplate = async (filePath) => {
    try {
        const template = await fs.readFile(filePath, 'utf8');
        return yaml.parse(template);
    } catch {
        console.error("Failed to load Template: ", error);
        return null
    }
}

const create_questions = (template, frontmatter) => {
    return Object.keys(template).map(key => {
        const question = { ...template[key], name: key };
        if (frontmatter[key]) {
            question.default = frontmatter[key];
        }
        return question;
    });
};

const printAsciiArt = (filename) => {
    console.log(`
  
          ___          _           ______                      _   ___  ___        _    _               
         / _ \\        | |          |  ___|                    | |  |  \\/  |       | |  | |              
        / /_\\ \\ _   _ | |_   ___   | |_    _ __   ___   _ __  | |_ | .  . |  __ _ | |_ | |_   ___  _ __ 
        |  _  || | | || __| / _ \\  |  _|  | '__| / _ \\ | '_ \\ | __|| |\\/| | / _\` || __|| __| / _ \\| '__|
        | | | || |_| || |_ | (_) | | |    | |   | (_) || | | || |_ | |  | || (_| || |_ | |_ |  __/| |   
        \\_| |_/ \\__,_| \\__| \\___/  \\_|    |_|    \\___/ |_| |_| \\__|\\_|  |_/ \\__,_| \\__| \\__| \\___||_|   
                                                                                                         
                                                                                                         
  
     ------------------------------------------------------------
                          Current File: ${filename}
     ------------------------------------------------------------
    `);
  }

async function updateFrontMatter(file ,filePath, template, current_date) {
    const content = fs.readFileSync(filePath, 'utf8');
    const delimiter = '---';
    let frontMatter = {};
    let body = content;

    if (content.startsWith(delimiter)) {
        const end = content.indexOf(delimiter, delimiter.length);
        frontMatter = yaml.parse(content.slice(delimiter.length, end).trim());
        body = content.slice(end + delimiter.length).trim();
    } else {
        printAsciiArt(file);
        const questions = create_questions(template, frontMatter);
        const answers = await inquirer.prompt(questions);
        frontMatter = { ...answers, create_at: current_date };
    }

    frontMatter.update_at = current_date;
    const newContent = `${delimiter}\n${yaml.stringify(frontMatter)}${delimiter}\n\n${body}`;
    fs.writeFileSync(filePath, newContent);
    await executeCommand(`git add ${filePath}`);
}

(async () => {
    let FILES = (await executeCommand(`git diff --cached --name-only`))
        .split('\n')
        .filter((file) => file.endsWith('.mdx'));
    const template = await loadTemplate(path.resolve(__dirname, '../frontmatter_template.yaml'));
    const current_date = dayjs.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

    if (FILES.length === 0){
        await executeCommand(`pnpm lint`)
        process.exit(0);
    }
    
    for (const file of FILES) {
        await updateFrontMatter(file ,path.resolve(__dirname, `../${file}`), template, current_date);
    }
    await executeCommand(`pnpm lint`)
    process.exit(0)
})().catch(error => {
      console.error(error);
      process.exit(1);
});
