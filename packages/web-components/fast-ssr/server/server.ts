import { Readable } from "stream";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const __dirname = path.resolve(path.dirname(""));
const PORT = 8080;
function handleRequest(req: Request, res: Response) {
    res.set("Content-Type", "text/html");
    const stream = (Readable as any).from("hello world");
    stream.on("readable", function (this: any) {
        let data: string;

        while ((data = this.read())) {
            res.write(data);
        }
    });

    stream.on("close", () => res.end());
    stream.on("error", (e: Error) => {
        console.error(e);
        process.exit(1);
    });
}

function handlePathRequest(
    mapPath: string,
    contentType: string,
    req: Request,
    res: Response
) {
    res.set("Content-Type", contentType);
    fs.readFile(path.resolve(__dirname, mapPath), { encoding: "utf8" }, (err, data) => {
        const stream = (Readable as any).from(data);
        stream.on("readable", function (this: any) {
            while ((data = this.read())) {
                res.write(data);
            }
        });
        stream.on("close", () => res.end());
        stream.on("error", (e: Error) => {
            console.error(e);
            process.exit(1);
        });
    });
}

const app = express();
app.get("/", handleRequest);
app.get("/fast-style", (req: Request, res: Response) =>
    handlePathRequest("./src/fast-style/index.fixture.html", "text/html", req, res)
);
app.get("/fast-style.js", (req: Request, res: Response) =>
    handlePathRequest(
        "./dist/esm/fast-style/index.js",
        "application/javascript",
        req,
        res
    )
);
app.get("/fast-command-buffer", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fast-command-buffer/index.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/fast-command-buffer.js", (req: Request, res: Response) =>
    handlePathRequest(
        "./dist/esm/fast-command-buffer/index.js",
        "application/javascript",
        req,
        res
    )
);
app.listen(PORT);