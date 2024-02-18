"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetData = exports.SendData = exports.pieChart = exports.getasdf = exports.getIngredients = void 0;
const functions = __importStar(require("firebase-functions"));
const cors = require('cors')({ origin: true });
const admin = __importStar(require("firebase-admin"));
const echarts = __importStar(require("echarts"));
const axios_1 = __importDefault(require("axios"));
admin.initializeApp();
exports.getIngredients = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        const number = request.query.number;
        let itemRes = await fetchData(number);
        //let img = await fetchDataPic(number);
        console.log(itemRes);
        for (let i = 0; i < itemRes.product.ingredients_tags.length; i++) {
            itemRes.product.ingredients_tags[i] = removeEN(itemRes.product.ingredients_tags[i]);
        }
        let resdata = {
            grade: itemRes.product.nutriscore_data.grade,
            ecoscore_grade: itemRes.product.ecoscore_grade,
            ingredients: itemRes.product.ingredients_tags,
            //img : img
        };
        response.send(resdata);
    });
});
exports.getasdf = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        const number = request.query.number;
        let itemRes = await fetchData(number);
        //let img = await fetchDataPic(number);
        console.log(itemRes);
        for (let i = 0; i < itemRes.product.ingredients_tags.length; i++) {
            itemRes.product.ingredients_tags[i] = removeEN(itemRes.product.ingredients_tags[i]);
        }
        let resdata = {
            grade: itemRes.product.nutriscore_data.grade,
            ecoscore_grade: itemRes.product.ecoscore_grade,
            ingredients: itemRes.product.ingredients_tags,
            //categories_tags: removeEN(itemRes.product.categories_tags[0])
            //img : img
        };
        response.send(resdata);
    });
});
exports.pieChart = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const number = request.query.number;
        let itemResult = await fetchData(number);
        console.log(itemResult);
        for (let i = 0; i < itemResult.product.ingredients_tags.length; i++) {
            itemResult.product.ingredients_tags[i] = removeEN(itemResult.product.ingredients_tags[i]);
        }
        console.log(typeof itemResult.product.ingredients[0]);
        let data = makeDataForChart(itemResult.product.ingredients);
        const option = {
            // title: {
            //     text: 'nutrient content',
            //     subtext: 'Hey',
            //     left: 'right'
            // },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                right: 'right'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: data
                }
            ]
        };
        const chart = echarts.init(null, null, {
            renderer: 'svg',
            ssr: true,
            width: 450,
            height: 450
        });
        chart.setOption(option);
        const svgStr = chart.renderToSVGString();
        response.send(svgStr);
    });
});
exports.SendData = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const postData = request.body;
        if (typeof postData !== 'object' || postData === null) {
            response.status(400).send("bruh it's not an object, i can't take it");
            return;
        }
        //response.set('Access-Control-Allow-Origin', '*');
        console.log('get query collection', postData);
        const data = {
            "collection": "KeyFieldDB",
            "database": "finalProductionDB",
            "dataSource": "pioneer",
            "document": postData
        };
        const config = {
            method: 'post',
            url: 'https://us-west-2.aws.data.mongodb-api.com/app/data-ekdhi/endpoint/data/v1/action/insertOne',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': 'D9lE6zzkrBns3pihzoYb8XX8H4qCuKJmy7FfEYrmlZcbBGVl3JysrbN20clAw2wu',
                'Accept': 'application/json'
            },
            data: JSON.stringify(data)
        };
        (0, axios_1.default)(config)
            .then(function (dataResponse) {
            console.log("data insert response", JSON.stringify(dataResponse.data));
            response.send(JSON.stringify(dataResponse.data));
        })
            .catch(function (error) {
            let errorRes = {
                message: error.message,
                code: error.code,
                status: error.status
            };
            response.status(500).send(errorRes);
        });
    });
});
exports.GetData = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const inputValue = request.query.team_number;
        //const HeaderDatabase = request.query.Database;
        console.log("team_number|tag", JSON.stringify(inputValue));
        const data = JSON.stringify({
            "collection": "KeyFieldDB",
            "database": "finalProductionDB",
            "dataSource": "pioneer",
            // "filter": {
            //     "inputValue": inputValue
            // }
        });
        console.log("dataa|tag", JSON.stringify(data));
        const config = {
            method: 'post',
            url: 'https://us-west-2.aws.data.mongodb-api.com/app/data-ekdhi/endpoint/data/v1/action/find',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': 'D9lE6zzkrBns3pihzoYb8XX8H4qCuKJmy7FfEYrmlZcbBGVl3JysrbN20clAw2wu',
                'Accept': 'application/json'
            },
            data: data
        };
        (0, axios_1.default)(config)
            .then(function (dataResponse) {
            console.log(JSON.stringify(dataResponse.data));
            response.send(JSON.stringify(dataResponse.data));
        })
            .catch(function (error) {
            let errorRes = {
                message: error.message,
                code: error.code,
                status: error.status
            };
            response.status(500).send(errorRes);
        });
    });
});
async function fetchData(barCode) {
    console.log("begin fetchdata");
    try {
        const response = await fetch('https://world.openfoodfacts.net/api/v2/product/' + barCode);
        const document = response.json();
        return document;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function removeEN(a) {
    let result = "";
    for (let i = 3; i < a.length; i++) {
        result = result + a.charAt(i);
    }
    return result;
}
function makeDataForChart(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        result[i] = { value: Number(data[i].percent_estimate), name: removeEN(data[i].id).toString() };
    }
    return result;
}
// async function fetchDataPic(barCode: any) {
//     console.log("beginning of pic")
//     try {
//         barCode.toString();
//         if(barCode.toString().length>=9){
//             barCode = breakDown(barCode)
//         }
//
//         console.log("fucker", barCode)
//         let dude = 'https://images.openfoodfacts.org/images/products/'+barCode+ "/front_fr.4.full.jpg"
//         console.log("ddue",dude)
//         const response = await fetch(dude);
//         const document = response.json();
//         return document;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
// function breakDown(barCode: any){
//     console.log("beginning of breakdown")
//     let stringBar: string = barCode.toString();
//     console.log("12?",stringBar)
//     let result:string = "";
//     for(let i=0;i<stringBar.length;i++){
//         console.log("yea bub")
//         result = result + stringBar.charAt(i)
//
//         //|| (i==8)
//         if((i==2) || (i==5)  ){
//             if(stringBar.length != 9) {
//                 result = result + "/";
//             }
//             console.log("alskhgfkjasehfliasegf",stringBar.length)
//         }
//
//     }
//     console.log("huh")
//     return result;
// }
//# sourceMappingURL=index.js.map