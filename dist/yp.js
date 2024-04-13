"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const cheerio_1 = require("cheerio");
const ypHost = 'https://yellowpages.vn';
function fetchCategoriesByLetter(letter_1) {
    return __awaiter(this, arguments, void 0, function* (letter, pageIndex = 1) {
        let url = `${ypHost}/${letter}?page=${pageIndex}`;
        try {
            const response = yield (0, node_fetch_1.default)(url);
            const html = yield response.text();
            console.log(html);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    });
}
function convertCategoriesToJson(htmlCategories) {
    const $ = cheerio_1.default.load(htmlCategories);
    // Your logic to parse HTML and convert it to JSON goes here
    return [];
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield fetchCategoriesByLetter('A');
}))();
