import { ExtensionContext, workspace, window } from 'vscode';
import * as fs from "fs";

export class Book {
    curr_page_number: number | undefined = 1;
    page_size: number | undefined = 50;
    page = 0;
    start = 0;
    end = this.page_size;
    filePath: string | undefined = "";
    extensionContext: ExtensionContext;

    constructor(extensionContext: ExtensionContext) {
        this.extensionContext = extensionContext;
    }

    getSize(text: string) {
        let size = text.length;
        this.page = Math.ceil(size / this.page_size!);
    }

    getFileName() {
        var file_name: string | undefined = this.filePath!.split("/").pop();
        console.log(file_name);
    }

    getPage() {
        this.curr_page_number = workspace.getConfiguration().get('thiefBook.currPageNumber');
        // this.curr_page_number = this.extensionContext.globalState.get("book_page_number", 1);
    }

    updatePage(type: string) {
        var page = 0;

        if (type === "previous") {
            if (this.curr_page_number! <= 1) {
                page = 1;
            } else {
                page = this.curr_page_number! - 1;
            }
        } else if (type === "next") {
            if (this.curr_page_number! >= this.page) {
                page = this.page;
            } else {
                page = this.curr_page_number! + 1;
            }
        }

        workspace.getConfiguration().update('thiefBook.currPageNumber', page, true);
        // this.extensionContext.globalState.update("book_page_number", page);
    }

    getStartEnd() {
        this.start = this.curr_page_number! * this.page_size!;
        this.end = this.curr_page_number! * this.page_size! - this.page_size!;
    }

    readFile() {
        if (this.filePath === "" || typeof (this.filePath) === "undefined") {
            window.showWarningMessage("请填写TXT格式的小说文件路径 & Please fill in the path of the TXT format novel file");
        }

        var data = fs.readFileSync(this.filePath!, 'utf-8');
        var text = data.toString().replace(/\n/g, "").replace(/\r/g, "").replace(/　　/g, "").replace(/ /g, "");
        return text;
    }

    init() {
        this.filePath = workspace.getConfiguration().get('thiefBook.filePath');
        this.page_size = workspace.getConfiguration().get('thiefBook.pageSize');
    }

    getPreviousPage() {
        this.init();

        let text = this.readFile();

        this.getSize(text);
        this.getPage();
        this.getStartEnd();

        var page_info = this.curr_page_number!.toString() + "/" + this.page.toString();

        this.updatePage("previous");
        return text.substring(this.start, this.end) + "    " + page_info;
    }

    getNextPage() {
        this.init();

        let text = this.readFile();

        this.getSize(text);
        this.getPage();
        this.getStartEnd();

        var page_info = this.curr_page_number!.toString() + "/" + this.page.toString();

        this.updatePage("next");

        return text.substring(this.start, this.end) + "    " + page_info;
    }
}