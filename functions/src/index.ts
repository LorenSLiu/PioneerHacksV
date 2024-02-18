import * as functions from "firebase-functions";
const cors = require('cors')({origin: true});
import * as admin from 'firebase-admin';
import * as echarts from 'echarts';
import axios from "axios";
admin.initializeApp();

export const getIngredients = functions.https.onRequest(async (request, response) => {cors(request, response, async () => {
    const number = request.query.number;
    let itemRes = await fetchData(number);
    //let img = await fetchDataPic(number);
    console.log(itemRes);
    for(let i=0;i<itemRes.product.ingredients_tags.length;i++){
        itemRes.product.ingredients_tags[i] = removeEN(itemRes.product.ingredients_tags[i]);
    }
    let resdata = {
        grade: itemRes.product.nutriscore_data.grade,
        ecoscore_grade: itemRes.product.ecoscore_grade,
        ingredients: itemRes.product.ingredients_tags,
        //img : img
    }
    response.send(resdata)
    })
});


export const getasdf = functions.https.onRequest(async (request, response) => {cors(request, response, async () => {
    const number = request.query.number;
    let itemRes = await fetchData(number);
    //let img = await fetchDataPic(number);
    console.log(itemRes);
    for(let i=0;i<itemRes.product.ingredients_tags.length;i++){
        itemRes.product.ingredients_tags[i] = removeEN(itemRes.product.ingredients_tags[i]);
    }
    let resdata = {
        grade: itemRes.product.nutriscore_data.grade,
        ecoscore_grade: itemRes.product.ecoscore_grade,
        ingredients: itemRes.product.ingredients_tags,
        //categories_tags: removeEN(itemRes.product.categories_tags[0])
        //img : img
    }

    response.send(resdata)
})
});


export const pieChart = functions.https.onRequest((request, response) => {cors(request, response, async () => {
        const number = request.query.number;
        let itemResult = await fetchData(number);
        console.log(itemResult);
        for(let i=0;i<itemResult.product.ingredients_tags.length;i++){
            itemResult.product.ingredients_tags[i] = removeEN(itemResult.product.ingredients_tags[i]);
        }
        console.log(typeof itemResult.product.ingredients[0]);
        let data = makeDataForChart(itemResult.product.ingredients)
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


        chart.setOption(
            option
        );

        const svgStr = chart.renderToSVGString();
        response.send(svgStr);


    })
});

export const SendData = functions.https.onRequest((request, response) => {
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

        axios(config)
            .then(function (dataResponse) {
                console.log("data insert response", JSON.stringify(dataResponse.data));
                response.send(JSON.stringify(dataResponse.data));

            })
            .catch(function (error) {
                let errorRes = {
                    message: error.message,
                    code: error.code,
                    status: error.status
                }
                response.status(500).send(errorRes);
            });
    })
});

export const GetData = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const inputValue = request.query.team_number;
        //const HeaderDatabase = request.query.Database;
        console.log("team_number|tag", JSON.stringify(inputValue))
        const data = JSON.stringify({
            "collection": "KeyFieldDB",
            "database": "finalProductionDB",
            "dataSource": "pioneer",
            // "filter": {
            //     "inputValue": inputValue
            // }
        });

        console.log("dataa|tag", JSON.stringify(data))

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


        axios(config)
            .then(function (dataResponse) {
                console.log(JSON.stringify(dataResponse.data));

                response.send(JSON.stringify(dataResponse.data));

            })
            .catch(function (error) {
                let errorRes = {
                    message: error.message,
                    code: error.code,
                    status: error.status
                }
                response.status(500).send(errorRes);
            });
    })
});


async function fetchData(barCode: any) {
    console.log("begin fetchdata")
    try {
        const response = await fetch('https://world.openfoodfacts.net/api/v2/product/'+barCode);
        const document = response.json();
        return document;
    } catch (error) {
        console.error('Error:', error);
    }
}
function removeEN(a:string){
    let result:string = "";
    for(let i=3;i<a.length;i++){
        result = result + a.charAt(i);
    }
    return result;
}
function makeDataForChart(data: any){
    let result: any[] = []
    for(let i=0; i<data.length; i++){
        result[i] = {value: Number(data[i].percent_estimate), name: removeEN(data[i].id).toString()}

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
