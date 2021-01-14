import { execSync, exec } from "child_process"
import webpack from "./modules/webpack"
import figlet from "figlet"
import clear from "clear"
import { check, read } from "./modules/fs"
import babel from "./modules/babel"
import readline from "readline"
import path from "path"
import pack from "./modules/package"
import * as type from "./type/type"
clear()
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const config: type.RootObject = JSON.parse(read("html_starters.config.json"))
const fortnite = config?.DuildFileType || ["js", "html", "css", "img"]
let template: string = ""
rl.question("プロジェクトの名前を入力してください:", (a: string): void =>
{
    console.log(`Thank you!! start ${a}`)
    if (!check(a))
    {
        figlet("HTMLSTARTER", (err: any, data: any): void =>
        {
            if (err)
                console.log(err); console.log(data)
        })
        execSync(`mkdir ${a}`)
        const file = path.resolve(a)
        pack(file, a)
        webpack(file)
        execSync(`mkdir ${file}/src`)
        for (const iterator of fortnite)
        {
            execSync(`mkdir ${file}/src/${iterator}`)
            if (iterator !== "img")
            {
                if (iterator === "html")
                {
                    template = `
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello</title>
</head>

<body>
    <h1>Hello</h1>
</body>

</html>`
                }
                else if (iterator === "js")
                {
                    template = `
import '../css/index.css'
console.log('Hello')`
                }
                else if (iterator === "css")
                {
                    template = `
body {
    text-align: center;
}`
                }
                exec(`echo "${template}" >> ${file}/src/${iterator}/index.${iterator}`)
            }
        }
        babel(file)
        console.log(`cd ${a}\nnpm run demo`);
    }
    else if (check(a))
    {
        try
        {
            throw "すでに存在しています"
        } catch (error)
        {
            console.log(error)
        }
    }
    else if (a)
    {
        try
        {
            throw "フォルダ名を指定してください"
        } catch (error)
        {
            console.log(error)
        }
    }
    rl.close()
})